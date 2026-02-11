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
    { id: 'warrior', name: 'Guerrier', description: 'Maître des armes et du combat rapproché.', statBonuses: { strength: 3, maxHp: 15, intelligence: -1 }, startingSkills: ['Frappe puissante', 'Cri de guerre'], availableIn: ['fantasy'] },
    { id: 'mage', name: 'Mage', description: 'Manipulateur des arcanes et de la magie élémentaire.', statBonuses: { intelligence: 3, maxMana: 20, strength: -1 }, startingSkills: ['Boule de feu', 'Bouclier arcanique'], availableIn: ['fantasy'] },
    { id: 'rogue', name: 'Voleur', description: 'Maître de la furtivité, des pièges et du poison.', statBonuses: { agility: 3, luck: 2, maxHp: -5 }, startingSkills: ['Attaque sournoise', 'Crochetage'], availableIn: ['fantasy'] },
    { id: 'healer', name: 'Guérisseur', description: 'Gardien de la vie, capable de soigner et protéger.', statBonuses: { intelligence: 2, charisma: 2, maxMana: 15 }, startingSkills: ['Soin mineur', 'Purification'], availableIn: ['fantasy'] },
    { id: 'ranger', name: 'Rôdeur', description: 'Chasseur et éclaireur, à l\'aise dans la nature.', statBonuses: { agility: 2, luck: 1, strength: 1 }, startingSkills: ['Tir précis', 'Pistage'], availableIn: ['fantasy'] },
  ],
  apocalypse: [
    { id: 'scavenger', name: 'Récupérateur', description: 'Expert en fouille et bricolage, trouve des ressources partout.', statBonuses: { luck: 3, intelligence: 1, agility: 1 }, startingSkills: ['Fouille experte', 'Bricolage'], availableIn: ['apocalypse'] },
    { id: 'brawler', name: 'Bagarreur', description: 'Combattant de rue, brutal et résistant.', statBonuses: { strength: 3, maxHp: 10, intelligence: -1 }, startingSkills: ['Coup de poing', 'Résistance'], availableIn: ['apocalypse'] },
    { id: 'medic', name: 'Médecin', description: 'Un des rares à savoir soigner, très recherché.', statBonuses: { intelligence: 3, charisma: 2, strength: -1 }, startingSkills: ['Premiers soins', 'Diagnostic'], availableIn: ['apocalypse'] },
    { id: 'engineer', name: 'Ingénieur', description: 'Maîtrise la technologie d\'avant pour créer et réparer.', statBonuses: { intelligence: 3, agility: 1, charisma: -1 }, startingSkills: ['Réparation', 'Piège improvisé'], availableIn: ['apocalypse'] },
  ],
  scifi: [
    { id: 'pilot', name: 'Pilote', description: 'As du pilotage spatial, rapide et précis.', statBonuses: { agility: 3, luck: 2, strength: -1 }, startingSkills: ['Manoeuvre évasive', 'Navigation stellaire'], availableIn: ['scifi'] },
    { id: 'soldier', name: 'Soldat', description: 'Combattant entraîné, discipliné et efficace.', statBonuses: { strength: 2, maxHp: 10, agility: 1 }, startingSkills: ['Tir de barrage', 'Couverture tactique'], availableIn: ['scifi'] },
    { id: 'hacker', name: 'Hacker', description: 'Pirate informatique, contrôle les systèmes à distance.', statBonuses: { intelligence: 3, agility: 1, strength: -2 }, startingSkills: ['Intrusion système', 'Scan de données'], availableIn: ['scifi'] },
    { id: 'diplomat', name: 'Diplomate', description: 'Négociateur hors pair, résout les conflits par la parole.', statBonuses: { charisma: 3, intelligence: 2, strength: -2 }, startingSkills: ['Persuasion', 'Analyse culturelle'], availableIn: ['scifi'] },
    { id: 'psion', name: 'Psionique', description: 'Doté de pouvoirs mentaux, manipule l\'esprit et la matière.', statBonuses: { intelligence: 2, maxMana: 20, charisma: 1 }, startingSkills: ['Télékinésie', 'Lecture mentale'], availableIn: ['scifi'] },
  ],
};

export const getClassesByUniverse = (universeType: string): ClassDefinition[] => {
  return CLASSES[universeType] || CLASSES.fantasy;
};
