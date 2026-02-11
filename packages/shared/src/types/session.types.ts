import type { CharacterStats } from './character.types';
import type { Inventory } from './inventory.types';
import type { QuestState } from './quest.types';

export type SessionStatus = 'active' | 'game_over' | 'completed';

export interface WorldState {
  currentRegionId: string;
  currentLocation: string;
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
  universeId: string;
  status: SessionStatus;
  currentStats: CharacterStats;
  inventory: Inventory;
  questState: QuestState;
  worldState: WorldState;
  turnCount: number;
  difficultyLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionInput {
  characterId: string;
  universeId: string;
}

export interface GameActionInput {
  sessionId: string;
  choiceId: string;
}

export interface SessionSummary {
  id: string;
  characterName: string;
  universeName: string;
  universeType: string;
  status: SessionStatus;
  turnCount: number;
  characterLevel: number;
  updatedAt: string;
}
