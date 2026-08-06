import type { CharacterStats } from "./character.types";
import type { Inventory } from "./inventory.types";
import type { Locale } from "./locale.types";
import type { QuestState } from "./quest.types";

export type SessionStatus = "active" | "ended";

/**
 * Why a session ended. Only bridge to the A3 narrative memory layer.
 *
 * - `extracted` — the player came back **with** the contract objective (paid).
 * - `returned_empty` — the player came back alive but empty-handed (unpaid).
 * - `death` — 0 HP, the AI narrates the unconsciousness (10-COMBAT §8).
 * - `calcined` — Calamine reached 100 (06-SURVIVAL §4), the only ending
 *   without heirloom inheritance transmission (09-ACTION-LOOP endReason table).
 * - `abandon` — the player walked away voluntarily.
 *
 * The former `inn` value was replaced: it conflated "came home victorious" with
 * "came home empty-handed", two endings that neither tell the same story nor
 * pay the same. Sessions that ended through the old voluntary end-of-run flow
 * are `abandon` — none of them ever had a contract to fulfil.
 * @see docs/public/raw/23-RUN-STRUCTURE.md §5
 */
export type SessionEndReason =
  | "death"
  | "extracted"
  | "returned_empty"
  | "abandon"
  | "calcined";

export interface WorldState {
  currentRegionId: string;
  currentLocation: string;
  /** Current biome, drives survival narration. @see 06-SURVIVAL.md §5 */
  biome: string;
  factionReputation: Record<string, number>;
  discoveredRegions: string[];
  discoveredNpcs: string[];
  globalEvents: string[];
  dayCount: number;
}

export interface GameSession {
  id: string;
  userId: string;
  characterId: string;
  status: SessionStatus;
  /** Set when status is 'ended'. Undefined while the session is active. */
  endReason?: SessionEndReason;
  locale: Locale;
  currentStats: CharacterStats;
  inventory: Inventory;
  questState: QuestState;
  worldState: WorldState;
  turnCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionInput {
  characterId: string;
  locale?: Locale;
}

export interface GameActionInput {
  sessionId: string;
  choiceId?: string;
  /** Free-form action typed by the player (canon: free-action). */
  freeAction?: string;
}

export interface SessionSummary {
  id: string;
  characterName: string;
  status: SessionStatus;
  turnCount: number;
  updatedAt: string;
}
