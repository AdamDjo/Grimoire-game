import type { LocalizedString } from './universe-templates';

export interface RaceDefinition {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  statBonuses: Partial<Record<string, number>>;
  availableIn: string[];
}

export const RACES: Record<string, RaceDefinition[]> = {
  fantasy: [
    { id: 'human', name: { en: 'Human', fr: 'Humain' }, description: { en: 'Versatile and adaptable, humans excel in all domains.', fr: 'Polyvalent et adaptable, les humains excellent dans tous les domaines.' }, statBonuses: { charisma: 2, luck: 1 }, availableIn: ['fantasy'] },
    { id: 'elf', name: { en: 'Elf', fr: 'Elfe' }, description: { en: 'Graceful and ancient, elves master magic and agility.', fr: 'Gracieux et anciens, les elfes maîtrisent la magie et l\'agilité.' }, statBonuses: { agility: 2, intelligence: 2, strength: -1 }, availableIn: ['fantasy'] },
    { id: 'dwarf', name: { en: 'Dwarf', fr: 'Nain' }, description: { en: 'Sturdy and tenacious, dwarves are born fighters and craftsmen.', fr: 'Robustes et tenaces, les nains sont des combattants et artisans nés.' }, statBonuses: { strength: 2, maxHp: 10, agility: -1 }, availableIn: ['fantasy'] },
    { id: 'orc', name: { en: 'Orc', fr: 'Orc' }, description: { en: 'Powerful and fierce, orcs dominate through brute force.', fr: 'Puissants et féroces, les orcs dominent par la force brute.' }, statBonuses: { strength: 3, maxHp: 5, intelligence: -2 }, availableIn: ['fantasy'] },
    { id: 'halfling', name: { en: 'Halfling', fr: 'Halfelin' }, description: { en: 'Small but clever, halflings are lucky and stealthy.', fr: 'Petits mais malins, les halfelins sont chanceux et discrets.' }, statBonuses: { luck: 3, agility: 1, strength: -2 }, availableIn: ['fantasy'] },
  ],
  apocalypse: [
    { id: 'survivor', name: { en: 'Survivor', fr: 'Survivant' }, description: { en: 'A human hardened by years of survival in the ruins.', fr: 'Un humain endurci par des années de survie dans les ruines.' }, statBonuses: { maxHp: 5, luck: 1 }, availableIn: ['apocalypse'] },
    { id: 'mutant', name: { en: 'Mutant', fr: 'Mutant' }, description: { en: 'Transformed by radiation, gifted with strange abilities.', fr: 'Transformé par les radiations, doté de capacités étranges.' }, statBonuses: { strength: 2, intelligence: 1, charisma: -2 }, availableIn: ['apocalypse'] },
    { id: 'cyborg', name: { en: 'Cyborg', fr: 'Cyborg' }, description: { en: 'Half-human half-machine, augmented by pre-war technology.', fr: 'Mi-humain mi-machine, augmenté par la technologie d\'avant.' }, statBonuses: { strength: 1, agility: 1, intelligence: 1 }, availableIn: ['apocalypse'] },
    { id: 'nomad', name: { en: 'Nomad', fr: 'Nomade' }, description: { en: 'A lone traveler, expert in exploration and trade.', fr: 'Un voyageur solitaire, expert en exploration et commerce.' }, statBonuses: { agility: 2, charisma: 1, maxHp: -5 }, availableIn: ['apocalypse'] },
  ],
  scifi: [
    { id: 'terran', name: { en: 'Terran', fr: 'Terrien' }, description: { en: 'Originally from Earth, adaptable and determined.', fr: 'Originaire de la Terre, adaptable et déterminé.' }, statBonuses: { charisma: 1, luck: 1, intelligence: 1 }, availableIn: ['scifi'] },
    { id: 'synth', name: { en: 'Synthetic', fr: 'Synthétique' }, description: { en: 'Artificial intelligence in a humanoid body.', fr: 'Intelligence artificielle dans un corps humanoïde.' }, statBonuses: { intelligence: 3, strength: 1, charisma: -2 }, availableIn: ['scifi'] },
    { id: 'xenoborn', name: { en: 'Xenoborn', fr: 'Xénoné' }, description: { en: 'Born from a crossbreed with an alien species, gifted with unique senses.', fr: 'Né d\'un croisement avec une espèce alien, doté de sens uniques.' }, statBonuses: { agility: 2, intelligence: 1, luck: 1 }, availableIn: ['scifi'] },
    { id: 'voidwalker', name: { en: 'Voidwalker', fr: 'Marcheur du Vide' }, description: { en: 'Adapted to life in space, resilient and mysterious.', fr: 'Adapté à la vie dans l\'espace, résistant et mystérieux.' }, statBonuses: { maxHp: 10, maxMana: 10, charisma: -1 }, availableIn: ['scifi'] },
  ],
};

export const getRacesByUniverse = (universeType: string): RaceDefinition[] => {
  return RACES[universeType] || RACES.fantasy;
};
