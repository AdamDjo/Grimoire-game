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
    name: 'Fantasy Épique',
    description: 'Un monde de magie, de dragons et de royaumes en guerre. Forgez votre légende à travers des quêtes épiques et des batailles mythiques.',
    icon: '⚔️',
    primaryResource: 'Mana',
    secondaryResource: 'Or',
    themes: ['magie', 'royaumes', 'dragons', 'donjons', 'prophéties'],
    defaultFactionCount: 4,
    defaultRegionCount: 5,
  },
  {
    type: 'apocalypse',
    name: 'Apocalypse & Survie',
    description: 'Le monde est en ruines. Ressources rares, factions hostiles et dangers mortels à chaque coin de rue. Survivez coûte que coûte.',
    icon: '☢️',
    primaryResource: 'Énergie',
    secondaryResource: 'Rations',
    themes: ['survie', 'ruines', 'mutations', 'factions', 'ressources rares'],
    defaultFactionCount: 3,
    defaultRegionCount: 4,
  },
  {
    type: 'scifi',
    name: 'Stellaire & Sci-Fi',
    description: 'Explorez la galaxie, découvrez des civilisations aliens et naviguez entre alliances et trahisons interstellaires.',
    icon: '🚀',
    primaryResource: 'Crédits',
    secondaryResource: 'Carburant',
    themes: ['exploration spatiale', 'aliens', 'technologie', 'diplomatie galactique', 'mystères cosmiques'],
    defaultFactionCount: 4,
    defaultRegionCount: 5,
  },
  {
    type: 'custom',
    name: 'Univers Personnalisé',
    description: 'Créez votre propre univers. Définissez les règles, les races, les factions et le style de jeu.',
    icon: '🎨',
    primaryResource: 'Variable',
    secondaryResource: 'Variable',
    themes: ['personnalisable'],
    defaultFactionCount: 3,
    defaultRegionCount: 4,
  },
];

export const getUniverseTemplate = (type: UniverseType): UniverseTemplate | undefined => {
  return UNIVERSE_TEMPLATES.find(t => t.type === type);
};
