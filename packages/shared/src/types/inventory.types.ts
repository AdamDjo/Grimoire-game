export type ItemType = 'weapon' | 'armor' | 'consumable' | 'quest' | 'material' | 'special';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  effects?: ItemEffect;
  value: number;
  stackable: boolean;
  maxStack?: number;
}

export interface ItemEffect {
  statModifiers?: Partial<Record<string, number>>;
  healAmount?: number;
  manaRestore?: number;
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
  gold: number;
  maxSlots: number;
}
