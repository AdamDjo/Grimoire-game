import { describe, expect, it } from 'vitest'

import { MINUTES_PER_ROOM } from './dungeon'
import {
  ascend,
  canDescend,
  computeReturnEstimate,
  createContract,
  createRunState,
  descend,
  detectReturnWarnings,
  engageReturn,
  estimateRemainingMinutes,
  hasReachedSurface,
  isValidContractDepth,
  RETURN_SAFETY_MARGIN,
  WATER_PER_RETURN_ROOM,
} from './run'

import type { ContractDepth, RunState } from '@grimoire/shared'

function contract(targetDepth: ContractDepth = 5) {
  return createContract({
    id: 'contract-1',
    destination: 'Les Salines Basses',
    targetDepth,
    rewardIron: 120,
    objective: 'Rapporter le sceau du contremaître',
  })
}

/** Run state sitting at `depth`, having descended there normally. */
function atDepth(depth: number, targetDepth: ContractDepth = 7): RunState {
  let state = createRunState(contract(targetDepth))
  for (let i = 0; i < depth; i++) state = descend(state)
  return state
}

describe('createContract', () => {
  it.each([
    [3, 45],
    [5, 90],
    [7, 150],
  ])('derives the target duration from depth %i → %i minutes', (depth, minutes) => {
    expect(
      createContract({
        id: 'c',
        destination: 'd',
        targetDepth: depth as ContractDepth,
        rewardIron: 10,
        objective: 'o',
      }).targetDurationMinutes
    ).toBe(minutes)
  })
})

describe('isValidContractDepth', () => {
  it('accepts only the three canon depths', () => {
    expect(isValidContractDepth(3)).toBe(true)
    expect(isValidContractDepth(5)).toBe(true)
    expect(isValidContractDepth(7)).toBe(true)
    expect(isValidContractDepth(4)).toBe(false)
    expect(isValidContractDepth(8)).toBe(false)
    expect(isValidContractDepth(0)).toBe(false)
  })
})

describe('descent', () => {
  it('starts at the surface with nothing secured', () => {
    const state = createRunState(contract(5))
    expect(state.currentDepth).toBe(0)
    expect(state.maxDepthReached).toBe(0)
    expect(state.returnEngaged).toBe(false)
    expect(state.objectiveSecured).toBe(false)
  })

  it('stops at the contract depth', () => {
    const state = atDepth(5, 5)
    expect(state.currentDepth).toBe(5)
    expect(canDescend(state)).toBe(false)
    expect(descend(state)).toBe(state)
  })

  it('never goes past the 7-floor ceiling, whatever the contract claims', () => {
    // Structural guarantee of the 2h30 cap, independent of the ContractDepth type.
    let state = createRunState({ ...contract(7), targetDepth: 99 as ContractDepth })
    for (let i = 0; i < 20; i++) state = descend(state)
    expect(state.currentDepth).toBe(7)
    expect(canDescend(state)).toBe(false)
  })

  it('remembers the deepest point reached after turning back', () => {
    const state = ascend(ascend(engageReturn(atDepth(4))))
    expect(state.currentDepth).toBe(2)
    expect(state.maxDepthReached).toBe(4)
  })
})

describe('engageReturn', () => {
  it('switches the run to return mode and forbids descending again', () => {
    const state = engageReturn(atDepth(3))
    expect(state.mode).toBe('return')
    expect(state.returnEngaged).toBe(true)
    expect(canDescend(state)).toBe(false)
    expect(descend(state)).toBe(state)
  })

  it('is idempotent', () => {
    const once = engageReturn(atDepth(3))
    expect(engageReturn(once)).toBe(once)
  })

  it('reaches the surface after climbing every floor', () => {
    let state = engageReturn(atDepth(3))
    expect(hasReachedSurface(state)).toBe(false)
    for (let i = 0; i < 3; i++) state = ascend(state)
    expect(state.currentDepth).toBe(0)
    expect(hasReachedSurface(state)).toBe(true)
  })

  it('does not climb before the player turned back', () => {
    const state = atDepth(3)
    expect(ascend(state)).toBe(state)
  })
})

describe('computeReturnEstimate', () => {
  it('costs more the deeper the player stands', () => {
    const supplies = { water: 10, food: 10 }
    const shallow = computeReturnEstimate(atDepth(2), supplies)
    const deep = computeReturnEstimate(atDepth(6), supplies)

    expect(deep.remainingRooms).toBeGreaterThan(shallow.remainingRooms)
    expect(deep.estimatedMinutes).toBeGreaterThan(shallow.estimatedMinutes)
    expect(deep.waterNeeded).toBeGreaterThan(shallow.waterNeeded)
  })

  it('reports minutes consistent with the rooms left to cross', () => {
    const estimate = computeReturnEstimate(atDepth(4), { water: 10, food: 10 })
    // Rounded up, so the panel never undersells how long getting home takes.
    expect(estimate.estimatedMinutes).toBe(Math.ceil(estimate.remainingRooms * MINUTES_PER_ROOM))
    expect(Number.isInteger(estimate.estimatedMinutes)).toBe(true)
  })

  it('includes a safety margin on top of the strict need', () => {
    const state = atDepth(3)
    const estimate = computeReturnEstimate(state, { water: 10, food: 10 })
    expect(estimate.waterNeeded).toBe(
      estimate.remainingRooms * WATER_PER_RETURN_ROOM + RETURN_SAFETY_MARGIN
    )
  })

  it('rates the return safe when supplies cover the need with margin', () => {
    const estimate = computeReturnEstimate(atDepth(3), { water: 20, food: 20 })
    expect(estimate.risk).toBe('safe')
    expect(estimate.suppliesShort).toBe(false)
  })

  it('rates the return tight when supplies fall just under the need', () => {
    const state = atDepth(3)
    const needed = computeReturnEstimate(state, { water: 99, food: 99 })
    const estimate = computeReturnEstimate(state, {
      water: needed.waterNeeded - 1,
      food: needed.foodNeeded,
    })
    expect(estimate.risk).toBe('tight')
    expect(estimate.suppliesShort).toBe(true)
  })

  it('rates the return critical when supplies cover less than half the need', () => {
    const state = atDepth(6)
    const estimate = computeReturnEstimate(state, { water: 1, food: 1 })
    expect(estimate.risk).toBe('critical')
    expect(estimate.suppliesShort).toBe(true)
  })

  it('lets the scarcest supply drive the risk', () => {
    // Plenty of food does not save a player who runs out of water on the climb.
    const estimate = computeReturnEstimate(atDepth(6), { water: 1, food: 99 })
    expect(estimate.risk).toBe('critical')
  })

  it('costs nothing at the surface', () => {
    const estimate = computeReturnEstimate(createRunState(contract(5)), { water: 0, food: 0 })
    expect(estimate.remainingRooms).toBe(0)
    expect(estimate.estimatedMinutes).toBe(0)
    expect(estimate.risk).toBe('safe')
  })
})

describe('estimateRemainingMinutes', () => {
  it('counts the floors still to descend plus the trip home', () => {
    const start = createRunState(contract(3))
    const halfway = atDepth(2, 3)
    expect(estimateRemainingMinutes(start)).toBeGreaterThan(estimateRemainingMinutes(halfway))
  })

  it('drops to the return cost alone once the player turned back', () => {
    const state = engageReturn(atDepth(4, 7))
    const estimate = computeReturnEstimate(state, { water: 10, food: 10 })
    expect(estimateRemainingMinutes(state)).toBe(estimate.estimatedMinutes)
  })

  it('stays inside the contract duration budget at the start of a run', () => {
    for (const depth of [3, 5, 7] as ContractDepth[]) {
      const state = createRunState(contract(depth))
      expect(estimateRemainingMinutes(state)).toBeLessThanOrEqual(
        state.contract.targetDurationMinutes
      )
    }
  })
})

describe('detectReturnWarnings', () => {
  it('warns the turn a supply drops under what getting home costs', () => {
    const state = atDepth(5)
    const needed = computeReturnEstimate(state, { water: 99, food: 99 })

    const warnings = detectReturnWarnings(
      state,
      { water: needed.waterNeeded, food: 99 },
      { water: needed.waterNeeded - 1, food: 99 }
    )

    expect(warnings).toHaveLength(1)
    expect(warnings[0].supply).toBe('water')
    expect(warnings[0].needed).toBe(needed.waterNeeded)
    expect(warnings[0].carried).toBe(needed.waterNeeded - 1)
  })

  it('warns for food on its own threshold', () => {
    const state = atDepth(5)
    const needed = computeReturnEstimate(state, { water: 99, food: 99 })

    const warnings = detectReturnWarnings(
      state,
      { water: 99, food: needed.foodNeeded },
      { water: 99, food: needed.foodNeeded - 1 }
    )

    expect(warnings.map((warning) => warning.supply)).toEqual(['food'])
  })

  it('warns for both supplies when both cross on the same turn', () => {
    const state = atDepth(5)
    const needed = computeReturnEstimate(state, { water: 99, food: 99 })

    const warnings = detectReturnWarnings(
      state,
      { water: needed.waterNeeded, food: needed.foodNeeded },
      { water: 0, food: 0 }
    )

    expect(warnings.map((warning) => warning.supply).sort()).toEqual(['food', 'water'])
  })

  it('stays silent while supplies still cover the trip home', () => {
    const state = atDepth(3)
    expect(detectReturnWarnings(state, { water: 30, food: 30 }, { water: 29, food: 29 })).toEqual(
      []
    )
  })

  it('does not repeat itself once the supply is already short', () => {
    // The warning must keep its weight — it is not per-turn noise.
    const state = atDepth(5)
    expect(detectReturnWarnings(state, { water: 1, food: 1 }, { water: 0, food: 0 })).toEqual([])
  })

  it('warns when descending alone makes the trip home unaffordable', () => {
    // The player spent nothing this turn: the threshold moved, not the supply.
    const before = atDepth(3)
    const after = descend(before)
    const needAfter = computeReturnEstimate(after, { water: 99, food: 99 })
    const needBefore = computeReturnEstimate(before, { water: 99, food: 99 })
    const carried = { water: needBefore.waterNeeded, food: 99 }

    expect(needAfter.waterNeeded).toBeGreaterThan(needBefore.waterNeeded)

    const warnings = detectReturnWarnings(after, carried, carried, before)
    expect(warnings.map((warning) => warning.supply)).toContain('water')
  })

  it('carries the resulting risk level so the prompt can pitch the warning', () => {
    // §4.2 — this lot produces the data; the AI prompt phrases it in character.
    const state = atDepth(6)
    const needed = computeReturnEstimate(state, { water: 99, food: 99 })
    const warnings = detectReturnWarnings(
      state,
      { water: needed.waterNeeded, food: 99 },
      { water: 0, food: 99 }
    )

    expect(warnings[0].risk).toBe('critical')
  })
})
