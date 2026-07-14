import { beforeEach, describe, expect, it, vi } from 'vitest'

const hasOpenRouterKey = vi.fn()
vi.mock('../config/env', () => ({ hasOpenRouterKey }))

const memoryChunkFindMany = vi.fn().mockResolvedValue([])
const sceneLogFindMany = vi.fn().mockResolvedValue([])
const souvenirFindMany = vi.fn().mockResolvedValue([])
vi.mock('../lib/prisma', () => ({
  prisma: {
    memoryChunk: { findMany: memoryChunkFindMany },
    sceneLog: { findMany: sceneLogFindMany },
    souvenir: { findMany: souvenirFindMany },
  },
}))

const callOpenRouter = vi.fn()
vi.mock('./openrouter.provider', () => ({ callOpenRouter }))

const buildSystemPrompt = vi.fn().mockReturnValue('system prompt')
vi.mock('./system-prompt', () => ({ buildSystemPrompt }))

const { generateScene } = await import('./game-master.service')

const character = {
  id: 'char1',
  userId: 'user1',
  name: 'Yarel of the Salt Roads',
  people: 'sahelin',
  vocation: 'salt-walker',
  stats: {
    attributes: { blood: 10, breath: 10, ash: 10 },
    survival: { hp: 20, maxHp: 20, thirst: 100, hunger: 100, energy: 100, calamine: 0 },
    conditions: [],
  },
  createdAt: new Date().toISOString(),
}

const validAiPayload = {
  narrative: 'The wind carries salt across the broken road.',
  sceneType: 'exploration',
  location: 'Salt Road',
  choices: [{ text: 'Keep walking', type: 'action', riskLevel: 'safe' }],
  turnSummary: 'Yarel keeps walking down the salt road.',
}

describe('generateScene — N1 recent-turns loading', () => {
  beforeEach(() => {
    hasOpenRouterKey.mockReset()
    memoryChunkFindMany.mockClear()
    sceneLogFindMany.mockClear()
    souvenirFindMany.mockClear()
    buildSystemPrompt.mockClear()
    callOpenRouter.mockReset()
  })

  it('does not query the DB at all when there is no OpenRouter key (stub path)', async () => {
    hasOpenRouterKey.mockReturnValue(false)

    const result = await generateScene({ character, locale: 'en', sessionId: 's1' })

    expect(result.source).toBe('stub')
    expect(sceneLogFindMany).not.toHaveBeenCalled()
    expect(souvenirFindMany).not.toHaveBeenCalled()
  })

  it('queries the 5 most recent scene logs ordered by turnNumber desc, selecting only turnNumber and turnSummary', async () => {
    hasOpenRouterKey.mockReturnValue(true)
    callOpenRouter.mockResolvedValue({ success: true, content: JSON.stringify(validAiPayload) })

    await generateScene({ character, locale: 'en', sessionId: 's1' })

    expect(sceneLogFindMany).toHaveBeenCalledWith({
      where: { sessionId: 's1' },
      orderBy: { turnNumber: 'desc' },
      take: 5,
      select: { turnNumber: true, turnSummary: true },
    })
  })

  it('queries the 8 most recent memory chunks ordered by turnRangeEnd desc', async () => {
    hasOpenRouterKey.mockReturnValue(true)
    callOpenRouter.mockResolvedValue({ success: true, content: JSON.stringify(validAiPayload) })

    await generateScene({ character, locale: 'en', sessionId: 's1' })

    expect(memoryChunkFindMany).toHaveBeenCalledWith({
      where: { sessionId: 's1' },
      orderBy: { turnRangeEnd: 'desc' },
      take: 8,
    })
  })

  it('passes the loaded recent turns and souvenirs through to buildSystemPrompt', async () => {
    hasOpenRouterKey.mockReturnValue(true)
    const recentTurns = [
      { turnNumber: 3, turnSummary: 'Turn 3 happened.' },
      { turnNumber: 2, turnSummary: null },
      { turnNumber: 1, turnSummary: 'Turn 1 happened.' },
    ]
    const souvenirs = [
      { id: 'sv1', userId: 'user1', title: 'The Trader Fell', createdAt: new Date() },
    ]
    sceneLogFindMany.mockResolvedValue(recentTurns)
    souvenirFindMany.mockResolvedValue(souvenirs)
    callOpenRouter.mockResolvedValue({ success: true, content: JSON.stringify(validAiPayload) })

    await generateScene({ character, locale: 'en', sessionId: 's1' })

    expect(buildSystemPrompt).toHaveBeenCalledWith(character, 'en', [], recentTurns, souvenirs)
  })

  it('queries the 3 most recent Souvenirs for the character owner, ordered by createdAt desc', async () => {
    hasOpenRouterKey.mockReturnValue(true)
    callOpenRouter.mockResolvedValue({ success: true, content: JSON.stringify(validAiPayload) })

    await generateScene({ character, locale: 'en', sessionId: 's1' })

    expect(souvenirFindMany).toHaveBeenCalledWith({
      where: { userId: 'user1' },
      orderBy: { createdAt: 'desc' },
      take: 3,
    })
  })

  it('falls back to the stub when the AI response is missing turnSummary (Zod rejection)', async () => {
    hasOpenRouterKey.mockReturnValue(true)
    const { turnSummary: _turnSummary, ...payloadWithoutSummary } = validAiPayload
    callOpenRouter.mockResolvedValue({
      success: true,
      content: JSON.stringify(payloadWithoutSummary),
    })

    const result = await generateScene({ character, locale: 'en', sessionId: 's1' })

    expect(result.source).toBe('stub')
  })
})
