import type { Attributes, Condition } from "./character.types";

export type CombatAction =
  | "attack"
  | "defend"
  | "awaken_artefact"
  | "use_item"
  | "flee"
  | "skill";

export interface CombatParticipant {
  name: string;
  hp: number;
  maxHp: number;
  attributes: Attributes;
  conditions: Condition[];
  isPlayer: boolean;
}

export interface CombatState {
  player: CombatParticipant;
  enemies: CombatParticipant[];
  round: number;
  log: CombatLogEntry[];
  status: "active" | "victory" | "defeat" | "fled";
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
  status: "victory" | "defeat" | "fled";
  loot: CombatLoot[];
  ironGained: number;
  narrative: string;
}

export interface CombatLoot {
  itemId: string;
  itemName: string;
  quantity: number;
}
