import { beforeEach, describe, expect, it, vi } from 'vitest'

const souvenirCount = vi.fn()
const souvenirFindMany = vi.fn()
const souvenirCreate = vi.fn()
const souvenirDeleteMany = vi.fn()
const memoryChunkFindMany = vi.fn()
vi.mock('../lib/prisma', () => ({
  prisma: {
    souvenir: {
      count: souvenirCount,
      findMany: souvenirFindMany,
      create: souvenirCreate,
      deleteMany: souvenirDeleteMany,
    },
    memoryChunk: { findMany: memoryChunkFindMany },
  },
}))

const { levenshteinDistance, validateAndPersistSouvenirCandidate, purgeInactiveSouvenirs } =
  await import('./souvenir.service')

const validCandidate = {
  title_suggestion: 'The Trader Who Never Lied',
  body: 'Yarel watched the old trader take his last breath by the dry well, and swore to carry his warning to the next town before the sun rose again.',
  type: 'npc-death' as const,
}

const pinnedFacts = ['NPC died: the Trader']

describe('levenshteinDistance', () => {
  it('returns 0 for identical strings', () => {
    expect(levenshteinDistance('The Trader', 'The Trader')).toBe(0)
  })

  it('is case-insensitive', () => {
    expect(levenshteinDistance('The Trader', 'the trader')).toBe(0)
  })

  it('returns the edit distance for different strings', () => {
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3)
  })

  it('returns the length of the other string when one is empty', () => {
    expect(levenshteinDistance('', 'abcde')).toBe(5)
  })
})

describe('validateAndPersistSouvenirCandidate', () => {
  beforeEach(() => {
    souvenirCount.mockReset().mockResolvedValue(0)
    souvenirFindMany.mockReset().mockResolvedValue([])
    souvenirCreate.mockReset().mockResolvedValue({})
    memoryChunkFindMany.mockReset().mockResolvedValue([{ keyFactsPinned: pinnedFacts }])
  })

  it('persists a valid candidate that matches a pinned fact', async () => {
    await validateAndPersistSouvenirCandidate('s1', 'user1', 'char1', validCandidate)

    expect(souvenirCreate).toHaveBeenCalledWith({
      data: {
        userId: 'user1',
        characterId: 'char1',
        sessionId: 's1',
        title: validCandidate.title_suggestion,
        body: validCandidate.body,
        type: validCandidate.type,
      },
    })
  })

  it('discards silently when the title is too short (fewer than 4 words)', async () => {
    await validateAndPersistSouvenirCandidate('s1', 'user1', 'char1', {
      ...validCandidate,
      title_suggestion: 'Two Words',
    })

    expect(souvenirCreate).not.toHaveBeenCalled()
  })

  it('discards silently when the title is too long (more than 15 words)', async () => {
    const longTitle = Array.from({ length: 16 }, (_, i) => `word${i}`).join(' ')

    await validateAndPersistSouvenirCandidate('s1', 'user1', 'char1', {
      ...validCandidate,
      title_suggestion: longTitle,
    })

    expect(souvenirCreate).not.toHaveBeenCalled()
  })

  it('discards silently when the body is too short', async () => {
    await validateAndPersistSouvenirCandidate('s1', 'user1', 'char1', {
      ...validCandidate,
      body: 'Too short a body for this.',
    })

    expect(souvenirCreate).not.toHaveBeenCalled()
  })

  it('discards silently when the body is too long (more than 90 words)', async () => {
    const longBody = Array.from({ length: 91 }, (_, i) => `word${i}`).join(' ')

    await validateAndPersistSouvenirCandidate('s1', 'user1', 'char1', {
      ...validCandidate,
      body: longBody,
    })

    expect(souvenirCreate).not.toHaveBeenCalled()
  })

  it('discards silently when the session already has 3 Souvenirs (cap)', async () => {
    souvenirCount.mockResolvedValue(3)

    await validateAndPersistSouvenirCandidate('s1', 'user1', 'char1', validCandidate)

    expect(souvenirCreate).not.toHaveBeenCalled()
  })

  it('persists when the session has fewer than 3 Souvenirs', async () => {
    souvenirCount.mockResolvedValue(2)

    await validateAndPersistSouvenirCandidate('s1', 'user1', 'char1', validCandidate)

    expect(souvenirCreate).toHaveBeenCalledTimes(1)
  })

  it('discards silently when the candidate matches no pinned fact', async () => {
    memoryChunkFindMany.mockResolvedValue([
      { keyFactsPinned: ['Quest started: locate missing cargo shipment'] },
    ])

    await validateAndPersistSouvenirCandidate('s1', 'user1', 'char1', validCandidate)

    expect(souvenirCreate).not.toHaveBeenCalled()
  })

  it('discards silently when there are no pinned facts at all', async () => {
    memoryChunkFindMany.mockResolvedValue([])

    await validateAndPersistSouvenirCandidate('s1', 'user1', 'char1', validCandidate)

    expect(souvenirCreate).not.toHaveBeenCalled()
  })

  it('discards silently when the title is a near-duplicate of an existing Souvenir (Levenshtein < 5)', async () => {
    souvenirFindMany.mockResolvedValue([{ title: 'The Trader Who Never Lies' }])

    await validateAndPersistSouvenirCandidate('s1', 'user1', 'char1', validCandidate)

    expect(souvenirCreate).not.toHaveBeenCalled()
  })

  it('persists when the title is sufficiently different from existing Souvenirs', async () => {
    souvenirFindMany.mockResolvedValue([{ title: 'An Entirely Unrelated Memory Title' }])

    await validateAndPersistSouvenirCandidate('s1', 'user1', 'char1', validCandidate)

    expect(souvenirCreate).toHaveBeenCalledTimes(1)
  })

  it('never throws when the database errors unexpectedly', async () => {
    souvenirCount.mockRejectedValue(new Error('DB down'))

    await expect(
      validateAndPersistSouvenirCandidate('s1', 'user1', 'char1', validCandidate)
    ).resolves.toBeUndefined()

    expect(souvenirCreate).not.toHaveBeenCalled()
  })

  it('never throws when create() itself fails', async () => {
    souvenirCreate.mockRejectedValue(new Error('unique constraint violation'))

    await expect(
      validateAndPersistSouvenirCandidate('s1', 'user1', 'char1', validCandidate)
    ).resolves.toBeUndefined()
  })
})

describe('purgeInactiveSouvenirs', () => {
  beforeEach(() => {
    souvenirFindMany.mockReset()
    souvenirDeleteMany.mockReset().mockResolvedValue({ count: 0 })
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  it('does nothing for a user with 20 or fewer Souvenirs', async () => {
    souvenirFindMany.mockResolvedValue(
      Array.from({ length: 20 }, (_, i) => ({ id: `sv${i}`, createdAt: new Date(0) }))
    )

    await purgeInactiveSouvenirs(['user1'])

    expect(souvenirFindMany).toHaveBeenCalledWith({
      where: { userId: 'user1' },
      orderBy: { createdAt: 'desc' },
    })
    expect(souvenirDeleteMany).not.toHaveBeenCalled()
  })

  it('never throws when the database errors unexpectedly', async () => {
    souvenirFindMany.mockRejectedValue(new Error('DB down'))

    await expect(purgeInactiveSouvenirs(['user1'])).resolves.toBeUndefined()
    expect(souvenirDeleteMany).not.toHaveBeenCalled()
  })

  it('skips a user whose most recent Souvenir is within the 6-month inactivity window', async () => {
    souvenirFindMany.mockResolvedValue(
      Array.from({ length: 25 }, (_, i) => ({ id: `sv${i}`, createdAt: new Date() }))
    )

    await purgeInactiveSouvenirs(['user1'])

    expect(souvenirFindMany).toHaveBeenCalledTimes(1)
    expect(souvenirDeleteMany).not.toHaveBeenCalled()
  })

  it('deletes the oldest Souvenirs beyond the retention count for an inactive user over the cap', async () => {
    const oldDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 7) // 7 months ago
    souvenirFindMany.mockResolvedValue(
      Array.from({ length: 25 }, (_, i) => ({ id: `sv${i}`, createdAt: oldDate }))
    )

    await purgeInactiveSouvenirs(['user1'])

    expect(souvenirDeleteMany).toHaveBeenCalledWith({
      where: { id: { in: Array.from({ length: 5 }, (_, i) => `sv${i + 20}`) } },
    })
  })

  it('never throws when deleteMany itself fails', async () => {
    const oldDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 7)
    souvenirFindMany.mockResolvedValue(
      Array.from({ length: 25 }, (_, i) => ({ id: `sv${i}`, createdAt: oldDate }))
    )
    souvenirDeleteMany.mockRejectedValue(new Error('DB down'))

    await expect(purgeInactiveSouvenirs(['user1'])).resolves.toBeUndefined()
  })
})
