export interface CharacterStats {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  strength: number;
  agility: number;
  intelligence: number;
  charisma: number;
  luck: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface CharacterTrait {
  id: string;
  name: string;
  description: string;
  effect: TraitEffect;
}

export interface TraitEffect {
  statModifiers?: Partial<Record<keyof CharacterStats, number>>;
  specialAbility?: string;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  race: string;
  class: string;
  traits: CharacterTrait[];
  baseStats: CharacterStats;
  backstory?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface CreateCharacterInput {
  name: string;
  race: string;
  class: string;
  universeType: string;
}
