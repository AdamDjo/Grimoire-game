import type { Attribute } from "./character.types";
import type { DiceRoll } from "./dice.types";
import type { ItemGained } from "./inventory.types";

export type SceneType =
  | "exploration"
  | "combat"
  | "dialog"
  | "event"
  | "shop"
  | "rest";

/** Canon biome, drives survival narration and the scene-image cache key. @see docs/public/raw/06-SURVIVAL.md §5 */
export type Biome = "tissan" | "doigts" | "rivage" | "marais_lekh" | "coeur";

/** Canon dungeon archetype, or generic outdoor. @see docs/public/raw/03-BESTIARY.md §9 */
export type LieuType =
  | "plein_air"
  | "ruines_archontiques"
  | "cryptes"
  | "cavernes_cendre"
  | "donjon_profond";

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
  /** True on the turn HP first hits 0 — one telegraphed reprieve turn before a second 0-HP hit is definitive death. */
  dying?: boolean;
}

export interface Scene {
  id: string;
  sessionId: string;
  turnNumber: number;
  narrative: string;
  /** Resolved URL from the shared scene-image cache, if resolved for this chunk. @see docs/public/tech/DYNAMIC_SCENE_IMAGES.md */
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

/**
 * A condition the AI proposes to apply. Raw, unvalidated AI output — the
 * backend is the sole authority: it checks `id` against the canon whitelist
 * and narrative plausibility before applying anything.
 * @see docs/public/raw/15-GAME-MASTER.md §4.5, docs/public/raw/06-SURVIVAL.md §2
 */
export interface ConditionProposal {
  /** Must be a canon condition id (06-SURVIVAL §2) — validated by the backend, not this type. */
  id: string;
  /** Short narrative justification, used for the plausibility check. */
  reason: string;
  /** Only meaningful when id is "cendre_corrupt". Backend caps this at +20. */
  calamineDelta?: number;
}

/** The AI signals the player wants to rest. The backend applies canon rest rates (06-SURVIVAL §3). */
export interface RestProposal {
  type: "short" | "fire" | "inn";
}

/**
 * Mechanical fields the AI may propose alongside its narration. The AI never
 * applies these itself — the backend validates and decides. Silent rejection
 * on validation failure: narration stays, the mechanical effect is dropped.
 * @see docs/public/raw/15-GAME-MASTER.md §4.5
 */
export interface AiSceneProposal {
  applyCondition?: ConditionProposal;
  itemGained?: ItemGained;
  restRequested?: RestProposal;
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

/**
 * Response to a player-initiated inventory action (use/equip/unequip, #183).
 * Unlike `SceneResponse` this never advances the turn — no scene, no dice —
 * it only reflects the resulting stats/conditions/inventory state.
 */
export interface InventoryActionResponse {
  updatedStats: Record<string, number>;
  updatedInventory: InventoryItemRef[];
  /** False when the action was rejected (unknown item, wrong category/state) — nothing changed. */
  applied: boolean;
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
