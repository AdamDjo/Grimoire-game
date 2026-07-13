import { describe, expect, it } from 'vitest'

import { resolveChoice } from './consequences'
import { TURN_DRAIN } from './survival'

import type { Attributes, Choice, SurvivalStats } from '@grimoire/shared'

const ATTRIBUTES: Attributes = { blood: 15, breath: 10, ash: 10 }

const survival = (overrides: Partial<SurvivalStats> = {}): SurvivalStats => ({
  hp: 12,
  maxHp: 12,
  thirst: 100,
  hunger: 100,
  energy: 100,
  calamine: 0,
  ...overrides,
})

const choice = (overrides: Partial<Choice> = {}): Choice => ({
  id: 'c1',
  text: 'do the thing',
  type: 'action',
  ...overrides,
})

/** rng that forces `rollCheck` to produce exactly `roll` (1–20). */
const fixedRoll = (roll: number) => () => (roll - 1) / 20

describe('resolveChoice', () => {
  it('a safe choice drains survival but never rolls', () => {
    const result = resolveChoice({
      attributes: ATTRIBUTES,
      survival: survival(),
      choice: choice({ riskLevel: 'safe' }),
    })
    expect(result.diceRoll).toBeUndefined()
    expect(result.gameOver).toBe(false)
    expect(result.updatedSurvival.thirst).toBe(100 - TURN_DRAIN.thirst)
    expect(result.updatedSurvival.hp).toBe(12)
  })

  it('a risky choice rolls the d20 and keeps hp on success', () => {
    const result = resolveChoice({
      attributes: ATTRIBUTES,
      survival: survival(),
      choice: choice({ riskLevel: 'medium' }),
      rng: fixedRoll(20), // forced success
    })
    expect(result.diceRoll?.success).toBe(true)
    expect(result.updatedSurvival.hp).toBe(12)
    expect(result.gameOver).toBe(false)
  })

  it('subtracts hp on a failed *combat* roll and records the delta', () => {
    const result = resolveChoice({
      attributes: ATTRIBUTES,
      survival: survival(),
      choice: choice({ type: 'combat', riskLevel: 'high' }),
      rng: fixedRoll(1), // natural 1 → forced failure
    })
    expect(result.diceRoll?.success).toBe(false)
    expect(result.updatedSurvival.hp).toBeLessThan(12)
    expect(result.consequences.survivalChanges?.hp).toBe(result.updatedSurvival.hp - 12)
  })

  it('subtracts hp on a failed *flee* (sauvegarde) roll — canon 06-SURVIVAL §6', () => {
    const result = resolveChoice({
      attributes: ATTRIBUTES,
      survival: survival(),
      choice: choice({ type: 'flee', riskLevel: 'high' }),
      rng: fixedRoll(1), // natural 1 → forced failure
    })
    expect(result.diceRoll?.success).toBe(false)
    expect(result.updatedSurvival.hp).toBeLessThan(12)
    expect(result.consequences.survivalChanges?.hp).toBe(result.updatedSurvival.hp - 12)
  })

  it('a failed non-physical roll costs no hp — canon: failure is a complication, not damage', () => {
    const result = resolveChoice({
      attributes: ATTRIBUTES,
      survival: survival(),
      choice: choice({ type: 'dialog', riskLevel: 'deadly' }),
      rng: fixedRoll(1), // natural 1 → forced failure
    })
    expect(result.diceRoll?.success).toBe(false)
    expect(result.updatedSurvival.hp).toBe(12)
    expect(result.consequences.survivalChanges?.hp).toBeUndefined()
    expect(result.gameOver).toBe(false)
  })

  it('flags gameOver when hp reaches 0', () => {
    const result = resolveChoice({
      attributes: ATTRIBUTES,
      survival: survival({ hp: 4 }), // deadly failure loses 20 → clamps to 0
      choice: choice({ type: 'combat', riskLevel: 'deadly' }),
      rng: fixedRoll(1),
    })
    expect(result.updatedSurvival.hp).toBe(0)
    expect(result.gameOver).toBe(true)
    expect(result.consequences.gameOver).toBe(true)
  })
})
