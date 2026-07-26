import { beforeEach, describe, expect, it, vi } from 'vitest'

const callOpenRouter = vi.fn()
vi.mock('../ai/openrouter.provider', () => ({ callOpenRouter }))

const userFindUnique = vi.fn()
vi.mock('../lib/prisma', () => ({
  prisma: {
    user: { findUnique: userFindUnique },
  },
}))

const { resolveVocation } = await import('./vocation-resolution.service')

const RESOLVED_JSON = {
  understood: true,
  vocationId: 'watcher',
  customVocationName: 'Traqueuse de Cendres',
  narrativeTrait: 'Ne dort jamais deux nuits au même endroit.',
  shiftedSkills: [
    { original: 'Lecture des ruines', shifted: 'Pistage de Calcinés' },
    { original: "Prudence d'artefact", shifted: 'Instinct de traque' },
  ],
  announcement: "L'Aveugle hoche la tête : « Une traqueuse. Le désert te connaît déjà. »",
}

beforeEach(() => {
  callOpenRouter.mockReset()
  userFindUnique.mockReset().mockResolvedValue(null)
  vi.spyOn(console, 'warn').mockImplementation(() => undefined)
})

describe('resolveVocation', () => {
  it('returns a resolved result with all AI fields passed through', async () => {
    callOpenRouter.mockResolvedValue({ success: true, content: JSON.stringify(RESOLVED_JSON) })

    const result = await resolveVocation('user1', 'Une vieille chasseuse de Calcinés, lasse.')

    expect(result).toEqual({
      status: 'resolved',
      vocationId: 'watcher',
      customVocationName: 'Traqueuse de Cendres',
      narrativeTrait: 'Ne dort jamais deux nuits au même endroit.',
      shiftedSkills: RESOLVED_JSON.shiftedSkills,
      announcement: RESOLVED_JSON.announcement,
    })
  })

  it('falls back with unintelligible_concept when the AI reports understood: false', async () => {
    callOpenRouter.mockResolvedValue({
      success: true,
      content: JSON.stringify({ understood: false }),
    })

    const result = await resolveVocation('user1', 'zzzzz???')

    expect(result).toEqual({ status: 'fallback', reason: 'unintelligible_concept' })
  })

  it('falls back with ai_unavailable when the provider call fails', async () => {
    callOpenRouter.mockResolvedValue({ success: false })

    const result = await resolveVocation('user1', 'Un forgeron de sel.')

    expect(result).toEqual({ status: 'fallback', reason: 'ai_unavailable' })
  })

  it('falls back with ai_unavailable when the provider returns no content', async () => {
    callOpenRouter.mockResolvedValue({ success: true, content: '' })

    const result = await resolveVocation('user1', 'Un forgeron de sel.')

    expect(result).toEqual({ status: 'fallback', reason: 'ai_unavailable' })
  })

  it('falls back with ai_unavailable when the AI returns unparseable JSON', async () => {
    callOpenRouter.mockResolvedValue({ success: true, content: 'not json at all' })

    const result = await resolveVocation('user1', 'Un forgeron de sel.')

    expect(result).toEqual({ status: 'fallback', reason: 'ai_unavailable' })
  })

  it('falls back with ai_unavailable when the AI returns a payload failing schema validation', async () => {
    callOpenRouter.mockResolvedValue({
      success: true,
      content: JSON.stringify({ ...RESOLVED_JSON, vocationId: 'sand-mage' }),
    })

    const result = await resolveVocation('user1', 'Un mage des sables.')

    expect(result).toEqual({ status: 'fallback', reason: 'ai_unavailable' })
  })

  it('resolves the player locale from user.preferredLocale', async () => {
    userFindUnique.mockResolvedValue({ preferredLocale: 'en' })
    callOpenRouter.mockResolvedValue({ success: true, content: JSON.stringify(RESOLVED_JSON) })

    await resolveVocation('user1', 'An old, tired hunter of the Calcined.')

    expect(userFindUnique).toHaveBeenCalledWith({
      where: { id: 'user1' },
      select: { preferredLocale: true },
    })
    const [[messages]] = callOpenRouter.mock.calls as [[{ role: string; content: string }[]]]
    expect(messages[0].content).toContain('Write your reply in English')
  })

  it('defaults locale to English when user.preferredLocale is null', async () => {
    userFindUnique.mockResolvedValue({ preferredLocale: null })
    callOpenRouter.mockResolvedValue({ success: true, content: JSON.stringify(RESOLVED_JSON) })

    await resolveVocation('user1', 'Some concept.')

    const [[messages]] = callOpenRouter.mock.calls as [[{ role: string; content: string }[]]]
    expect(messages[0].content).toContain('Write your reply in English')
  })
})
