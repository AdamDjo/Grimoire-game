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

/**
 * An item the AI signals as found during a scene. The backend validates
 * (known category, bag not full, valid slot) before creating and applying it.
 * @see docs/public/raw/11-INVENTORY-ECONOMY.md, docs/public/raw/15-GAME-MASTER.md §4.5
 */
export interface ItemGained {
  name: string;
  /** One of the 4 canon categories. "special" and "material" items are AI-excluded. */
  category: "equipment" | "bag" | "artifact" | "key";
  /** Required when category is "equipment" — one of the 8 canon slots. */
  slot?: string;
  effect?: ItemGainedEffect;
  description?: string;
}

export interface ItemGainedEffect {
  healAmount?: number;
  calamineReduction?: number;
  /** Canon condition id (see character.types.ts ConditionId) to remove on use. */
  removesCondition?: string;
  /** Damage dice, e.g. "1d8". */
  damage?: string;
  attributeModifiers?: Partial<Record<Attribute, number>>;
}
