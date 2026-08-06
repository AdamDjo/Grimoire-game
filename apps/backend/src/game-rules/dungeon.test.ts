import { describe, expect, it } from 'vitest'

import {
  countDescentRooms,
  countReturnRooms,
  generateDescent,
  generateReturn,
  RETURN_ROOMS_PER_FLOOR,
  ROOMS_PER_FLOOR,
} from './dungeon'

import type { ContractDepth } from '@grimoire/shared'

/** Deterministic rng cycling through fixed values, so draws are reproducible. */
function seededRng(values: number[]): () => number {
  let index = 0
  return () => values[index++ % values.length]
}

const DEPTHS: ContractDepth[] = [3, 5, 7]

describe('generateDescent', () => {
  it.each(DEPTHS)('generates exactly %i floors for a contract of that depth', (depth) => {
    const floors = generateDescent(depth, seededRng([0.1, 0.4, 0.7, 0.9]))
    expect(floors).toHaveLength(depth)
    expect(floors.map((floor) => floor.depth)).toEqual(
      Array.from({ length: depth }, (_, index) => index + 1)
    )
  })

  it('never exceeds 7 floors even when called with an out-of-range depth', () => {
    // The 2h30 ceiling is structural: a bad runtime value cannot lengthen a run.
    const floors = generateDescent(99 as ContractDepth, seededRng([0.5]))
    expect(floors).toHaveLength(7)
  })

  it('fills every floor with the same number of rooms', () => {
    const floors = generateDescent(5, seededRng([0.2, 0.6, 0.35, 0.8]))
    for (const floor of floors) {
      expect(floor.rooms).toHaveLength(ROOMS_PER_FLOOR)
    }
  })

  it('offers 2 or 3 onward choices per floor, all pointing at rooms of that floor', () => {
    const floors = generateDescent(7, seededRng([0.15, 0.55, 0.25, 0.95, 0.45]))
    for (const floor of floors) {
      expect(floor.nextChoices.length).toBeGreaterThanOrEqual(2)
      expect(floor.nextChoices.length).toBeLessThanOrEqual(3)
      const roomIds = floor.rooms.map((room) => room.id)
      for (const choice of floor.nextChoices) {
        expect(roomIds).toContain(choice)
      }
    }
  })

  it('gives every room a hint whose kind matches the room type', () => {
    const floors = generateDescent(7, seededRng([0.05, 0.65, 0.3, 0.85, 0.5]))
    const expectedKind = {
      combat: 'danger',
      boss: 'danger',
      treasure: 'loot',
      respite: 'respite',
      exploration: 'unknown',
      encounter: 'unknown',
    } as const

    for (const floor of floors) {
      for (const room of floor.rooms) {
        expect(room.hint.kind).toBe(expectedKind[room.type])
        expect(room.hint.label.length).toBeGreaterThan(0)
        expect(room.cleared).toBe(false)
      }
    }
  })

  it('never leaks magnitude through the hint: a boss reads exactly like any combat room', () => {
    // Rule of the hint (§2): the sign says the nature of the danger, never how bad it is.
    const floors = generateDescent(7, seededRng([0.9, 0.1, 0.4, 0.7]))
    const bossHints = floors.flatMap((floor) =>
      floor.rooms.filter((room) => room.type === 'boss').map((room) => room.hint)
    )
    const combatHints = floors.flatMap((floor) =>
      floor.rooms.filter((room) => room.type === 'combat').map((room) => room.hint)
    )

    expect(bossHints.length).toBeGreaterThan(0)
    for (const hint of bossHints) {
      expect(hint.kind).toBe('danger')
    }
    for (const hint of combatHints) {
      expect(hint.kind).toBe('danger')
    }
  })

  it('places a boss only on deep floors, and only as the floor’s last room', () => {
    const floors = generateDescent(7, seededRng([0.3, 0.6, 0.2, 0.8]))
    for (const floor of floors) {
      floor.rooms.forEach((room, index) => {
        if (room.type !== 'boss') return
        expect(floor.depth).toBeGreaterThanOrEqual(5)
        expect(index).toBe(ROOMS_PER_FLOOR - 1)
      })
    }
    // Floors 5+ end on a boss.
    for (const floor of floors.filter((f) => f.depth >= 5)) {
      expect(floor.rooms.at(-1)!.type).toBe('boss')
    }
  })

  it('grows the share of hostile rooms with depth', () => {
    // Same rng for both, so the difference comes from the depth bias alone.
    const hostileShare = (depth: ContractDepth, floorIndex: number): number => {
      const floors = generateDescent(depth, seededRng([0.35, 0.42, 0.55, 0.6]))
      const rooms = floors[floorIndex].rooms
      return rooms.filter((room) => room.type === 'combat' || room.type === 'treasure').length
    }

    expect(hostileShare(7, 6)).toBeGreaterThanOrEqual(hostileShare(7, 0))
  })
})

describe('generateReturn', () => {
  it.each([3, 5, 7])('climbs back through every floor from depth %i', (depth) => {
    const floors = generateReturn(depth, seededRng([0.25, 0.75, 0.5]))
    expect(floors.map((floor) => floor.depth)).toEqual(
      Array.from({ length: depth }, (_, index) => depth - index)
    )
  })

  it('is strictly shorter than the descent it undoes', () => {
    // §4 "Plus court" — a return as long as the descent would be filler and would
    // break the 2h30 cap.
    for (const depth of [3, 5, 7]) {
      const descentRooms = generateDescent(depth as ContractDepth, seededRng([0.4])).flatMap(
        (floor) => floor.rooms
      )
      const returnRooms = generateReturn(depth, seededRng([0.4])).flatMap((floor) => floor.rooms)
      expect(returnRooms.length).toBeLessThan(descentRooms.length)
    }
  })

  it('is a distinct route, not the descent replayed backwards', () => {
    const descentIds = new Set(
      generateDescent(5, seededRng([0.4, 0.6])).flatMap((floor) =>
        floor.rooms.map((room) => room.id)
      )
    )
    const returnIds = generateReturn(5, seededRng([0.4, 0.6])).flatMap((floor) =>
      floor.rooms.map((room) => room.id)
    )

    for (const id of returnIds) {
      expect(descentIds.has(id)).toBe(false)
    }
  })

  it('never places a boss on the way home — the return kills by attrition, not ambush', () => {
    for (const seed of [
      [0.9, 0.1],
      [0.05, 0.95],
      [0.5, 0.5],
      [0.99, 0.99],
    ]) {
      const rooms = generateReturn(7, seededRng(seed)).flatMap((floor) => floor.rooms)
      expect(rooms.some((room) => room.type === 'boss')).toBe(false)
    }
  })

  it('caps the climb at 7 floors', () => {
    expect(generateReturn(50, seededRng([0.5]))).toHaveLength(7)
  })
})

describe('room counts', () => {
  it('matches the generated descent and return lengths', () => {
    for (const depth of [3, 5, 7] as ContractDepth[]) {
      expect(countDescentRooms(depth)).toBe(
        generateDescent(depth, seededRng([0.5])).flatMap((floor) => floor.rooms).length
      )
      expect(countReturnRooms(depth)).toBe(
        generateReturn(depth, seededRng([0.5])).flatMap((floor) => floor.rooms).length
      )
    }
  })

  it('keeps the return cheaper than the descent, floor for floor', () => {
    expect(RETURN_ROOMS_PER_FLOOR).toBeLessThan(ROOMS_PER_FLOOR)
  })
})
