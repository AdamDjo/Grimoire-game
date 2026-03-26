export interface ClassDefinition {
  id: string;
  name: string;
  description: string;
  statBonuses: Partial<Record<string, number>>;
  startingSkills: string[];
  availableIn: string[];
}

export const CLASSES: Record<string, ClassDefinition[]> = {
  fantasy: [
    { id: 'warrior', name: 'Warrior', description: 'Master of weapons and close combat.', statBonuses: { strength: 3, maxHp: 15, intelligence: -1 }, startingSkills: ['Power Strike', 'War Cry'], availableIn: ['fantasy'] },
    { id: 'mage', name: 'Mage', description: 'Wielder of arcane and elemental magic.', statBonuses: { intelligence: 3, maxMana: 20, strength: -1 }, startingSkills: ['Fireball', 'Arcane Shield'], availableIn: ['fantasy'] },
    { id: 'rogue', name: 'Rogue', description: 'Master of stealth, traps, and poison.', statBonuses: { agility: 3, luck: 2, maxHp: -5 }, startingSkills: ['Sneak Attack', 'Lockpicking'], availableIn: ['fantasy'] },
    { id: 'healer', name: 'Healer', description: 'Guardian of life, able to heal and protect.', statBonuses: { intelligence: 2, charisma: 2, maxMana: 15 }, startingSkills: ['Minor Heal', 'Purification'], availableIn: ['fantasy'] },
    { id: 'ranger', name: 'Ranger', description: 'Hunter and scout, at home in the wild.', statBonuses: { agility: 2, luck: 1, strength: 1 }, startingSkills: ['Precise Shot', 'Tracking'], availableIn: ['fantasy'] },
  ],
  apocalypse: [
    { id: 'scavenger', name: 'Scavenger', description: 'Expert in scavenging and tinkering, finds resources everywhere.', statBonuses: { luck: 3, intelligence: 1, agility: 1 }, startingSkills: ['Expert Search', 'Tinkering'], availableIn: ['apocalypse'] },
    { id: 'brawler', name: 'Brawler', description: 'Street fighter, brutal and resilient.', statBonuses: { strength: 3, maxHp: 10, intelligence: -1 }, startingSkills: ['Punch', 'Endurance'], availableIn: ['apocalypse'] },
    { id: 'medic', name: 'Medic', description: 'One of the few who can heal, highly sought after.', statBonuses: { intelligence: 3, charisma: 2, strength: -1 }, startingSkills: ['First Aid', 'Diagnosis'], availableIn: ['apocalypse'] },
    { id: 'engineer', name: 'Engineer', description: 'Masters pre-war technology to create and repair.', statBonuses: { intelligence: 3, agility: 1, charisma: -1 }, startingSkills: ['Repair', 'Improvised Trap'], availableIn: ['apocalypse'] },
  ],
  scifi: [
    { id: 'pilot', name: 'Pilot', description: 'Ace space pilot, fast and precise.', statBonuses: { agility: 3, luck: 2, strength: -1 }, startingSkills: ['Evasive Maneuver', 'Stellar Navigation'], availableIn: ['scifi'] },
    { id: 'soldier', name: 'Soldier', description: 'Trained combatant, disciplined and effective.', statBonuses: { strength: 2, maxHp: 10, agility: 1 }, startingSkills: ['Barrage Fire', 'Tactical Cover'], availableIn: ['scifi'] },
    { id: 'hacker', name: 'Hacker', description: 'Cyber pirate, controls systems remotely.', statBonuses: { intelligence: 3, agility: 1, strength: -2 }, startingSkills: ['System Intrusion', 'Data Scan'], availableIn: ['scifi'] },
    { id: 'diplomat', name: 'Diplomat', description: 'Outstanding negotiator, resolves conflicts through words.', statBonuses: { charisma: 3, intelligence: 2, strength: -2 }, startingSkills: ['Persuasion', 'Cultural Analysis'], availableIn: ['scifi'] },
    { id: 'psion', name: 'Psion', description: 'Gifted with mental powers, manipulates mind and matter.', statBonuses: { intelligence: 2, maxMana: 20, charisma: 1 }, startingSkills: ['Telekinesis', 'Mind Reading'], availableIn: ['scifi'] },
  ],
};

export const getClassesByUniverse = (universeType: string): ClassDefinition[] => {
  return CLASSES[universeType] || CLASSES.fantasy;
};
