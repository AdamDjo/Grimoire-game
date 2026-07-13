import express from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AddressInfo } from 'node:net'

// Mock the DB and the session service — the route logic is what's under test.
const findFirst = vi.fn()
vi.mock('../lib/prisma', () => ({
  prisma: { gameSession: { findFirst } },
}))

const INVALID_CHOICE = Symbol('invalid-choice')
const resolveTurn = vi.fn()
const resolveChosenChoice = vi.fn()
vi.mock('../services/session.service', () => ({
  resolveTurn,
  resolveChosenChoice,
  INVALID_CHOICE,
  getOrCreateSession: vi.fn(),
  buildOpeningScene: vi.fn(),
}))

const { gameRouter } = await import('./game.routes')

/** Boots the router on an ephemeral port with a fixed fake auth context. */
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

async function postAction(baseUrl: string, body: unknown): Promise<Response> {
  return fetch(`${baseUrl}/api/game/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /action — session guards', () => {
  beforeEach(() => {
    findFirst.mockReset()
    resolveTurn.mockReset()
    resolveChosenChoice.mockReset()
  })

  it('refuses an action on an ended session with 409 and never resolves a turn', async () => {
    findFirst.mockResolvedValue({
      id: 's1',
      status: 'ended',
      character: { id: 'c1', userId: 'u1' },
    })

    await withServer({ userId: 'u1', isAnonymous: true }, async (baseUrl) => {
      const res = await postAction(baseUrl, { sessionId: 's1', locale: 'en' })
      expect(res.status).toBe(409)
      const body = (await res.json()) as { success: boolean }
      expect(body.success).toBe(false)
      expect(resolveTurn).not.toHaveBeenCalled()
    })
  })

  it('returns 404 when the session is not the caller’s', async () => {
    findFirst.mockResolvedValue(null)

    await withServer({ userId: 'u1', isAnonymous: false }, async (baseUrl) => {
      const res = await postAction(baseUrl, { sessionId: 'nope', locale: 'en' })
      expect(res.status).toBe(404)
      expect(resolveTurn).not.toHaveBeenCalled()
    })
  })

  it('rejects an unknown choiceId with 400 and never resolves a turn', async () => {
    findFirst.mockResolvedValue({
      id: 's1',
      status: 'active',
      character: { id: 'c1', userId: 'u1' },
    })
    resolveChosenChoice.mockResolvedValue(INVALID_CHOICE)

    await withServer({ userId: 'u1', isAnonymous: false }, async (baseUrl) => {
      const res = await postAction(baseUrl, { sessionId: 's1', choiceId: 'forged', locale: 'en' })
      expect(res.status).toBe(400)
      expect(resolveTurn).not.toHaveBeenCalled()
    })
  })
})
