import express from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AddressInfo } from 'node:net'

const findFirstOrThrow = vi.fn()
vi.mock('../lib/prisma', () => ({
  prisma: { souvenir: { findFirstOrThrow } },
}))

const getAveugleHubState = vi.fn()
const markTopicSeen = vi.fn()
const generateAveugleTalkResponse = vi.fn()
const spendSouvenirForLore = vi.fn()

class SouvenirNotFoundError extends Error {}
class SouvenirNotSpendableError extends Error {}

vi.mock('../services/aveugle.service', () => ({
  getAveugleHubState,
  markTopicSeen,
  generateAveugleTalkResponse,
  spendSouvenirForLore,
  SouvenirNotFoundError,
  SouvenirNotSpendableError,
}))

const { aveugleRouter } = await import('./aveugle.routes')

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
  app.use('/api/aveugle', aveugleRouter)

  const server = app.listen(0)
  await new Promise<void>((resolve) => server.once('listening', () => resolve()))
  const { port } = server.address() as AddressInfo
  try {
    await run(`http://127.0.0.1:${port}`)
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()))
  }
}

const AUTH = { userId: 'user1', isAnonymous: false }

beforeEach(() => {
  findFirstOrThrow.mockReset()
  getAveugleHubState.mockReset()
  markTopicSeen.mockReset()
  generateAveugleTalkResponse.mockReset()
  spendSouvenirForLore.mockReset()
})

describe('GET /hub', () => {
  it('returns the hub state scoped to the caller', async () => {
    getAveugleHubState.mockResolvedValue({
      gold: 5,
      spendableSouvenirCount: 2,
      namedSouvenirs: [],
      seenTopicIds: [],
    })

    await withServer(AUTH, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/api/aveugle/hub`)
      expect(res.status).toBe(200)
      const body = (await res.json()) as { success: boolean; data: { gold: number } }
      expect(body.success).toBe(true)
      expect(body.data.gold).toBe(5)
      expect(getAveugleHubState).toHaveBeenCalledWith('user1')
    })
  })
})

describe('POST /topics/:topicId/seen', () => {
  it('marks the topic seen for the caller', async () => {
    markTopicSeen.mockResolvedValue(undefined)

    await withServer(AUTH, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/api/aveugle/topics/salt-guild/seen`, { method: 'POST' })
      expect(res.status).toBe(200)
      expect(markTopicSeen).toHaveBeenCalledWith('user1', 'salt-guild')
    })
  })

  it('rejects a topicId longer than 50 characters with 400', async () => {
    await withServer(AUTH, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/api/aveugle/topics/${'a'.repeat(51)}/seen`, {
        method: 'POST',
      })
      expect(res.status).toBe(400)
      expect(markTopicSeen).not.toHaveBeenCalled()
    })
  })
})

describe('POST /talk', () => {
  it('rejects a missing message with 400 and never calls the service', async () => {
    await withServer(AUTH, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/api/aveugle/talk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      expect(res.status).toBe(400)
      expect(generateAveugleTalkResponse).not.toHaveBeenCalled()
    })
  })

  it('rejects a message over 500 characters with 400', async () => {
    await withServer(AUTH, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/api/aveugle/talk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'a'.repeat(501) }),
      })
      expect(res.status).toBe(400)
      expect(generateAveugleTalkResponse).not.toHaveBeenCalled()
    })
  })

  it('returns the reply and scopes the call to the caller userId', async () => {
    generateAveugleTalkResponse.mockResolvedValue({
      reply: 'Le sel se souvient.',
      isFallback: false,
    })

    await withServer(AUTH, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/api/aveugle/talk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Qui es-tu ?' }),
      })
      expect(res.status).toBe(200)
      const body = (await res.json()) as { data: { reply: string; isFallback: boolean } }
      expect(body.data).toEqual({ reply: 'Le sel se souvient.', isFallback: false })
      expect(generateAveugleTalkResponse).toHaveBeenCalledWith('user1', 'Qui es-tu ?')
    })
  })
})

describe('POST /souvenirs/:souvenirId/spend', () => {
  it('rejects an invalid exchangeType with 400 and never calls the service', async () => {
    await withServer(AUTH, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/api/aveugle/souvenirs/sv1/spend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exchangeType: 'not-a-real-type' }),
      })
      expect(res.status).toBe(400)
      expect(spendSouvenirForLore).not.toHaveBeenCalled()
    })
  })

  it('returns 404 when the Souvenir is not found for the caller', async () => {
    spendSouvenirForLore.mockRejectedValue(new SouvenirNotFoundError('not found'))

    await withServer(AUTH, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/api/aveugle/souvenirs/sv1/spend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exchangeType: 'lore-fragment' }),
      })
      expect(res.status).toBe(404)
    })
  })

  it('returns 409 when the Souvenir is not spendable (named or already spent)', async () => {
    spendSouvenirForLore.mockRejectedValue(new SouvenirNotSpendableError('not spendable'))

    await withServer(AUTH, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/api/aveugle/souvenirs/sv1/spend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exchangeType: 'lore-fragment' }),
      })
      expect(res.status).toBe(409)
    })
  })

  it('returns 502 when the AI generation fails, and the Souvenir stays unspent', async () => {
    spendSouvenirForLore.mockRejectedValue(new Error('ai_generation_failed'))

    await withServer(AUTH, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/api/aveugle/souvenirs/sv1/spend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exchangeType: 'lore-fragment' }),
      })
      expect(res.status).toBe(502)
      expect(findFirstOrThrow).not.toHaveBeenCalled()
    })
  })

  it('returns the lore result and updated Souvenir on success, scoped to the caller', async () => {
    spendSouvenirForLore.mockResolvedValue({
      loreResult: 'Un fragment de lore.',
      souvenirId: 'sv1',
    })
    findFirstOrThrow.mockResolvedValue({
      id: 'sv1',
      userId: 'user1',
      characterId: 'char1',
      sessionId: 'sess1',
      title: 'La brume dorée tue',
      body: 'b',
      type: 'secret-discovery',
      anonymous: true,
      sharedWithAveugle: true,
      aveugleLoreResult: 'Un fragment de lore.',
      createdAt: new Date(),
    })

    await withServer(AUTH, async (baseUrl) => {
      const res = await fetch(`${baseUrl}/api/aveugle/souvenirs/sv1/spend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exchangeType: 'lore-fragment' }),
      })
      expect(res.status).toBe(200)
      const body = (await res.json()) as {
        data: { loreResult: string; souvenir: { id: string; sharedWithAveugle: boolean } }
      }
      expect(body.data.loreResult).toBe('Un fragment de lore.')
      expect(body.data.souvenir.id).toBe('sv1')
      expect(body.data.souvenir.sharedWithAveugle).toBe(true)
      expect(spendSouvenirForLore).toHaveBeenCalledWith('user1', 'sv1', 'lore-fragment')
    })
  })
})
