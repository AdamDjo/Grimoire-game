import type { UniverseType } from '../types/universe.types';

export interface UniverseTemplate {
  type: UniverseType;
  name: string;
  description: string;
  icon: string;
  primaryResource: string;
  secondaryResource: string;
  themes: string[];
  defaultFactionCount: number;
  defaultRegionCount: number;
}

export const UNIVERSE_TEMPLATES: UniverseTemplate[] = [
  {
    type: 'fantasy',
    name: 'Epic Fantasy',
    description: 'A world of magic, dragons, and kingdoms at war. Forge your legend through epic quests and mythical battles.',
    icon: '⚔️',
    primaryResource: 'Mana',
    secondaryResource: 'Gold',
    themes: ['magic', 'kingdoms', 'dragons', 'dungeons', 'prophecies'],
    defaultFactionCount: 4,
    defaultRegionCount: 5,
  },
  {
    type: 'apocalypse',
    name: 'Apocalypse & Survival',
    description: 'The world lies in ruins. Scarce resources, hostile factions, and deadly dangers at every turn. Survive at all costs.',
    icon: '☢️',
    primaryResource: 'Energy',
    secondaryResource: 'Rations',
    themes: ['survival', 'ruins', 'mutations', 'factions', 'scarce resources'],
    defaultFactionCount: 3,
    defaultRegionCount: 4,
  },
  {
    type: 'scifi',
    name: 'Stellar & Sci-Fi',
    description: 'Explore the galaxy, discover alien civilizations, and navigate between alliances and interstellar betrayals.',
    icon: '🚀',
    primaryResource: 'Credits',
    secondaryResource: 'Fuel',
    themes: ['space exploration', 'aliens', 'technology', 'galactic diplomacy', 'cosmic mysteries'],
    defaultFactionCount: 4,
    defaultRegionCount: 5,
  },
  {
    type: 'custom',
    name: 'Custom Universe',
    description: 'Create your own universe. Define the rules, races, factions, and playstyle.',
    icon: '🎨',
    primaryResource: 'Variable',
    secondaryResource: 'Variable',
    themes: ['customizable'],
    defaultFactionCount: 3,
    defaultRegionCount: 4,
  },
];

export const getUniverseTemplate = (type: UniverseType): UniverseTemplate | undefined => {
  return UNIVERSE_TEMPLATES.find(t => t.type === type);
};
