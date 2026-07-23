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
      activeConditions: [],
      turnNumber: 1,
      locale: 'en',
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
      activeConditions: [],
      turnNumber: 1,
      locale: 'en',
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
      activeConditions: [],
      turnNumber: 1,
      locale: 'en',
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
      activeConditions: [],
      turnNumber: 1,
      locale: 'en',
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
      activeConditions: [],
      turnNumber: 1,
      locale: 'en',
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
      activeConditions: [],
      turnNumber: 1,
      locale: 'en',
      rng: fixedRoll(1),
    })
    expect(result.updatedSurvival.hp).toBe(0)
    expect(result.gameOver).toBe(true)
    expect(result.consequences.gameOver).toBe(true)
  })

  it("ticks an active condition's per-turn damage before rolling", () => {
    const result = resolveChoice({
      attributes: ATTRIBUTES,
      survival: survival(),
      choice: choice({ riskLevel: 'safe' }),
      activeConditions: [
        { id: 'poison', source: 'ai', appliedAtTurn: 1, expiresRule: { type: 'until_cured' } },
      ],
      turnNumber: 2,
      locale: 'en',
    })
    expect(result.updatedSurvival.hp).toBe(11)
    expect(result.consequences.survivalChanges?.hp).toBe(-1)
  })

  it('a lethal condition tick ends the game before any roll happens', () => {
    const result = resolveChoice({
      attributes: ATTRIBUTES,
      survival: survival({ hp: 1 }),
      choice: choice({ type: 'combat', riskLevel: 'deadly' }),
      activeConditions: [
        { id: 'poison', source: 'ai', appliedAtTurn: 1, expiresRule: { type: 'until_cured' } },
      ],
      turnNumber: 2,
      locale: 'en',
    })
    expect(result.gameOver).toBe(true)
    expect(result.updatedSurvival.hp).toBe(0)
    expect(result.diceRoll).toBeUndefined()
  })

  it('rolls with Désavantage when a severe condition is active (canon 08-DICE §5)', () => {
    let calls = 0
    const rolls = [18, 1] // advantage would keep 18, disadvantage keeps 1
    const rng = () => (rolls[calls++] - 1) / 20
    const result = resolveChoice({
      attributes: ATTRIBUTES,
      survival: survival(),
      choice: choice({ type: 'combat', riskLevel: 'medium' }),
      activeConditions: [
        { id: 'wound', source: 'backend', appliedAtTurn: 1, expiresRule: { type: 'until_cured' } },
      ],
      turnNumber: 2,
      locale: 'fr',
      rng,
    })
    expect(result.diceRoll?.roll).toBe(1)
    expect(result.diceRoll?.rollMode).toBe('disadvantage')
    expect(result.diceRoll?.disadvantageCause).toContain('Blessure')
  })

  it('rolls the disadvantageCause in English when session locale is en (#181 locale fix)', () => {
    let calls = 0
    const rolls = [18, 1]
    const rng = () => (rolls[calls++] - 1) / 20
    const result = resolveChoice({
      attributes: ATTRIBUTES,
      survival: survival(),
      choice: choice({ type: 'combat', riskLevel: 'medium' }),
      activeConditions: [
        { id: 'wound', source: 'backend', appliedAtTurn: 1, expiresRule: { type: 'until_cured' } },
      ],
      turnNumber: 2,
      locale: 'en',
      rng,
    })
    expect(result.diceRoll?.disadvantageCause).toContain('Wound')
    expect(result.diceRoll?.disadvantageCause).not.toContain('Blessure')
  })

  it('applies wound on a combat critical failure (natural 1)', () => {
    const result = resolveChoice({
      attributes: ATTRIBUTES,
      survival: survival(),
      choice: choice({ type: 'combat', riskLevel: 'medium' }),
      activeConditions: [],
      turnNumber: 3,
      locale: 'en',
      rng: fixedRoll(1),
    })
    expect(result.updatedConditions.some((c) => c.id === 'wound')).toBe(true)
  })

  it('applies fever automatically once hunger or thirst hits 0', () => {
    const result = resolveChoice({
      attributes: ATTRIBUTES,
      survival: survival({ hunger: TURN_DRAIN.hunger }), // drains to exactly 0 this turn
      choice: choice({ riskLevel: 'safe' }),
      activeConditions: [],
      turnNumber: 4,
      locale: 'en',
    })
    expect(result.updatedConditions.some((c) => c.id === 'fever')).toBe(true)
  })
})
