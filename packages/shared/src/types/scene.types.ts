import type { Attribute } from "./character.types";
import type { DiceRoll } from "./dice.types";

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
  /** Backend d20 result for this turn, if a check was rolled. */
  diceRoll?: DiceRoll;
  /** Whether the narrative came from the AI or the local stub fallback. */
  source?: "ai" | "stub";
}

export interface InventoryItemRef {
  /** Actions explicitly authorized by the backend for the current scene. */
  allowedActions?: InventoryItemAction[];
  /** Generic placement hint. Worlds decide how categories map to their UI. */
  category?: InventoryItemCategory;
  description?: string;
  /** Backend-owned equipment slot id, when the item is currently worn. */
  equippedSlot?: string;
  id: string;
  name: string;
  quantity: number;
  /** Transient availability supplied by the backend contract. */
  state?: InventoryItemState;
}

export type InventoryItemAction = "use" | "equip" | "unequip" | "inspect";

export type InventoryItemCategory =
  | "equipment"
  | "bag"
  | "artifact"
  | "heirloom"
  | "key";

export type InventoryItemState = "ready" | "locked" | "pending";

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
