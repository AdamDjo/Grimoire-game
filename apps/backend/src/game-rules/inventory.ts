import { INVENTORY_BAG_CAPACITY, INVENTORY_EQUIPMENT_SLOTS } from '@grimoire/shared'

import type {
  ActiveCondition,
  ConditionId,
  InventoryEquipmentSlot,
  ItemGained,
  PersistedInventoryItem,
  SurvivalStats,
} from '@grimoire/shared'

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

export function isValidEquipmentSlot(slot: string): slot is InventoryEquipmentSlot {
  return (INVENTORY_EQUIPMENT_SLOTS as readonly string[]).includes(slot)
}

/** Bag items only — equipment, artifact and key items never count toward the 12-slot cap (11-INVENTORY-ECONOMY.md §1). */
function bagCount(items: PersistedInventoryItem[]): number {
  return items.filter((item) => item.category === 'bag').length
}

export interface AcquireItemResult {
  items: PersistedInventoryItem[]
  /** False when the bag was full and the item (category "bag") was dropped — narration stays, nothing is added. */
  accepted: boolean
}

/**
 * Applies a validated [IA-PROPOSÉE] `itemGained` (#183) to the persisted
 * inventory. Structural validity (known category, known slot) is already
 * checked by `scene-validator.ts` — this only enforces state-dependent rules
 * the schema cannot: bag capacity (12) and a valid slot for an equipment item.
 * Silent rejection on failure, mirroring `apply_condition` (#181): narration
 * stays, nothing is added.
 * @see docs/public/raw/11-INVENTORY-ECONOMY.md §1, docs/public/raw/15-GAME-MASTER.md §4.5
 */
export function acquireItem(
  items: PersistedInventoryItem[],
  proposal: ItemGained,
  newId: string
): AcquireItemResult {
  if (
    proposal.category === 'equipment' &&
    (!proposal.slot || !isValidEquipmentSlot(proposal.slot))
  ) {
    return { items, accepted: false }
  }

  if (proposal.category === 'bag' && bagCount(items) >= INVENTORY_BAG_CAPACITY) {
    return { items, accepted: false }
  }

  const next: PersistedInventoryItem = {
    id: newId,
    name: proposal.name,
    category: proposal.category,
    quantity: 1,
    slot: proposal.category === 'equipment' ? proposal.slot : undefined,
    effect: proposal.effect,
    description: proposal.description,
  }

  return { items: [...items, next], accepted: true }
}

export interface UseItemResult {
  items: PersistedInventoryItem[]
  survival: SurvivalStats
  conditions: ActiveCondition[]
  /** False when the item id was not found, or was equipment (equipment is worn, not consumed). */
  applied: boolean
}

/**
 * Consumes one unit of a bag/artifact/key item, applying its `ItemGainedEffect`
 * (heal, calamineReduction, removesCondition) to survival/conditions, then
 * decrementing quantity (removing the entry once it reaches 0). Equipment
 * items are never consumable here — unequip/equip is the only valid action
 * on them.
 */
export function useItem(
  items: PersistedInventoryItem[],
  itemId: string,
  survival: SurvivalStats,
  conditions: ActiveCondition[]
): UseItemResult {
  const item = items.find((i) => i.id === itemId)
  if (!item || item.category === 'equipment') {
    return { items, survival, conditions, applied: false }
  }

  const effect = item.effect
  let nextSurvival = survival
  let nextConditions = conditions

  if (effect?.healAmount) {
    nextSurvival = {
      ...nextSurvival,
      hp: clamp(nextSurvival.hp + effect.healAmount, 0, nextSurvival.maxHp),
    }
  }
  if (effect?.calamineReduction) {
    nextSurvival = {
      ...nextSurvival,
      calamine: clamp(nextSurvival.calamine - effect.calamineReduction, 0, 100),
    }
  }
  if (effect?.removesCondition) {
    const removedId = effect.removesCondition as ConditionId
    nextConditions = nextConditions.filter((condition) => condition.id !== removedId)
  }

  const remaining = item.quantity - 1
  const nextItems =
    remaining > 0
      ? items.map((i) => (i.id === itemId ? { ...i, quantity: remaining } : i))
      : items.filter((i) => i.id !== itemId)

  return { items: nextItems, survival: nextSurvival, conditions: nextConditions, applied: true }
}

export interface EquipItemResult {
  items: PersistedInventoryItem[]
  /** False when the item id was not found, is not category "equipment", or has no valid slot. */
  applied: boolean
}

/**
 * Equips an inventory item into its canon slot, automatically unequipping
 * whatever already occupies that slot (never two items in the same slot).
 * The unequipped item stays in the inventory, simply loses `equippedSlot`.
 */
export function equipItem(items: PersistedInventoryItem[], itemId: string): EquipItemResult {
  const item = items.find((i) => i.id === itemId)
  if (item?.category !== 'equipment' || !item.slot) {
    return { items, applied: false }
  }

  const nextItems = items.map((i) => {
    if (i.id === itemId) return { ...i, equippedSlot: item.slot }
    if (i.equippedSlot === item.slot) return { ...i, equippedSlot: undefined }
    return i
  })

  return { items: nextItems, applied: true }
}

export interface UnequipItemResult {
  items: PersistedInventoryItem[]
  /** False when the item id was not found or was not currently equipped. */
  applied: boolean
}

export function unequipItem(items: PersistedInventoryItem[], itemId: string): UnequipItemResult {
  const item = items.find((i) => i.id === itemId)
  if (!item?.equippedSlot) {
    return { items, applied: false }
  }

  const nextItems = items.map((i) => (i.id === itemId ? { ...i, equippedSlot: undefined } : i))
  return { items: nextItems, applied: true }
}
