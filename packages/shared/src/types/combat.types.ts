export type CombatAction = 'attack' | 'defend' | 'magic' | 'use_item' | 'flee' | 'skill';

export interface CombatParticipant {
  name: string;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  strength: number;
  agility: number;
  intelligence: number;
  isPlayer: boolean;
}

export interface CombatState {
  player: CombatParticipant;
  enemies: CombatParticipant[];
  round: number;
  log: CombatLogEntry[];
  status: 'active' | 'victory' | 'defeat' | 'fled';
}

export interface CombatLogEntry {
  round: number;
  actor: string;
  action: CombatAction;
  target?: string;
  damage?: number;
  healing?: number;
  narrative: string;
}

export interface CombatResult {
  status: 'victory' | 'defeat' | 'fled';
  xpGained: number;
  loot: CombatLoot[];
  goldGained: number;
  narrative: string;
}

export interface CombatLoot {
  itemId: string;
  itemName: string;
  quantity: number;
}
