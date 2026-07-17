import { afterEach, describe, expect, it, vi } from 'vitest'

import { getPublicChronicle, getSessionChronicle } from './chronicle-api'

import type { ChronicleApiError } from './chronicle-api'

const PRIVATE_CHRONICLE = {
  id: 'chronicle-1',
  userId: 'private-user',
  characterId: 'private-character',
  sessionId: 'private-session',
  endReason: 'death',
  title: 'Les cendres du puits',
  bodyMarkdown: 'Le sel gardait le silence.',
  mood: 'melancholic',
  keyMoments: [{ label: 'Le puits', sceneRef: 2 }],
  tagline: 'Toute route laisse une marque.',
  createdAt: '2026-07-17T00:00:00.000Z',
} as const

describe('chronicle api', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('projette le contrat privé sans identité dans le lecteur de session', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ success: true, data: PRIVATE_CHRONICLE }), { status: 200 })
      )
    vi.stubGlobal('fetch', fetchMock)

    const chronicle = await getSessionChronicle('session/1')

    expect(fetchMock).toHaveBeenCalledWith('/api/chronicles/session/session%2F1', {
      cache: 'no-store',
    })
    expect(chronicle).toEqual({
      bodyMarkdown: PRIVATE_CHRONICLE.bodyMarkdown,
      createdAt: PRIVATE_CHRONICLE.createdAt,
      endReason: PRIVATE_CHRONICLE.endReason,
      keyMoments: PRIVATE_CHRONICLE.keyMoments,
      mood: PRIVATE_CHRONICLE.mood,
      tagline: PRIVATE_CHRONICLE.tagline,
      title: PRIVATE_CHRONICLE.title,
    })
    expect(chronicle).not.toHaveProperty('userId')
    expect(chronicle).not.toHaveProperty('sessionId')
  })

  it('refuse une Chronique publique non publiée', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            data: { ...PRIVATE_CHRONICLE, published: false, slug: 'cendres-du-puits' },
          }),
          { status: 200 }
        )
      )
    )

    await expect(getPublicChronicle('cendres-du-puits')).rejects.toEqual(
      expect.objectContaining<Partial<ChronicleApiError>>({ status: 404 })
    )
  })

  it('normalise une publication partielle sans laisser passer de champs privés', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            data: {
              bodyMarkdown: 'Une dernière empreinte dans le sel.',
              published: true,
              slug: 'derniere-empreinte',
              userId: 'must-not-leak',
            },
          }),
          { status: 200 }
        )
      )
    )

    const chronicle = await getPublicChronicle('derniere-empreinte')

    expect(chronicle.title).toBe('Une Chronique de Velkhar')
    expect(chronicle.mood).toBe('melancholic')
    expect(chronicle.keyMoments).toEqual([])
    expect(chronicle).not.toHaveProperty('userId')
  })

  it('distingue une absence publique des erreurs réseau', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ success: false, error: 'Not found' }), { status: 404 })
        )
    )

    await expect(getPublicChronicle('inconnue')).rejects.toEqual(
      expect.objectContaining<Partial<ChronicleApiError>>({ status: 404 })
    )
  })
})
