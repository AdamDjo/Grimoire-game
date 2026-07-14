import { beforeEach, describe, expect, it, vi } from 'vitest'

const callOpenRouter = vi.fn()
vi.mock('../ai/openrouter.provider', () => ({ callOpenRouter }))

const gameSessionFindUnique = vi.fn()
const memoryChunkFindMany = vi.fn()
const souvenirFindMany = vi.fn()
const chronicleCreate = vi.fn()
const sceneLogDeleteMany = vi.fn()
vi.mock('../lib/prisma', () => ({
  prisma: {
    gameSession: { findUnique: gameSessionFindUnique },
    memoryChunk: { findMany: memoryChunkFindMany },
    souvenir: { findMany: souvenirFindMany },
    chronicle: { create: chronicleCreate },
    sceneLog: { deleteMany: sceneLogDeleteMany },
  },
}))

const { generateChronicle } = await import('./chronicle.service')

const character = {
  id: 'char1',
  userId: 'user1',
  name: 'Yarel of the Salt Roads',
  people: 'sahelin',
  vocation: 'salt-walker',
}

const baseSession = {
  id: 's1',
  turnNumber: 12,
  endReason: 'inn',
  character,
}

const validOutput = {
  title: 'The Last Crossing of Yarel',
  body_markdown: 'A long literary chronicle body.',
  mood: 'epic',
  key_moments: [{ label: 'Yarel crosses the salt flats', scene_ref: 3 }],
  tagline: 'The salt remembers her name',
}

describe('generateChronicle', () => {
  beforeEach(() => {
    callOpenRouter.mockReset()
    gameSessionFindUnique.mockReset().mockResolvedValue(baseSession)
    memoryChunkFindMany.mockReset().mockResolvedValue([
      {
        summary: 'Yarel crossed the salt flats.',
        keyFactsPinned: ['Artifact obtained: shrine relic'],
      },
      { summary: 'Yarel met a wandering trader.', keyFactsPinned: ['NPC died: the Trader'] },
    ])
    souvenirFindMany
      .mockReset()
      .mockResolvedValue([{ title: 'The Trader Who Never Lied', body: 'A tale.' }])
    chronicleCreate.mockReset().mockResolvedValue({})
    sceneLogDeleteMany.mockReset().mockResolvedValue({ count: 0 })
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  it('returns generated:false without calling the AI when the session has no endReason', async () => {
    gameSessionFindUnique.mockResolvedValue({ ...baseSession, endReason: null })

    const result = await generateChronicle('s1')

    expect(result).toEqual({ generated: false })
    expect(callOpenRouter).not.toHaveBeenCalled()
  })

  it('returns generated:false when the session does not exist', async () => {
    gameSessionFindUnique.mockResolvedValue(null)

    const result = await generateChronicle('s1')

    expect(result).toEqual({ generated: false })
    expect(callOpenRouter).not.toHaveBeenCalled()
  })

  it('skips AI generation and returns tooShort when the run has fewer than 5 turns', async () => {
    gameSessionFindUnique.mockResolvedValue({ ...baseSession, turnNumber: 4 })

    const result = await generateChronicle('s1')

    expect(result).toEqual({ generated: false, tooShort: true })
    expect(callOpenRouter).not.toHaveBeenCalled()
    expect(chronicleCreate).not.toHaveBeenCalled()
  })

  it('generates and persists a Chronicle on success, then purges the session SceneLog', async () => {
    callOpenRouter.mockResolvedValue({ success: true, content: JSON.stringify(validOutput) })

    const result = await generateChronicle('s1')

    expect(result).toEqual({ generated: true })
    expect(chronicleCreate).toHaveBeenCalledWith({
      data: {
        userId: 'user1',
        characterId: 'char1',
        sessionId: 's1',
        endReason: 'inn',
        title: validOutput.title,
        bodyMarkdown: validOutput.body_markdown,
        mood: validOutput.mood,
        keyMoments: validOutput.key_moments,
        tagline: validOutput.tagline,
      },
    })
    expect(sceneLogDeleteMany).toHaveBeenCalledWith({ where: { sessionId: 's1' } })
  })

  it('passes an explicit model option through to callOpenRouter', async () => {
    callOpenRouter.mockResolvedValue({ success: true, content: JSON.stringify(validOutput) })

    await generateChronicle('s1', { model: 'premium/model' })

    expect(callOpenRouter).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({ model: 'premium/model' })
    )
  })

  it('never persists and never purges when the AI call fails', async () => {
    callOpenRouter.mockResolvedValue({ success: false, error: 'timeout' })

    const result = await generateChronicle('s1')

    expect(result).toEqual({ generated: false })
    expect(chronicleCreate).not.toHaveBeenCalled()
    expect(sceneLogDeleteMany).not.toHaveBeenCalled()
  })

  it('never persists and never purges when the AI returns non-JSON', async () => {
    callOpenRouter.mockResolvedValue({ success: true, content: 'not json' })

    const result = await generateChronicle('s1')

    expect(result).toEqual({ generated: false })
    expect(chronicleCreate).not.toHaveBeenCalled()
    expect(sceneLogDeleteMany).not.toHaveBeenCalled()
  })

  it('never persists and never purges when the AI JSON fails Zod validation', async () => {
    callOpenRouter.mockResolvedValue({
      success: true,
      content: JSON.stringify({ title: 'Too short a payload' }),
    })

    const result = await generateChronicle('s1')

    expect(result).toEqual({ generated: false })
    expect(chronicleCreate).not.toHaveBeenCalled()
    expect(sceneLogDeleteMany).not.toHaveBeenCalled()
  })

  it('deduplicates pinned facts across memory chunks', async () => {
    memoryChunkFindMany.mockResolvedValue([
      { summary: 'A', keyFactsPinned: ['Artifact obtained: shrine relic'] },
      { summary: 'B', keyFactsPinned: ['Artifact obtained: shrine relic', 'NPC died: the Trader'] },
    ])
    callOpenRouter.mockResolvedValue({ success: true, content: JSON.stringify(validOutput) })

    await generateChronicle('s1')

    const [messages] = callOpenRouter.mock.calls[0] as [{ content: string }[]]
    const prompt = messages[0].content
    const occurrences = prompt.split('Artifact obtained: shrine relic').length - 1
    expect(occurrences).toBe(1)
  })
})
