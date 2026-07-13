import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the DB so `resolveChosenChoice` reads a scene we control.
const sceneFindFirst = vi.fn()
vi.mock('../lib/prisma', () => ({
  prisma: { sceneLog: { findFirst: sceneFindFirst } },
}))

const { resolveChosenChoice, INVALID_CHOICE } = await import('./session.service')

const scene = (choices: unknown) => ({ choices })

describe('resolveChosenChoice', () => {
  beforeEach(() => {
    sceneFindFirst.mockReset()
  })

  it('resolves the risk from the persisted scene, never from the client', async () => {
    // The stored scene marks this choice deadly — the client cannot downgrade it.
    sceneFindFirst.mockResolvedValue(
      scene([{ id: 'c1', text: 'charge the wraith', type: 'combat', riskLevel: 'deadly' }])
    )

    const choice = await resolveChosenChoice('s1', 'c1', 'charge the wraith', undefined)

    if (typeof choice === 'symbol') throw new Error('expected a resolved choice')
    expect(choice.type).toBe('combat')
    expect(choice.riskLevel).toBe('deadly')
  })

  it('rejects a choiceId that is not part of the current scene', async () => {
    sceneFindFirst.mockResolvedValue(
      scene([{ id: 'c1', text: 'wait', type: 'action', riskLevel: 'safe' }])
    )

    const choice = await resolveChosenChoice('s1', 'forged-id', undefined, undefined)

    expect(choice).toBe(INVALID_CHOICE)
  })

  it('treats a free action (no choiceId) as a deliberate safe, no-roll turn', async () => {
    const choice = await resolveChosenChoice('s1', undefined, undefined, 'look around')

    if (typeof choice === 'symbol') throw new Error('expected a resolved choice')
    expect(choice.riskLevel).toBe('safe')
    expect(choice.text).toBe('look around')
    // Free actions never touch the scene log.
    expect(sceneFindFirst).not.toHaveBeenCalled()
  })
})
