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

  it('defaults to rollMode "normal" with no advantage/disadvantage', () => {
    const result = rollCheck(ATTRIBUTES, 'blood', 'medium', fixedRoll(10))
    expect(result.rollMode).toBe('normal')
    expect(result.disadvantageCause).toBeUndefined()
  })

  it('disadvantage rolls 2d20 and keeps the worst (canon 08-DICE §5)', () => {
    // sequence: first roll 18, second roll 5 → keep 5.
    let calls = 0
    const rolls = [18, 5]
    const rng = () => (rolls[calls++] - 1) / 20
    const result = rollCheck(ATTRIBUTES, 'blood', 'medium', rng, {
      disadvantage: { cause: 'wound' },
    })
    expect(result.roll).toBe(5)
    expect(result.rollMode).toBe('disadvantage')
    expect(result.disadvantageCause).toBe('wound')
  })

  it('advantage rolls 2d20 and keeps the best', () => {
    let calls = 0
    const rolls = [5, 18]
    const rng = () => (rolls[calls++] - 1) / 20
    const result = rollCheck(ATTRIBUTES, 'blood', 'medium', rng, { advantage: true })
    expect(result.roll).toBe(18)
    expect(result.rollMode).toBe('advantage')
  })

  it('multiple severe conditions never stack beyond a single disadvantage (non-cumulative)', () => {
    // Only one extra roll is consumed regardless of how many conditions impose disadvantage —
    // proven by exhausting the rng sequence after 2 values.
    const rolls = [18, 5]
    let calls = 0
    const rng = () => {
      if (calls >= rolls.length) throw new Error('rng called more than twice')
      return (rolls[calls++] - 1) / 20
    }
    const result = rollCheck(ATTRIBUTES, 'blood', 'medium', rng, {
      disadvantage: { cause: 'wound, fever' },
    })
    expect(result.roll).toBe(5)
  })

  it('advantage and disadvantage cancel out to a plain d20', () => {
    let calls = 0
    const rolls = [18, 5]
    const rng = () => {
      if (calls >= 1) throw new Error('rng should only be called once when cancelled out')
      return (rolls[calls++] - 1) / 20
    }
    const result = rollCheck(ATTRIBUTES, 'blood', 'medium', rng, {
      advantage: true,
      disadvantage: { cause: 'wound' },
    })
    expect(result.roll).toBe(18)
    expect(result.rollMode).toBe('normal')
    expect(result.disadvantageCause).toBeUndefined()
  })
})
