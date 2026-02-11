export type SceneType = 'exploration' | 'combat' | 'dialogue' | 'event' | 'shop' | 'rest';

export interface Choice {
  id: string;
  text: string;
  type: 'action' | 'dialogue' | 'combat' | 'flee' | 'use_item' | 'skill';
  requirements?: ChoiceRequirement;
  riskLevel?: 'safe' | 'low' | 'medium' | 'high' | 'deadly';
}

export interface ChoiceRequirement {
  minStat?: Partial<Record<string, number>>;
  requiredItem?: string;
  requiredLevel?: number;
  requiredSkill?: string;
}

export interface ChoiceConsequence {
  statChanges?: Partial<Record<string, number>>;
  itemsGained?: string[];
  itemsLost?: string[];
  xpGained?: number;
  goldGained?: number;
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
  type: 'level_up' | 'item_gained' | 'item_lost' | 'quest_update' | 'stat_change' | 'warning' | 'achievement';
  message: string;
}
