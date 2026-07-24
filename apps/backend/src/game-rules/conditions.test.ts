import { describe, expect, it } from 'vitest'

import {
  applyAiCondition,
  applyBackendConditions,
  clearResolvedBackendConditions,
  computeDisadvantage,
  isValidAiConditionId,
  tickConditions,
} from './conditions'

import type { ActiveCondition, SurvivalStats } from '@grimoire/shared'

const full = (overrides: Partial<SurvivalStats> = {}): SurvivalStats => ({
  hp: 12,
  maxHp: 12,
  thirst: 100,
  hunger: 100,
  energy: 100,
  calamine: 0,
  ...overrides,
})

const condition = (overrides: Partial<ActiveCondition> = {}): ActiveCondition => ({
  id: 'poison',
  source: 'ai',
  appliedAtTurn: 1,
  expiresRule: { type: 'until_cured' },
  ...overrides,
})

describe('applyBackendConditions', () => {
  it('applies fever when hunger hits 0 (06-SURVIVAL §2)', () => {
    const next = applyBackendConditions(
      [],
      { survival: full({ hunger: 0 }), woundingHit: false },
      3
    )
    expect(next.some((c) => c.id === 'fever')).toBe(true)
  })

  it('applies fever when thirst hits 0', () => {
    const next = applyBackendConditions(
      [],
      { survival: full({ thirst: 0 }), woundingHit: false },
      3
    )
    expect(next.some((c) => c.id === 'fever')).toBe(true)
  })

  it('does not apply fever when both gauges are above 0', () => {
    const next = applyBackendConditions([], { survival: full(), woundingHit: false }, 3)
    expect(next.some((c) => c.id === 'fever')).toBe(false)
  })

  it('applies wound on a wounding hit', () => {
    const next = applyBackendConditions([], { survival: full({ hp: 0 }), woundingHit: true }, 5)
    const wound = next.find((c) => c.id === 'wound')
    expect(wound).toBeDefined()
    expect(wound?.source).toBe('backend')
    expect(wound?.appliedAtTurn).toBe(5)
  })

  it('never duplicates an already-active condition', () => {
    const existing = [condition({ id: 'fever', source: 'backend' })]
    const next = applyBackendConditions(
      existing,
      { survival: full({ hunger: 0 }), woundingHit: false },
      4
    )
    expect(next.filter((c) => c.id === 'fever')).toHaveLength(1)
  })
})

describe('clearResolvedBackendConditions', () => {
  it('clears fever once hunger and thirst are both back above 0', () => {
    const active = [condition({ id: 'fever', source: 'backend' })]
    const next = clearResolvedBackendConditions(active, full())
    expect(next).toHaveLength(0)
  })

  it('keeps fever while hunger or thirst is still at 0', () => {
    const active = [condition({ id: 'fever', source: 'backend' })]
    const next = clearResolvedBackendConditions(active, full({ hunger: 0 }))
    expect(next).toHaveLength(1)
  })

  it('leaves non-fever conditions untouched', () => {
    const active = [condition({ id: 'wound', source: 'backend' })]
    const next = clearResolvedBackendConditions(active, full())
    expect(next).toHaveLength(1)
  })
})

describe('tickConditions', () => {
  it('applies poison damage per turn (06-SURVIVAL §2)', () => {
    const result = tickConditions([condition({ id: 'poison' })], full(), 2)
    expect(result.survival.hp).toBe(11)
    expect(result.lethal).toBe(false)
  })

  it('clamps hp at 0 and flags lethal', () => {
    const result = tickConditions([condition({ id: 'poison' })], full({ hp: 0 }), 2)
    expect(result.survival.hp).toBe(0)
    expect(result.lethal).toBe(true)
  })

  it('a condition can kill the character over time (Definition of Done #181)', () => {
    let survival = full({ hp: 1 })
    let conditions = [condition({ id: 'poison', appliedAtTurn: 1 })]
    const tick1 = tickConditions(conditions, survival, 2)
    survival = tick1.survival
    conditions = tick1.conditions
    expect(tick1.lethal).toBe(true)
    expect(survival.hp).toBe(0)
  })

  it('expires a "turns"-ruled condition once its count has elapsed', () => {
    const active = [
      condition({ id: 'stun', appliedAtTurn: 1, expiresRule: { type: 'turns', count: 2 } }),
    ]
    const stillActive = tickConditions(active, full(), 2)
    expect(stillActive.conditions).toHaveLength(1)
    const expired = tickConditions(active, full(), 3)
    expect(expired.conditions).toHaveLength(0)
  })

  it('leaves "until_cured" conditions active regardless of turn number', () => {
    const active = [
      condition({ id: 'freeze', appliedAtTurn: 1, expiresRule: { type: 'until_cured' } }),
    ]
    const result = tickConditions(active, full(), 50)
    expect(result.conditions).toHaveLength(1)
  })
})

describe('computeDisadvantage', () => {
  it('returns undefined with no active conditions', () => {
    expect(computeDisadvantage([], 'fr')).toBeUndefined()
  })

  it('returns undefined when no active condition is severe', () => {
    expect(computeDisadvantage([condition({ id: 'poison' })], 'fr')).toBeUndefined()
  })

  it('returns a cause in French when locale is fr', () => {
    const result = computeDisadvantage([condition({ id: 'wound', source: 'backend' })], 'fr')
    expect(result).toBeDefined()
    expect(result?.cause).toContain('Blessure')
  })

  it('returns a cause in English when locale is en (#181 locale fix)', () => {
    const result = computeDisadvantage([condition({ id: 'wound', source: 'backend' })], 'en')
    expect(result).toBeDefined()
    expect(result?.cause).toContain('Wound')
    expect(result?.cause).not.toContain('Blessure')
  })

  it('is non-cumulative: multiple severe conditions still yield a single result', () => {
    const active = [
      condition({ id: 'wound', source: 'backend' }),
      condition({ id: 'fever', source: 'backend' }),
    ]
    const result = computeDisadvantage(active, 'fr')
    expect(result).toBeDefined()
    expect(result?.cause).toContain('Blessure')
    expect(result?.cause).toContain('Fièvre')
  })
})

describe('isValidAiConditionId', () => {
  it('accepts an IA-PROPOSÉE family id', () => {
    expect(isValidAiConditionId('poison')).toBe(true)
  })

  it('rejects a BACKEND-only family id', () => {
    expect(isValidAiConditionId('fever')).toBe(false)
    expect(isValidAiConditionId('wound')).toBe(false)
  })

  it('rejects an unknown id (AI cannot invent conditions)', () => {
    expect(isValidAiConditionId('made_up_condition')).toBe(false)
  })
})

describe('applyAiCondition', () => {
  it('adds a new AI-sourced condition', () => {
    const next = applyAiCondition([], 'poison', 7)
    expect(next).toHaveLength(1)
    expect(next[0]).toMatchObject({ id: 'poison', source: 'ai', appliedAtTurn: 7 })
  })

  it('does not duplicate an already-active condition', () => {
    const existing = [condition({ id: 'poison' })]
    const next = applyAiCondition(existing, 'poison', 9)
    expect(next).toHaveLength(1)
  })
})
