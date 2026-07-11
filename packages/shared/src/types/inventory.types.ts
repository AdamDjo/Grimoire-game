import type { Attribute } from "./character.types";

export type ItemType =
  | "weapon"
  | "armor"
  | "consumable"
  | "quest"
  | "material"
  | "special";
export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  effects?: ItemEffect;
  /** Value in iron (fer). */
  value: number;
  stackable: boolean;
  maxStack?: number;
}

export interface ItemEffect {
  attributeModifiers?: Partial<Record<Attribute, number>>;
  healAmount?: number;
  /** Reduces the calamine gauge (purifying artefacts, rituals). */
  calamineReduction?: number;
  damage?: number;
  specialEffect?: string;
}

export interface InventoryItem {
  item: Item;
  quantity: number;
  equipped?: boolean;
}

export interface Inventory {
  items: InventoryItem[];
  /** Iron (fer), the Velkhar currency. */
  iron: number;
  maxSlots: number;
}
