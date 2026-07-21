import { beforeEach, describe, expect, it, vi } from 'vitest'

const callOpenRouter = vi.fn()
vi.mock('../ai/openrouter.provider', () => ({ callOpenRouter }))

const characterFindFirst = vi.fn()
const characterUpdate = vi.fn()
const souvenirFindFirst = vi.fn()
const souvenirFindMany = vi.fn()
const souvenirUpdate = vi.fn()
const souvenirFindFirstOrThrow = vi.fn()
vi.mock('../lib/prisma', () => ({
  prisma: {
    character: { findFirst: characterFindFirst, update: characterUpdate },
    souvenir: {
      findFirst: souvenirFindFirst,
      findMany: souvenirFindMany,
      update: souvenirUpdate,
      findFirstOrThrow: souvenirFindFirstOrThrow,
    },
  },
}))

const {
  generateAveugleTalkResponse,
  getAveugleHubState,
  markTopicSeen,
  priceForExchange,
  SouvenirNotFoundError,
  SouvenirNotSpendableError,
  spendSouvenirForLore,
} = await import('./aveugle.service')

const character = {
  id: 'char1',
  userId: 'user1',
  name: 'Yarel',
  people: 'sahelin',
  vocation: 'salt-walker',
  iron: 12,
  aveugleSeenTopics: ['salt-guild'],
}

beforeEach(() => {
  callOpenRouter.mockReset()
  characterFindFirst.mockReset().mockResolvedValue(character)
  characterUpdate.mockReset().mockResolvedValue(character)
  souvenirFindFirst.mockReset()
  souvenirFindMany.mockReset().mockResolvedValue([])
  souvenirUpdate.mockReset()
  souvenirFindFirstOrThrow.mockReset()
  vi.spyOn(console, 'warn').mockImplementation(() => undefined)
})

describe('getAveugleHubState', () => {
  it('splits named vs spendable Souvenirs and reports iron + seen topics', async () => {
    souvenirFindMany.mockResolvedValue([
      {
        id: 's1',
        userId: 'user1',
        characterId: 'char1',
        sessionId: 'sess1',
        title: 'Named',
        body: 'b',
        type: 'npc-death',
        anonymous: false,
        sharedWithAveugle: false,
        aveugleLoreResult: null,
        createdAt: new Date(),
      },
      {
        id: 's2',
        userId: 'user1',
        characterId: 'char1',
        sessionId: 'sess1',
        title: 'Anon unspent',
        body: 'b',
        type: 'npc-death',
        anonymous: true,
        sharedWithAveugle: false,
        aveugleLoreResult: null,
        createdAt: new Date(),
      },
      {
        id: 's3',
        userId: 'user1',
        characterId: 'char1',
        sessionId: 'sess1',
        title: 'Anon spent',
        body: 'b',
        type: 'npc-death',
        anonymous: true,
        sharedWithAveugle: true,
        aveugleLoreResult: 'lore',
        createdAt: new Date(),
      },
    ])

    const state = await getAveugleHubState('user1')

    expect(state.iron).toBe(12)
    expect(state.spendableSouvenirCount).toBe(1)
    expect(state.namedSouvenirs).toHaveLength(1)
    expect(state.namedSouvenirs[0]?.id).toBe('s1')
    expect(state.seenTopicIds).toEqual(['salt-guild'])
  })

  it('returns zeroed defaults when the character does not exist yet', async () => {
    characterFindFirst.mockResolvedValue(null)

    const state = await getAveugleHubState('user1')

    expect(state.iron).toBe(0)
    expect(state.seenTopicIds).toEqual([])
  })
})

describe('markTopicSeen', () => {
  it('is a no-op when the topic was already marked seen', async () => {
    await markTopicSeen('user1', 'salt-guild')

    expect(characterUpdate).not.toHaveBeenCalled()
  })

  it('pushes the topic id when not seen yet', async () => {
    await markTopicSeen('user1', 'calcines')

    expect(characterUpdate).toHaveBeenCalledWith({
      where: { id: 'char1' },
      data: { aveugleSeenTopics: { push: 'calcines' } },
    })
  })

  it('is a no-op when the character does not exist', async () => {
    characterFindFirst.mockResolvedValue(null)

    await markTopicSeen('user1', 'calcines')

    expect(characterUpdate).not.toHaveBeenCalled()
  })
})

describe('generateAveugleTalkResponse', () => {
  it('returns the AI reply on success', async () => {
    callOpenRouter.mockResolvedValue({
      success: true,
      content: JSON.stringify({ reply: 'Le vent a parlé de toi.' }),
    })

    const result = await generateAveugleTalkResponse('user1', 'Qui es-tu ?')

    expect(result).toEqual({ reply: 'Le vent a parlé de toi.', isFallback: false })
  })

  it('falls back to a static canon-voice reply when the AI call fails', async () => {
    callOpenRouter.mockResolvedValue({ success: false, error: 'timeout' })

    const result = await generateAveugleTalkResponse('user1', 'Qui es-tu ?')

    expect(result.isFallback).toBe(true)
    expect(result.reply.length).toBeGreaterThan(0)
  })

  it('falls back when the AI returns non-JSON', async () => {
    callOpenRouter.mockResolvedValue({ success: true, content: 'not json' })

    const result = await generateAveugleTalkResponse('user1', 'Qui es-tu ?')

    expect(result.isFallback).toBe(true)
  })

  it('falls back when the AI JSON fails validation', async () => {
    callOpenRouter.mockResolvedValue({ success: true, content: JSON.stringify({}) })

    const result = await generateAveugleTalkResponse('user1', 'Qui es-tu ?')

    expect(result.isFallback).toBe(true)
  })

  it('falls back without calling the AI when the character does not exist', async () => {
    characterFindFirst.mockResolvedValue(null)

    const result = await generateAveugleTalkResponse('user1', 'Qui es-tu ?')

    expect(result.isFallback).toBe(true)
    expect(callOpenRouter).not.toHaveBeenCalled()
  })
})

describe('spendSouvenirForLore', () => {
  const anonymousSouvenir = {
    id: 'sv1',
    userId: 'user1',
    characterId: 'char1',
    sessionId: 'sess1',
    title: 'La brume dorée tue',
    body: 'b',
    type: 'secret-discovery',
    anonymous: true,
    sharedWithAveugle: false,
    aveugleLoreResult: null,
    createdAt: new Date(),
  }

  it('throws SouvenirNotFoundError when the Souvenir does not belong to the caller', async () => {
    souvenirFindFirst.mockResolvedValue(null)

    await expect(spendSouvenirForLore('user1', 'sv1', 'lore-fragment')).rejects.toThrow(
      SouvenirNotFoundError
    )
    expect(callOpenRouter).not.toHaveBeenCalled()
  })

  it('throws SouvenirNotSpendableError for a named Souvenir (anonymous: false)', async () => {
    souvenirFindFirst.mockResolvedValue({ ...anonymousSouvenir, anonymous: false })

    await expect(spendSouvenirForLore('user1', 'sv1', 'lore-fragment')).rejects.toThrow(
      SouvenirNotSpendableError
    )
    expect(callOpenRouter).not.toHaveBeenCalled()
    expect(souvenirUpdate).not.toHaveBeenCalled()
  })

  it('throws SouvenirNotSpendableError for an already-spent anonymous Souvenir', async () => {
    souvenirFindFirst.mockResolvedValue({ ...anonymousSouvenir, sharedWithAveugle: true })

    await expect(spendSouvenirForLore('user1', 'sv1', 'lore-fragment')).rejects.toThrow(
      SouvenirNotSpendableError
    )
    expect(callOpenRouter).not.toHaveBeenCalled()
  })

  it('persists sharedWithAveugle + aveugleLoreResult on AI success', async () => {
    souvenirFindFirst.mockResolvedValue(anonymousSouvenir)
    callOpenRouter.mockResolvedValue({
      success: true,
      content: JSON.stringify({ loreResult: 'Un fragment de lore.' }),
    })

    const result = await spendSouvenirForLore('user1', 'sv1', 'lore-fragment')

    expect(result).toEqual({ loreResult: 'Un fragment de lore.', souvenirId: 'sv1' })
    expect(souvenirUpdate).toHaveBeenCalledWith({
      where: { id: 'sv1' },
      data: { sharedWithAveugle: true, aveugleLoreResult: 'Un fragment de lore.' },
    })
  })

  it('never marks the Souvenir spent when the AI call fails', async () => {
    souvenirFindFirst.mockResolvedValue(anonymousSouvenir)
    callOpenRouter.mockResolvedValue({ success: false, error: 'timeout' })

    await expect(spendSouvenirForLore('user1', 'sv1', 'lore-fragment')).rejects.toThrow(
      'ai_generation_failed'
    )
    expect(souvenirUpdate).not.toHaveBeenCalled()
  })

  it('never marks the Souvenir spent when the AI returns invalid JSON', async () => {
    souvenirFindFirst.mockResolvedValue(anonymousSouvenir)
    callOpenRouter.mockResolvedValue({ success: true, content: 'not json' })

    await expect(spendSouvenirForLore('user1', 'sv1', 'lore-fragment')).rejects.toThrow(
      'ai_generation_failed'
    )
    expect(souvenirUpdate).not.toHaveBeenCalled()
  })
})

describe('priceForExchange', () => {
  it('matches the canon price table (11-INVENTORY-ECONOMY.md §3)', () => {
    expect(priceForExchange('lore-fragment')).toBe(1)
    expect(priceForExchange('artifact-identification')).toBe(1)
    expect(priceForExchange('quest-hint')).toBe(2)
    expect(priceForExchange('region-map')).toBe(3)
    expect(priceForExchange('moral-advice')).toBe(1)
  })
})
