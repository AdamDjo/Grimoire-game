import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  getAveugleHub,
  getSouvenirs,
  markAveugleTopicSeen,
  spendSouvenir,
  talkToAveugle,
} from './aveugle-api'

const fetchMock = vi.fn<typeof fetch>()
vi.stubGlobal('fetch', fetchMock)

afterEach(() => {
  fetchMock.mockReset()
})

describe('Aveugle API', () => {
  it('lit le hub réel sans cache', async () => {
    const hub = {
      iron: 7,
      spendableSouvenirCount: 1,
      namedSouvenirs: [],
      seenTopicIds: ['calcines'],
    }
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: hub }), { status: 200 })
    )

    await expect(getAveugleHub()).resolves.toEqual(hub)
    expect(fetchMock).toHaveBeenCalledWith('/api/aveugle/hub', { cache: 'no-store' })
  })

  it('lit les Souvenirs pour résoudre un identifiant dépensable', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: [] }), { status: 200 })
    )

    await expect(getSouvenirs()).resolves.toEqual([])
  })

  it('marque un sujet vu via le contrat backend', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: null }), { status: 200 })
    )

    await markAveugleTopicSeen('salt/guild')
    expect(fetchMock).toHaveBeenCalledWith('/api/aveugle/topics/salt%2Fguild/seen', {
      method: 'POST',
    })
  })

  it('envoie la parole libre à L’Aveugle', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ success: true, data: { reply: 'Le sel écoute.', isFallback: false } }),
        { status: 200 }
      )
    )

    await expect(talkToAveugle('Qui es-tu ?')).resolves.toEqual({
      reply: 'Le sel écoute.',
      isFallback: false,
    })
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/aveugle/talk',
      expect.objectContaining({ body: JSON.stringify({ message: 'Qui es-tu ?' }), method: 'POST' })
    )
  })

  it('dépense le Souvenir choisi avec le type d’échange', async () => {
    const data = {
      loreResult: 'Une route dort sous le sel.',
      souvenir: { id: 'souvenir-1', sharedWithAveugle: true },
    }
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ success: true, data }), { status: 200 })
    )

    await expect(spendSouvenir('souvenir-1', 'region-map')).resolves.toEqual(data)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/aveugle/souvenirs/souvenir-1/spend',
      expect.objectContaining({
        body: JSON.stringify({ exchangeType: 'region-map' }),
        method: 'POST',
      })
    )
  })

  it('remonte les erreurs explicites du backend', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ success: false, error: 'Missing bearer token' }), {
        status: 401,
      })
    )

    await expect(getAveugleHub()).rejects.toMatchObject({
      message: 'Missing bearer token',
      status: 401,
    })
  })
})
