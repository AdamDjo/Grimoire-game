import type { CharacterStats } from "./character.types";
import type { Inventory } from "./inventory.types";
import type { QuestState } from "./quest.types";

export type SessionStatus = "active" | "game_over" | "completed";

/** Player language for the Game Master's narration. Default 'en'. */
export type Locale = "en" | "fr";

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
