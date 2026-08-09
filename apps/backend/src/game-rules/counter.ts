import { COUNTER_CATALOGUE, INVENTORY_BAG_CAPACITY, findCounterItem } from '@grimoire/shared'

import type {
  CounterCatalogItem,
  CounterPurchaseLine,
  CounterPurchaseRefusal,
  PersistedInventoryItem,
  PreparationCatalogueEntry,
  PreparationSnapshot,
} from '@grimoire/shared'

/**
 * The Comptoir's purchase arbitration (#249). Pure and deterministic: no
 * Prisma, no randomness, no AI. `counter.service.ts` is the only place that
 * persists what this module decides.
 *
 * @see docs/public/raw/11-INVENTORY-ECONOMY.md §1 (bag), §2 (prices)
 * @see docs/public/raw/23-RUN-STRUCTURE.md §1 (the Comptoir)
 */

/**
 * Bag slots consumed by an inventory list.
 *
 * One slot **per unit**, not per stack. This is the deliberate reading of canon
 * §1 ("le sac est délibérément trop petit — c'est le nerf de la préparation"):
 * carrying five waterskins must cost five of the twelve slots, otherwise the
 * arbitrage the Inn is built on ("more supplies = less room for loot") collapses
 * into a single click.
 *
 * This is the single source of truth for bag occupancy: `inventory.ts#acquireItem`
 * (AI loot, #183) calls it too. Before the Comptoir every bag entry had quantity 1,
 * so counting entries and counting units agreed; buying a stack of 12 rations broke
 * that tie, and an entry-based count would have let the player keep looting on top
 * of a bag the Comptoir already calls full.
 */
export function bagSlotsUsed(items: PersistedInventoryItem[]): number {
  return items
    .filter((item) => item.category === 'bag')
    .reduce((total, item) => total + item.quantity, 0)
}

/** Free bag slots, never negative. */
export function bagSlotsFree(items: PersistedInventoryItem[]): number {
  return Math.max(0, INVENTORY_BAG_CAPACITY - bagSlotsUsed(items))
}

export interface ResolvedPurchase {
  /** Null when the request is valid. */
  refusal: CounterPurchaseRefusal | null
  /** Total price in gold. 0 when refused. */
  totalGold: number
  /** The inventory after the purchase. Unchanged when refused. */
  items: PersistedInventoryItem[]
}

/**
 * Resolves a full purchase request atomically: either every line is applied, or
 * nothing is. Refusal order is deliberate — structural problems (unknown item,
 * bad quantity) are reported before state-dependent ones (gold, bag), so a
 * malformed request never masquerades as "you're too poor".
 *
 * `newId` produces the id of each created inventory entry; the caller injects
 * it (`randomUUID`) so this stays pure and testable.
 */
export function resolvePurchase(
  items: PersistedInventoryItem[],
  lines: CounterPurchaseLine[],
  gold: number,
  newId: () => string
): ResolvedPurchase {
  if (lines.length === 0) {
    return { refusal: 'invalid_quantity', totalGold: 0, items }
  }

  let totalGold = 0
  let totalUnits = 0
  const resolved: { entry: CounterCatalogItem; quantity: number }[] = []

  for (const line of lines) {
    if (!Number.isInteger(line.quantity) || line.quantity < 1) {
      return { refusal: 'invalid_quantity', totalGold: 0, items }
    }

    const entry = findCounterItem(line.itemId)
    if (!entry) {
      return { refusal: 'unknown_item', totalGold: 0, items }
    }

    totalGold += entry.priceGold * line.quantity
    totalUnits += line.quantity
    resolved.push({ entry, quantity: line.quantity })
  }

  if (totalGold > gold) {
    return { refusal: 'insufficient_gold', totalGold: 0, items }
  }

  if (totalUnits > bagSlotsFree(items)) {
    return { refusal: 'bag_full', totalGold: 0, items }
  }

  const purchased: PersistedInventoryItem[] = resolved.map(({ entry, quantity }) => ({
    id: newId(),
    name: entry.name,
    category: 'bag' as const,
    quantity,
    description: entry.description,
    ...(entry.supply ? { supply: entry.supply } : {}),
    ...(entry.effect ? { effect: { ...entry.effect } } : {}),
    counterItemId: entry.id,
  }))

  return { refusal: null, totalGold, items: [...items, ...purchased] }
}

/**
 * Projects what the player may buy right now. Both limits are applied: gold and
 * free bag slots. The client renders this and computes nothing — that is the
 * whole point of shipping a snapshot rather than a catalogue plus a balance.
 */
export function buildPreparationSnapshot(
  items: PersistedInventoryItem[],
  gold: number,
  supplies: { water: number; food: number }
): PreparationSnapshot {
  const used = bagSlotsUsed(items)
  const free = Math.max(0, INVENTORY_BAG_CAPACITY - used)

  const catalogue: PreparationCatalogueEntry[] = COUNTER_CATALOGUE.map((item) => {
    const byGold = Math.floor(gold / item.priceGold)
    const maxAffordableQuantity = Math.min(byGold, free)

    return {
      item,
      affordable: gold >= item.priceGold,
      maxAffordableQuantity,
    }
  })

  return {
    gold,
    bagUsed: used,
    bagCapacity: INVENTORY_BAG_CAPACITY,
    bagFree: free,
    supplies,
    catalogue,
  }
}
