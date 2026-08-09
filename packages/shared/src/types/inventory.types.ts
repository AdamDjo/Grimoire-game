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
  /** Value in gold. */
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
  /** Gold, the Velkhar currency. */
  gold: number;
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

/**
 * One item as persisted on `Character.inventory` (backend-owned JSON array).
 * Distinct from `ItemGained` (raw AI proposal) and `InventoryItemRef`
 * (scene.types.ts, the display-facing projection sent to the client) — this
 * is the durable record the backend reads/writes every turn.
 * @see docs/public/raw/11-INVENTORY-ECONOMY.md §1
 */
export interface PersistedInventoryItem {
  id: string;
  name: string;
  /** "heirloom" never appears here — it is never AI-granted (death/inheritance only, not yet implemented). */
  category: "equipment" | "bag" | "artifact" | "key";
  quantity: number;
  /** Backend-owned equipment slot id, set only while category is "equipment" and the item is worn. */
  equippedSlot?: string;
  /** One of the 8 canon slots this item may occupy — required when category is "equipment". */
  slot?: string;
  effect?: ItemGainedEffect;
  description?: string;
  /**
   * Which survival stock this item feeds, when it is one. Set structurally by
   * the Comptoir (#249) so the return estimate never has to guess from the
   * name. Absent on AI-granted loot (#183), which stays name-matched by
   * `countCarriedSupplies` — that fallback is why this field is optional and
   * not required.
   * @see docs/public/raw/11-INVENTORY-ECONOMY.md §2
   */
  supply?: "water" | "food";
  /**
   * Catalogue id when this item came from the Comptoir's closed catalogue.
   * Absent on AI-granted loot. Lets identical purchased units stack instead of
   * filling one bag slot each.
   */
  counterItemId?: string;
}

/** Canon bag capacity (11-INVENTORY-ECONOMY.md §1) — v2 has no bag extension. */
export const INVENTORY_BAG_CAPACITY = 12;

/** The 8 canon equipment slots (11-INVENTORY-ECONOMY.md §1). */
export const INVENTORY_EQUIPMENT_SLOTS = [
  "main-hand",
  "off-hand",
  "armor",
  "cloak",
  "head",
  "accessory",
  "belt",
  "feet",
] as const;

export type InventoryEquipmentSlot = (typeof INVENTORY_EQUIPMENT_SLOTS)[number];
