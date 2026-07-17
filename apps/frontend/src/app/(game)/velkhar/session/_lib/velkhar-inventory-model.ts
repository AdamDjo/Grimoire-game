import type { GameIconName } from '@/components/ui/grimoire/GameIcon/GameIcon'
import type { InventoryItemRef } from '@grimoire/shared'

export const VELKHAR_BAG_CAPACITY = 12

export const VELKHAR_EQUIPMENT_SLOTS = [
  { id: 'main-hand', icon: 'crossed-swords', label: 'Main hand' },
  { id: 'off-hand', icon: 'shield', label: 'Off hand' },
  { id: 'armor', icon: 'shield', label: 'Armor' },
  { id: 'cloak', icon: 'stranger', label: 'Cloak' },
  { id: 'head', icon: 'helmet', label: 'Head' },
  { id: 'accessory', icon: 'diamond', label: 'Accessory' },
  { id: 'belt', icon: 'key', label: 'Belt' },
  { id: 'feet', icon: 'footprint', label: 'Feet' },
] as const satisfies readonly { id: string; icon: GameIconName; label: string }[]

export interface VelkharEquipmentSlot {
  icon: GameIconName
  id: string
  item: InventoryItemRef | null
  label: string
}

export interface VelkharInventoryView {
  artifact: InventoryItemRef | null
  bagItems: InventoryItemRef[]
  equipment: VelkharEquipmentSlot[]
  heirloom: InventoryItemRef | null
}

export function buildVelkharInventoryView(items: InventoryItemRef[]): VelkharInventoryView {
  const artifact = items.find((item) => item.category === 'artifact') ?? null
  const heirloom = items.find((item) => item.category === 'heirloom') ?? null
  const equipment = VELKHAR_EQUIPMENT_SLOTS.map((slot) => ({
    ...slot,
    item: items.find((item) => item.equippedSlot === slot.id) ?? null,
  }))
  const equippedIds = new Set(equipment.flatMap((slot) => (slot.item ? [slot.item.id] : [])))
  const bagItems = items
    .filter(
      (item) =>
        item.category !== 'artifact' &&
        item.category !== 'heirloom' &&
        item.category !== 'key' &&
        !equippedIds.has(item.id)
    )
    .slice(0, VELKHAR_BAG_CAPACITY)

  return { artifact, bagItems, equipment, heirloom }
}
