import { describe, expect, it } from 'vitest'

import { applyTurnDrain, clampGauge, TURN_DRAIN } from './survival'

import type { SurvivalStats } from '@grimoire/shared'

const full = (): SurvivalStats => ({
  hp: 12,
  maxHp: 12,
  thirst: 100,
  hunger: 100,
  energy: 100,
  calamine: 0,
})

describe('applyTurnDrain', () => {
  it('drains thirst, hunger and energy by the per-turn amounts', () => {
    const next = applyTurnDrain(full())
    expect(next.thirst).toBe(100 - TURN_DRAIN.thirst)
    expect(next.hunger).toBe(100 - TURN_DRAIN.hunger)
    expect(next.energy).toBe(100 - TURN_DRAIN.energy)
  })

  it('leaves hp, maxHp and calamine untouched', () => {
    const next = applyTurnDrain(full())
    expect(next.hp).toBe(12)
    expect(next.maxHp).toBe(12)
    expect(next.calamine).toBe(0)
  })

  it('clamps gauges at 0 instead of going negative', () => {
    // Start each gauge just below its own drain so one turn would overshoot 0.
    const next = applyTurnDrain({
      ...full(),
      thirst: TURN_DRAIN.thirst - 1,
      hunger: TURN_DRAIN.hunger - 1,
      energy: TURN_DRAIN.energy - 1,
    })
    expect(next.thirst).toBe(0)
    expect(next.hunger).toBe(0)
    expect(next.energy).toBe(0)
  })
})

describe('clampGauge', () => {
  it('clamps to the 0..max range', () => {
    expect(clampGauge(-5)).toBe(0)
    expect(clampGauge(150)).toBe(100)
    expect(clampGauge(42)).toBe(42)
    expect(clampGauge(50, 30)).toBe(30)
  })
})
