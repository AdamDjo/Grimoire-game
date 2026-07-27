import { beforeEach, describe, expect, it } from 'vitest'

import {
  clearModelCooldown,
  isModelCoolingDown,
  markModelCoolingDown,
  MODEL_COOLDOWN_MS,
  prioritizeAvailableModels,
  resetModelCooldowns,
} from './model-cooldown'

const CHAIN = ['model-a', 'model-b', 'model-c'] as const

describe('model-cooldown', () => {
  beforeEach(() => {
    resetModelCooldowns()
  })

  it('reports an untouched model as available', () => {
    expect(isModelCoolingDown('model-a')).toBe(false)
  })

  it('marks a model as cooling down for the cooldown window', () => {
    const now = 1_000_000
    markModelCoolingDown('model-a', now)

    expect(isModelCoolingDown('model-a', now)).toBe(true)
    expect(isModelCoolingDown('model-a', now + MODEL_COOLDOWN_MS - 1)).toBe(true)
  })

  it('releases a model once the cooldown has elapsed', () => {
    const now = 1_000_000
    markModelCoolingDown('model-a', now)

    expect(isModelCoolingDown('model-a', now + MODEL_COOLDOWN_MS)).toBe(false)
  })

  it('clears a cooldown explicitly after a success', () => {
    const now = 1_000_000
    markModelCoolingDown('model-a', now)
    clearModelCooldown('model-a')

    expect(isModelCoolingDown('model-a', now)).toBe(false)
  })

  it('keeps the original order when nothing is cooling down', () => {
    expect(prioritizeAvailableModels(CHAIN)).toEqual(['model-a', 'model-b', 'model-c'])
  })

  it('pushes a cooling-down model to the back, preserving relative order', () => {
    const now = 1_000_000
    markModelCoolingDown('model-a', now)

    expect(prioritizeAvailableModels(CHAIN, now)).toEqual(['model-b', 'model-c', 'model-a'])
  })

  it('still returns every model when the whole chain is cooling down', () => {
    const now = 1_000_000
    for (const model of CHAIN) {
      markModelCoolingDown(model, now)
    }

    // A stale cooldown must never deny service by emptying the chain.
    expect(prioritizeAvailableModels(CHAIN, now)).toEqual(['model-a', 'model-b', 'model-c'])
  })
})
