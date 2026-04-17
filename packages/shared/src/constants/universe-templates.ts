import type { UniverseType } from '../types/universe.types';

export type Locale = 'en' | 'fr';

export interface LocalizedString {
  en: string;
  fr: string;
}

export interface UniverseTemplate {
  type: UniverseType;
  name: LocalizedString;
  description: LocalizedString;
  icon: string;
  primaryResource: LocalizedString;
  secondaryResource: LocalizedString;
  themes: LocalizedString[];
  defaultFactionCount: number;
  defaultRegionCount: number;
}

export const UNIVERSE_TEMPLATES: UniverseTemplate[] = [
  {
    type: 'fantasy',
    name: { en: 'Epic Fantasy', fr: 'Fantasy Épique' },
    description: {
      en: 'A world of magic, dragons, and kingdoms at war. Forge your legend through epic quests and mythical battles.',
      fr: 'Un monde de magie, de dragons et de royaumes en guerre. Forgez votre légende à travers des quêtes épiques et des batailles mythiques.',
    },
    icon: '⚔️',
    primaryResource: { en: 'Mana', fr: 'Mana' },
    secondaryResource: { en: 'Gold', fr: 'Or' },
    themes: [
      { en: 'magic', fr: 'magie' },
      { en: 'kingdoms', fr: 'royaumes' },
      { en: 'dragons', fr: 'dragons' },
      { en: 'dungeons', fr: 'donjons' },
      { en: 'prophecies', fr: 'prophéties' },
    ],
    defaultFactionCount: 4,
    defaultRegionCount: 5,
  },
  {
    type: 'apocalypse',
    name: { en: 'Apocalypse & Survival', fr: 'Apocalypse & Survie' },
    description: {
      en: 'The world lies in ruins. Scarce resources, hostile factions, and deadly dangers at every turn. Survive at all costs.',
      fr: 'Le monde est en ruines. Ressources rares, factions hostiles et dangers mortels à chaque coin de rue. Survivez coûte que coûte.',
    },
    icon: '☢️',
    primaryResource: { en: 'Energy', fr: 'Énergie' },
    secondaryResource: { en: 'Rations', fr: 'Rations' },
    themes: [
      { en: 'survival', fr: 'survie' },
      { en: 'ruins', fr: 'ruines' },
      { en: 'mutations', fr: 'mutations' },
      { en: 'factions', fr: 'factions' },
      { en: 'scarce resources', fr: 'ressources rares' },
    ],
    defaultFactionCount: 3,
    defaultRegionCount: 4,
  },
  {
    type: 'scifi',
    name: { en: 'Stellar & Sci-Fi', fr: 'Stellaire & Sci-Fi' },
    description: {
      en: 'Explore the galaxy, discover alien civilizations, and navigate between alliances and interstellar betrayals.',
      fr: 'Explorez la galaxie, découvrez des civilisations aliens et naviguez entre alliances et trahisons interstellaires.',
    },
    icon: '🚀',
    primaryResource: { en: 'Credits', fr: 'Crédits' },
    secondaryResource: { en: 'Fuel', fr: 'Carburant' },
    themes: [
      { en: 'space exploration', fr: 'exploration spatiale' },
      { en: 'aliens', fr: 'aliens' },
      { en: 'technology', fr: 'technologie' },
      { en: 'galactic diplomacy', fr: 'diplomatie galactique' },
      { en: 'cosmic mysteries', fr: 'mystères cosmiques' },
    ],
    defaultFactionCount: 4,
    defaultRegionCount: 5,
  },
  {
    type: 'custom',
    name: { en: 'Custom Universe', fr: 'Univers Personnalisé' },
    description: {
      en: 'Create your own universe. Define the rules, races, factions, and playstyle.',
      fr: 'Créez votre propre univers. Définissez les règles, les races, les factions et le style de jeu.',
    },
    icon: '🎨',
    primaryResource: { en: 'Variable', fr: 'Variable' },
    secondaryResource: { en: 'Variable', fr: 'Variable' },
    themes: [
      { en: 'customizable', fr: 'personnalisable' },
    ],
    defaultFactionCount: 3,
    defaultRegionCount: 4,
  },
];

export const getUniverseTemplate = (type: UniverseType): UniverseTemplate | undefined => {
  return UNIVERSE_TEMPLATES.find(t => t.type === type);
};
