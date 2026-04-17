import type { LocalizedString } from './universe-templates';

export interface ClassDefinition {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  statBonuses: Partial<Record<string, number>>;
  startingSkills: LocalizedString[];
  availableIn: string[];
}

export const CLASSES: Record<string, ClassDefinition[]> = {
  fantasy: [
    { id: 'warrior', name: { en: 'Warrior', fr: 'Guerrier' }, description: { en: 'Master of weapons and close combat.', fr: 'Maître des armes et du combat rapproché.' }, statBonuses: { strength: 3, maxHp: 15, intelligence: -1 }, startingSkills: [{ en: 'Power Strike', fr: 'Frappe puissante' }, { en: 'War Cry', fr: 'Cri de guerre' }], availableIn: ['fantasy'] },
    { id: 'mage', name: { en: 'Mage', fr: 'Mage' }, description: { en: 'Wielder of arcane and elemental magic.', fr: 'Manipulateur des arcanes et de la magie élémentaire.' }, statBonuses: { intelligence: 3, maxMana: 20, strength: -1 }, startingSkills: [{ en: 'Fireball', fr: 'Boule de feu' }, { en: 'Arcane Shield', fr: 'Bouclier arcanique' }], availableIn: ['fantasy'] },
    { id: 'rogue', name: { en: 'Rogue', fr: 'Voleur' }, description: { en: 'Master of stealth, traps, and poison.', fr: 'Maître de la furtivité, des pièges et du poison.' }, statBonuses: { agility: 3, luck: 2, maxHp: -5 }, startingSkills: [{ en: 'Sneak Attack', fr: 'Attaque sournoise' }, { en: 'Lockpicking', fr: 'Crochetage' }], availableIn: ['fantasy'] },
    { id: 'healer', name: { en: 'Healer', fr: 'Guérisseur' }, description: { en: 'Guardian of life, able to heal and protect.', fr: 'Gardien de la vie, capable de soigner et protéger.' }, statBonuses: { intelligence: 2, charisma: 2, maxMana: 15 }, startingSkills: [{ en: 'Minor Heal', fr: 'Soin mineur' }, { en: 'Purification', fr: 'Purification' }], availableIn: ['fantasy'] },
    { id: 'ranger', name: { en: 'Ranger', fr: 'Rôdeur' }, description: { en: 'Hunter and scout, at home in the wild.', fr: 'Chasseur et éclaireur, à l\'aise dans la nature.' }, statBonuses: { agility: 2, luck: 1, strength: 1 }, startingSkills: [{ en: 'Precise Shot', fr: 'Tir précis' }, { en: 'Tracking', fr: 'Pistage' }], availableIn: ['fantasy'] },
  ],
  apocalypse: [
    { id: 'scavenger', name: { en: 'Scavenger', fr: 'Récupérateur' }, description: { en: 'Expert in scavenging and tinkering, finds resources everywhere.', fr: 'Expert en fouille et bricolage, trouve des ressources partout.' }, statBonuses: { luck: 3, intelligence: 1, agility: 1 }, startingSkills: [{ en: 'Expert Search', fr: 'Fouille experte' }, { en: 'Tinkering', fr: 'Bricolage' }], availableIn: ['apocalypse'] },
    { id: 'brawler', name: { en: 'Brawler', fr: 'Bagarreur' }, description: { en: 'Street fighter, brutal and resilient.', fr: 'Combattant de rue, brutal et résistant.' }, statBonuses: { strength: 3, maxHp: 10, intelligence: -1 }, startingSkills: [{ en: 'Punch', fr: 'Coup de poing' }, { en: 'Endurance', fr: 'Résistance' }], availableIn: ['apocalypse'] },
    { id: 'medic', name: { en: 'Medic', fr: 'Médecin' }, description: { en: 'One of the few who can heal, highly sought after.', fr: 'Un des rares à savoir soigner, très recherché.' }, statBonuses: { intelligence: 3, charisma: 2, strength: -1 }, startingSkills: [{ en: 'First Aid', fr: 'Premiers soins' }, { en: 'Diagnosis', fr: 'Diagnostic' }], availableIn: ['apocalypse'] },
    { id: 'engineer', name: { en: 'Engineer', fr: 'Ingénieur' }, description: { en: 'Masters pre-war technology to create and repair.', fr: 'Maîtrise la technologie d\'avant pour créer et réparer.' }, statBonuses: { intelligence: 3, agility: 1, charisma: -1 }, startingSkills: [{ en: 'Repair', fr: 'Réparation' }, { en: 'Improvised Trap', fr: 'Piège improvisé' }], availableIn: ['apocalypse'] },
  ],
  scifi: [
    { id: 'pilot', name: { en: 'Pilot', fr: 'Pilote' }, description: { en: 'Ace space pilot, fast and precise.', fr: 'As du pilotage spatial, rapide et précis.' }, statBonuses: { agility: 3, luck: 2, strength: -1 }, startingSkills: [{ en: 'Evasive Maneuver', fr: 'Manoeuvre évasive' }, { en: 'Stellar Navigation', fr: 'Navigation stellaire' }], availableIn: ['scifi'] },
    { id: 'soldier', name: { en: 'Soldier', fr: 'Soldat' }, description: { en: 'Trained combatant, disciplined and effective.', fr: 'Combattant entraîné, discipliné et efficace.' }, statBonuses: { strength: 2, maxHp: 10, agility: 1 }, startingSkills: [{ en: 'Barrage Fire', fr: 'Tir de barrage' }, { en: 'Tactical Cover', fr: 'Couverture tactique' }], availableIn: ['scifi'] },
    { id: 'hacker', name: { en: 'Hacker', fr: 'Hacker' }, description: { en: 'Cyber pirate, controls systems remotely.', fr: 'Pirate informatique, contrôle les systèmes à distance.' }, statBonuses: { intelligence: 3, agility: 1, strength: -2 }, startingSkills: [{ en: 'System Intrusion', fr: 'Intrusion système' }, { en: 'Data Scan', fr: 'Scan de données' }], availableIn: ['scifi'] },
    { id: 'diplomat', name: { en: 'Diplomat', fr: 'Diplomate' }, description: { en: 'Outstanding negotiator, resolves conflicts through words.', fr: 'Négociateur hors pair, résout les conflits par la parole.' }, statBonuses: { charisma: 3, intelligence: 2, strength: -2 }, startingSkills: [{ en: 'Persuasion', fr: 'Persuasion' }, { en: 'Cultural Analysis', fr: 'Analyse culturelle' }], availableIn: ['scifi'] },
    { id: 'psion', name: { en: 'Psion', fr: 'Psionique' }, description: { en: 'Gifted with mental powers, manipulates mind and matter.', fr: 'Doté de pouvoirs mentaux, manipule l\'esprit et la matière.' }, statBonuses: { intelligence: 2, maxMana: 20, charisma: 1 }, startingSkills: [{ en: 'Telekinesis', fr: 'Télékinésie' }, { en: 'Mind Reading', fr: 'Lecture mentale' }], availableIn: ['scifi'] },
  ],
};

export const getClassesByUniverse = (universeType: string): ClassDefinition[] => {
  return CLASSES[universeType] || CLASSES.fantasy;
};
