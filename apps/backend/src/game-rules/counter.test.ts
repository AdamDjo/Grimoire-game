import { INVENTORY_BAG_CAPACITY } from '@grimoire/shared'
import { describe, expect, it } from 'vitest'

import { bagSlotsFree, bagSlotsUsed, buildPreparationSnapshot, resolvePurchase } from './counter'

import type { PersistedInventoryItem } from '@grimoire/shared'

/** Deterministic ids so assertions stay readable. */
function sequentialIds(): () => string {
  let n = 0
  return () => `item-${++n}`
}

function bagItem(overrides: Partial<PersistedInventoryItem> = {}): PersistedInventoryItem {
  return {
    id: 'existing',
    name: 'Corde',
    category: 'bag',
    quantity: 1,
    ...overrides,
  }
}

describe('bagSlotsUsed', () => {
  it('counts units, not entries', () => {
    expect(bagSlotsUsed([bagItem({ quantity: 4 })])).toBe(4)
  })

  it('ignores equipment, artifacts and keys', () => {
    const items: PersistedInventoryItem[] = [
      bagItem({ quantity: 2 }),
      { id: 'a', name: 'Lame', category: 'equipment', quantity: 1, slot: 'main-hand' },
      { id: 'b', name: 'Éclat', category: 'artifact', quantity: 1 },
      { id: 'c', name: 'Clé', category: 'key', quantity: 1 },
    ]
    expect(bagSlotsUsed(items)).toBe(2)
  })

  it('never reports negative free space when the bag is over capacity', () => {
    expect(bagSlotsFree([bagItem({ quantity: INVENTORY_BAG_CAPACITY + 5 })])).toBe(0)
  })
})

describe('resolvePurchase', () => {
  it('charges the canon price and adds the item to the bag', () => {
    const result = resolvePurchase([], [{ itemId: 'waterskin', quantity: 2 }], 10, sequentialIds())

    expect(result.refusal).toBeNull()
    expect(result.totalGold).toBe(4)
    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toMatchObject({
      name: "Outre d'eau pleine",
      category: 'bag',
      quantity: 2,
      supply: 'water',
      counterItemId: 'waterskin',
    })
  })

  it('sums several lines into one atomic total', () => {
    const result = resolvePurchase(
      [],
      [
        { itemId: 'waterskin', quantity: 2 },
        { itemId: 'rations', quantity: 3 },
      ],
      100,
      sequentialIds()
    )

    expect(result.totalGold).toBe(2 * 2 + 1 * 3)
    expect(result.items).toHaveLength(2)
  })

  it('refuses the whole basket when gold is short, charging nothing', () => {
    const before: PersistedInventoryItem[] = []
    const result = resolvePurchase(
      before,
      [{ itemId: 'bandages', quantity: 1 }],
      9,
      sequentialIds()
    )

    expect(result.refusal).toBe('insufficient_gold')
    expect(result.totalGold).toBe(0)
    expect(result.items).toBe(before)
  })

  it('refuses when the total exceeds free bag slots, even if affordable', () => {
    const full = [bagItem({ quantity: INVENTORY_BAG_CAPACITY - 1 })]
    const result = resolvePurchase(full, [{ itemId: 'rations', quantity: 2 }], 999, sequentialIds())

    expect(result.refusal).toBe('bag_full')
    expect(result.items).toBe(full)
  })

  it('accepts a basket that fits exactly', () => {
    const nearlyFull = [bagItem({ quantity: INVENTORY_BAG_CAPACITY - 2 })]
    const result = resolvePurchase(
      nearlyFull,
      [{ itemId: 'rations', quantity: 2 }],
      999,
      sequentialIds()
    )

    expect(result.refusal).toBeNull()
    expect(bagSlotsUsed(result.items)).toBe(INVENTORY_BAG_CAPACITY)
  })

  it('refuses an unknown catalogue id', () => {
    const result = resolvePurchase(
      [],
      [{ itemId: 'dragon' as never, quantity: 1 }],
      999,
      sequentialIds()
    )
    expect(result.refusal).toBe('unknown_item')
  })

  it.each([0, -1, 1.5])('refuses quantity %s', (quantity) => {
    const result = resolvePurchase([], [{ itemId: 'rations', quantity }], 999, sequentialIds())
    expect(result.refusal).toBe('invalid_quantity')
  })

  it('refuses an empty basket', () => {
    expect(resolvePurchase([], [], 999, sequentialIds()).refusal).toBe('invalid_quantity')
  })

  it('reports a structural problem before a wealth problem', () => {
    // Broke *and* asking for something that does not exist: the unknown id wins,
    // so the player is not told "you're too poor" about a phantom item.
    const result = resolvePurchase(
      [],
      [{ itemId: 'dragon' as never, quantity: 1 }],
      0,
      sequentialIds()
    )
    expect(result.refusal).toBe('unknown_item')
  })

  it('carries the effect of a healing item onto the persisted entry', () => {
    const result = resolvePurchase([], [{ itemId: 'bandages', quantity: 1 }], 10, sequentialIds())
    expect(result.items[0].effect).toEqual({ healAmount: 5 })
    expect(result.items[0].supply).toBeUndefined()
  })

  it('leaves the original inventory untouched on success (no mutation)', () => {
    const before = [bagItem()]
    const snapshot = JSON.stringify(before)
    resolvePurchase(before, [{ itemId: 'rations', quantity: 1 }], 999, sequentialIds())
    expect(JSON.stringify(before)).toBe(snapshot)
  })
})

describe('buildPreparationSnapshot', () => {
  it('caps the buyable quantity by gold', () => {
    const snapshot = buildPreparationSnapshot([], 5, { water: 0, food: 0 })
    const waterskin = snapshot.catalogue.find((e) => e.item.id === 'waterskin')!

    expect(waterskin.affordable).toBe(true)
    expect(waterskin.maxAffordableQuantity).toBe(2) // 5 gold / 2 each
  })

  it('caps the buyable quantity by free bag slots when gold is plentiful', () => {
    const snapshot = buildPreparationSnapshot(
      [bagItem({ quantity: INVENTORY_BAG_CAPACITY - 3 })],
      1000,
      { water: 0, food: 0 }
    )
    const rations = snapshot.catalogue.find((e) => e.item.id === 'rations')!

    expect(rations.maxAffordableQuantity).toBe(3)
    expect(snapshot.bagFree).toBe(3)
  })

  it('marks an item unaffordable when a single unit is out of reach', () => {
    const snapshot = buildPreparationSnapshot([], 1, { water: 0, food: 0 })
    const bandages = snapshot.catalogue.find((e) => e.item.id === 'bandages')!

    expect(bandages.affordable).toBe(false)
    expect(bandages.maxAffordableQuantity).toBe(0)
  })

  it('reports the canon capacity and the supplies it was given', () => {
    const snapshot = buildPreparationSnapshot([], 0, { water: 2, food: 1 })

    expect(snapshot.bagCapacity).toBe(INVENTORY_BAG_CAPACITY)
    expect(snapshot.supplies).toEqual({ water: 2, food: 1 })
  })
})
