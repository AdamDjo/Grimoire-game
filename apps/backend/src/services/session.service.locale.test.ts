import { beforeEach, describe, expect, it, vi } from 'vitest'

const gameSessionFindFirst = vi.fn()
const gameSessionCreate = vi.fn()
const userUpdate = vi.fn()
const userFindUnique = vi.fn()
const characterFindFirst = vi.fn()

vi.mock('../lib/prisma', () => ({
  prisma: {
    gameSession: { findFirst: gameSessionFindFirst, create: gameSessionCreate },
    user: { update: userUpdate, findUnique: userFindUnique },
    character: { findFirst: characterFindFirst },
  },
}))

const { getOrCreateSession } = await import('./session.service')

const character = { id: 'char1', userId: 'user1' }

/**
 * Locale is resolved once and persisted at session creation (#168). These tests
 * pin down the precedence (explicit → account → browser → English) and the
 * mid-run invariant: an already-active session never changes language, so a
 * resume — and the English-pivot memory it feeds — can't be corrupted by a new
 * browser locale.
 */
describe('getOrCreateSession — locale resolution', () => {
  beforeEach(() => {
    gameSessionFindFirst.mockReset()
    gameSessionCreate.mockReset()
    userUpdate.mockReset()
    userFindUnique.mockReset()
    characterFindFirst.mockReset()

    gameSessionFindFirst.mockResolvedValue(null)
    userFindUnique.mockResolvedValue(null)
    characterFindFirst.mockResolvedValue(character)
    gameSessionCreate.mockImplementation(({ data }) => Promise.resolve({ id: 's1', ...data }))
  })

  it('persists a resolved browser locale on a brand-new session', async () => {
    await getOrCreateSession('user1', { browserLocale: 'fr' })

    expect(gameSessionCreate).toHaveBeenCalledWith({
      data: { characterId: 'char1', locale: 'fr' },
    })
    // No explicit choice → the account preference is left untouched.
    expect(userUpdate).not.toHaveBeenCalled()
  })

  it('lets an explicit choice win and writes it to the account', async () => {
    userFindUnique.mockResolvedValue({ id: 'user1', preferredLocale: null })

    await getOrCreateSession('user1', { explicitLocale: 'es-ES', browserLocale: 'fr' })

    expect(userUpdate).toHaveBeenCalledWith({
      where: { id: 'user1' },
      data: { preferredLocale: 'es-ES' },
    })
    expect(gameSessionCreate).toHaveBeenCalledWith({
      data: { characterId: 'char1', locale: 'es-ES' },
    })
  })

  it('prefers the account preference over the browser locale', async () => {
    userFindUnique.mockResolvedValue({ id: 'user1', preferredLocale: 'de' })

    await getOrCreateSession('user1', { browserLocale: 'fr' })

    expect(gameSessionCreate).toHaveBeenCalledWith({
      data: { characterId: 'char1', locale: 'de' },
    })
  })

  it('falls back to English when no candidate is usable', async () => {
    await getOrCreateSession('user1', {})

    expect(gameSessionCreate).toHaveBeenCalledWith({
      data: { characterId: 'char1', locale: 'en' },
    })
  })

  it('keeps an active session locale unchanged — no mid-run language switch', async () => {
    gameSessionFindFirst.mockResolvedValue({
      id: 's-existing',
      characterId: 'char1',
      locale: 'fr',
      status: 'active',
      character,
    })

    const context = await getOrCreateSession('user1', { browserLocale: 'en' })

    expect(context.session.locale).toBe('fr')
    // The existing session is returned as-is; nothing is created.
    expect(gameSessionCreate).not.toHaveBeenCalled()
  })
})
