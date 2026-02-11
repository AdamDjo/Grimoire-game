export type QuestStatus = 'available' | 'active' | 'completed' | 'failed';
export type QuestType = 'main' | 'side' | 'hidden';

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  progress?: number;
  target?: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: QuestType;
  status: QuestStatus;
  objectives: QuestObjective[];
  rewards: QuestReward;
  giverNpcId?: string;
  requiredLevel?: number;
}

export interface QuestReward {
  xp: number;
  gold?: number;
  items?: string[];
  statBonus?: Partial<Record<string, number>>;
  unlocks?: string;
}

export interface QuestState {
  activeQuests: Quest[];
  completedQuestIds: string[];
  failedQuestIds: string[];
}
