import type { Attribute } from "./character.types";

export type SceneType =
  | "exploration"
  | "combat"
  | "dialog"
  | "event"
  | "shop"
  | "rest";

export interface Choice {
  id: string;
  text: string;
  type: "action" | "dialog" | "combat" | "flee" | "use_item" | "skill";
  requirements?: ChoiceRequirement;
  riskLevel?: "safe" | "low" | "medium" | "high" | "deadly";
}

export interface ChoiceRequirement {
  minAttribute?: Partial<Record<Attribute, number>>;
  requiredItem?: string;
  requiredSkill?: string;
}

export interface ChoiceConsequence {
  attributeChanges?: Partial<Record<Attribute, number>>;
  /** Survival gauge deltas (hp/thirst/hunger/energy/calamine). */
  survivalChanges?: Partial<
    Record<"hp" | "thirst" | "hunger" | "energy" | "calamine", number>
  >;
  itemsGained?: string[];
  itemsLost?: string[];
  ironGained?: number;
  factionReputation?: Record<string, number>;
  questProgress?: Record<string, string>;
  triggeredEvent?: string;
  gameOver?: boolean;
}

export interface Scene {
  id: string;
  sessionId: string;
  turnNumber: number;
  narrative: string;
  imageUrl?: string;
  imagePrompt?: string;
  choices: Choice[];
  chosenAction?: Choice;
  consequences?: ChoiceConsequence;
  sceneType: SceneType;
  location: string;
  createdAt: string;
}

export interface SceneResponse {
  scene: Scene;
  updatedStats: Record<string, number>;
  updatedInventory: InventoryItemRef[];
  notifications: GameNotification[];
}

export interface InventoryItemRef {
  id: string;
  name: string;
  quantity: number;
}

export interface GameNotification {
  type:
    | "item_gained"
    | "item_lost"
    | "quest_update"
    | "stat_change"
    | "condition"
    | "warning"
    | "memory";
  message: string;
}
