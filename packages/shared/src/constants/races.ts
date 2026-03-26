export interface RaceDefinition {
  id: string;
  name: string;
  description: string;
  statBonuses: Partial<Record<string, number>>;
  availableIn: string[];
}

export const RACES: Record<string, RaceDefinition[]> = {
  fantasy: [
    { id: 'human', name: 'Human', description: 'Versatile and adaptable, humans excel in all domains.', statBonuses: { charisma: 2, luck: 1 }, availableIn: ['fantasy'] },
    { id: 'elf', name: 'Elf', description: 'Graceful and ancient, elves master magic and agility.', statBonuses: { agility: 2, intelligence: 2, strength: -1 }, availableIn: ['fantasy'] },
    { id: 'dwarf', name: 'Dwarf', description: 'Sturdy and tenacious, dwarves are born fighters and craftsmen.', statBonuses: { strength: 2, maxHp: 10, agility: -1 }, availableIn: ['fantasy'] },
    { id: 'orc', name: 'Orc', description: 'Powerful and fierce, orcs dominate through brute force.', statBonuses: { strength: 3, maxHp: 5, intelligence: -2 }, availableIn: ['fantasy'] },
    { id: 'halfling', name: 'Halfling', description: 'Small but clever, halflings are lucky and stealthy.', statBonuses: { luck: 3, agility: 1, strength: -2 }, availableIn: ['fantasy'] },
  ],
  apocalypse: [
    { id: 'survivor', name: 'Survivor', description: 'A human hardened by years of survival in the ruins.', statBonuses: { maxHp: 5, luck: 1 }, availableIn: ['apocalypse'] },
    { id: 'mutant', name: 'Mutant', description: 'Transformed by radiation, gifted with strange abilities.', statBonuses: { strength: 2, intelligence: 1, charisma: -2 }, availableIn: ['apocalypse'] },
    { id: 'cyborg', name: 'Cyborg', description: 'Half-human half-machine, augmented by pre-war technology.', statBonuses: { strength: 1, agility: 1, intelligence: 1 }, availableIn: ['apocalypse'] },
    { id: 'nomad', name: 'Nomad', description: 'A lone traveler, expert in exploration and trade.', statBonuses: { agility: 2, charisma: 1, maxHp: -5 }, availableIn: ['apocalypse'] },
  ],
  scifi: [
    { id: 'terran', name: 'Terran', description: 'Originally from Earth, adaptable and determined.', statBonuses: { charisma: 1, luck: 1, intelligence: 1 }, availableIn: ['scifi'] },
    { id: 'synth', name: 'Synthetic', description: 'Artificial intelligence in a humanoid body.', statBonuses: { intelligence: 3, strength: 1, charisma: -2 }, availableIn: ['scifi'] },
    { id: 'xenoborn', name: 'Xenoborn', description: 'Born from a crossbreed with an alien species, gifted with unique senses.', statBonuses: { agility: 2, intelligence: 1, luck: 1 }, availableIn: ['scifi'] },
    { id: 'voidwalker', name: 'Voidwalker', description: 'Adapted to life in space, resilient and mysterious.', statBonuses: { maxHp: 10, maxMana: 10, charisma: -1 }, availableIn: ['scifi'] },
  ],
};

export const getRacesByUniverse = (universeType: string): RaceDefinition[] => {
  return RACES[universeType] || RACES.fantasy;
};
