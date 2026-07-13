import { describe, expect, it } from 'vitest'

import { DIFFICULTY_TARGET, rollCheck } from './dice'

import type { Attributes } from '@grimoire/shared'

// blood 15 → modifier +2 (attributeModifier canon table).
const ATTRIBUTES: Attributes = { blood: 15, breath: 10, ash: 10 }

/** Returns an rng that makes `rollCheck` produce exactly `roll` (1–20). */
const fixedRoll = (roll: number) => () => (roll - 1) / 20

describe('rollCheck', () => {
  it('a natural 20 always succeeds, even against the deadliest target', () => {
    const result = rollCheck(ATTRIBUTES, 'ash', 'deadly', fixedRoll(20))
    expect(result.roll).toBe(20)
    expect(result.critical).toBe('success')
    expect(result.success).toBe(true)
  })

  it('a natural 1 always fails, even against the easiest target', () => {
    const result = rollCheck(ATTRIBUTES, 'blood', 'safe', fixedRoll(1))
    expect(result.roll).toBe(1)
    expect(result.critical).toBe('failure')
    expect(result.success).toBe(false)
  })

  it('adds the attribute modifier to the roll', () => {
    const result = rollCheck(ATTRIBUTES, 'blood', 'medium', fixedRoll(10))
    expect(result.modifier).toBe(2)
    expect(result.total).toBe(12)
    expect(result.target).toBe(DIFFICULTY_TARGET.medium)
  })

  it('succeeds when total meets the target, fails just below it', () => {
    // Derive the exact rolls from the canon target so this holds under retuning.
    // blood mod +2: the roll that lands total exactly on target succeeds…
    const onTarget = DIFFICULTY_TARGET.medium - 2
    expect(rollCheck(ATTRIBUTES, 'blood', 'medium', fixedRoll(onTarget)).success).toBe(true)
    // …and one point below fails (and is not a natural 1).
    const below = rollCheck(ATTRIBUTES, 'blood', 'medium', fixedRoll(onTarget - 1))
    expect(below.critical).toBeNull()
    expect(below.success).toBe(false)
  })
})
