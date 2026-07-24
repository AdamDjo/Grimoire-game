import express from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AddressInfo } from 'node:net'

const performInventoryAction = vi.fn()
vi.mock('../services/session.service', () => ({
  performInventoryAction,
  resolveTurn: vi.fn(),
  resolveChosenChoice: vi.fn(),
  INVALID_CHOICE: Symbol('invalid-choice'),
  getOrCreateSession: vi.fn(),
  buildOpeningScene: vi.fn(),
}))

const { gameRouter } = await import('./game.routes')

async function withServer(
  auth: { userId: string; isAnonymous: boolean },
  run: (baseUrl: string) => Promise<void>
): Promise<void> {
  const app = express()
  app.use(express.json())
  app.use((req, _res, next) => {
    req.auth = auth
    next()
  })
  app.use('/api/game', gameRouter)

  const server = app.listen(0)
  await new Promise<void>((resolve) => server.once('listening', () => resolve()))
  const { port } = server.address() as AddressInfo
  try {
    await run(`http://127.0.0.1:${port}`)
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
}

async function postInventoryAction(baseUrl: string, body: unknown): Promise<Response> {
  return fetch(`${baseUrl}/api/game/inventory/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /inventory/action (#183)', () => {
  beforeEach(() => {
    performInventoryAction.mockReset()
  })

  it('rejects a payload with an invalid action with 400', async () => {
    await withServer({ userId: 'u1', isAnonymous: false }, async (baseUrl) => {
      const res = await postInventoryAction(baseUrl, {
        sessionId: 's1',
        itemId: 'item1',
        action: 'discard',
      })
      expect(res.status).toBe(400)
      expect(performInventoryAction).not.toHaveBeenCalled()
    })
  })

  it('rejects a payload missing itemId with 400', async () => {
    await withServer({ userId: 'u1', isAnonymous: false }, async (baseUrl) => {
      const res = await postInventoryAction(baseUrl, { sessionId: 's1', action: 'use' })
      expect(res.status).toBe(400)
      expect(performInventoryAction).not.toHaveBeenCalled()
    })
  })

  it('returns 404 when the service reports no active session for the caller', async () => {
    performInventoryAction.mockResolvedValue(null)

    await withServer({ userId: 'u1', isAnonymous: false }, async (baseUrl) => {
      const res = await postInventoryAction(baseUrl, {
        sessionId: 'nope',
        itemId: 'item1',
        action: 'use',
      })
      expect(res.status).toBe(404)
      const body = (await res.json()) as { success: boolean }
      expect(body.success).toBe(false)
    })
  })

  it('returns 200 with the service response on success', async () => {
    performInventoryAction.mockResolvedValue({
      updatedStats: { hp: 17, maxHp: 20, thirst: 100, hunger: 100, energy: 100, calamine: 10 },
      updatedInventory: [],
      applied: true,
    })

    await withServer({ userId: 'u1', isAnonymous: false }, async (baseUrl) => {
      const res = await postInventoryAction(baseUrl, {
        sessionId: 's1',
        itemId: 'item1',
        action: 'use',
      })
      expect(res.status).toBe(200)
      const body = (await res.json()) as { success: boolean; data: { applied: boolean } }
      expect(body.success).toBe(true)
      expect(body.data.applied).toBe(true)
      expect(performInventoryAction).toHaveBeenCalledWith(
        { sessionId: 's1', itemId: 'item1', action: 'use' },
        'u1'
      )
    })
  })
})
