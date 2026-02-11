export interface RaceDefinition {
  id: string;
  name: string;
  description: string;
  statBonuses: Partial<Record<string, number>>;
  availableIn: string[];
}

export const RACES: Record<string, RaceDefinition[]> = {
  fantasy: [
    { id: 'human', name: 'Humain', description: 'Polyvalent et adaptable, les humains excellent dans tous les domaines.', statBonuses: { charisma: 2, luck: 1 }, availableIn: ['fantasy'] },
    { id: 'elf', name: 'Elfe', description: 'Gracieux et anciens, les elfes maîtrisent la magie et l\'agilité.', statBonuses: { agility: 2, intelligence: 2, strength: -1 }, availableIn: ['fantasy'] },
    { id: 'dwarf', name: 'Nain', description: 'Robustes et tenaces, les nains sont des combattants et artisans nés.', statBonuses: { strength: 2, maxHp: 10, agility: -1 }, availableIn: ['fantasy'] },
    { id: 'orc', name: 'Orc', description: 'Puissants et féroces, les orcs dominent par la force brute.', statBonuses: { strength: 3, maxHp: 5, intelligence: -2 }, availableIn: ['fantasy'] },
    { id: 'halfling', name: 'Halfelin', description: 'Petits mais malins, les halfelins sont chanceux et discrets.', statBonuses: { luck: 3, agility: 1, strength: -2 }, availableIn: ['fantasy'] },
  ],
  apocalypse: [
    { id: 'survivor', name: 'Survivant', description: 'Un humain endurci par des années de survie dans les ruines.', statBonuses: { maxHp: 5, luck: 1 }, availableIn: ['apocalypse'] },
    { id: 'mutant', name: 'Mutant', description: 'Transformé par les radiations, doté de capacités étranges.', statBonuses: { strength: 2, intelligence: 1, charisma: -2 }, availableIn: ['apocalypse'] },
    { id: 'cyborg', name: 'Cyborg', description: 'Mi-humain mi-machine, augmenté par la technologie d\'avant.', statBonuses: { strength: 1, agility: 1, intelligence: 1 }, availableIn: ['apocalypse'] },
    { id: 'nomad', name: 'Nomade', description: 'Un voyageur solitaire, expert en exploration et commerce.', statBonuses: { agility: 2, charisma: 1, maxHp: -5 }, availableIn: ['apocalypse'] },
  ],
  scifi: [
    { id: 'terran', name: 'Terrien', description: 'Originaire de la Terre, adaptable et déterminé.', statBonuses: { charisma: 1, luck: 1, intelligence: 1 }, availableIn: ['scifi'] },
    { id: 'synth', name: 'Synthétique', description: 'Intelligence artificielle dans un corps humanoïde.', statBonuses: { intelligence: 3, strength: 1, charisma: -2 }, availableIn: ['scifi'] },
    { id: 'xenoborn', name: 'Xénoné', description: 'Né d\'un croisement avec une espèce alien, doté de sens uniques.', statBonuses: { agility: 2, intelligence: 1, luck: 1 }, availableIn: ['scifi'] },
    { id: 'voidwalker', name: 'Marcheur du Vide', description: 'Adapté à la vie dans l\'espace, résistant et mystérieux.', statBonuses: { maxHp: 10, maxMana: 10, charisma: -1 }, availableIn: ['scifi'] },
  ],
};

export const getRacesByUniverse = (universeType: string): RaceDefinition[] => {
  return RACES[universeType] || RACES.fantasy;
};
