import type { LocalizedString } from "./universe-templates";

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
    {
      id: "marcheur-du-sel",
      name: { en: "Salt-Walker", fr: "Marcheur-du-Sel" },
      description: {
        en: "Caravan survivor, trader, and desert guide of the Makhzen.",
        fr: "Survivant des caravanes, marchand et guide du Makhzen.",
      },
      statBonuses: { sang: 2 },
      startingSkills: [
        { en: "Desert Trade", fr: "Commerce du sel" },
        { en: "Endurance", fr: "Endurance" },
      ],
      availableIn: ["fantasy"],
    },
    {
      id: "lame-ombre",
      name: { en: "Shadow-Blade", fr: "Lame-Ombre" },
      description: {
        en: "Contract killer and keeper of secrets tied to the Main d’Ombre.",
        fr: "Tueur de contrats et gardien de secrets lié à la Main d’Ombre.",
      },
      statBonuses: { souffle: 2 },
      startingSkills: [
        { en: "Silent Approach", fr: "Approche silencieuse" },
        { en: "Contract Sense", fr: "Sens du contrat" },
      ],
      availableIn: ["fantasy"],
    },
    {
      id: "veilleur",
      name: { en: "Watcher", fr: "Veilleur" },
      description: {
        en: "Careful scholar of Archonte ruins and dormant artefacts.",
        fr: "Érudit prudent des ruines archontes et des artefacts endormis.",
      },
      statBonuses: { souffle: 2 },
      startingSkills: [
        { en: "Ruin Reading", fr: "Lecture des ruines" },
        { en: "Artefact Caution", fr: "Prudence d’artefact" },
      ],
      availableIn: ["fantasy"],
    },
    {
      id: "tisse-verbe",
      name: { en: "Word-Weaver", fr: "Tisse-Verbe" },
      description: {
        en: "The only vocation able to awaken artefacts, at the cost of Calamine.",
        fr: "La seule vocation capable d’éveiller les artefacts, au prix de la Calamine.",
      },
      statBonuses: { sang: -1, souffle: 2, cendre: 1 },
      startingSkills: [
        { en: "Awaken Artefact", fr: "Éveil d’artefact" },
        { en: "Calamine Sense", fr: "Sens de la Calamine" },
      ],
      availableIn: ["fantasy"],
    },
  ],
  apocalypse: [
    {
      id: "scavenger",
      name: { en: "Scavenger", fr: "Récupérateur" },
      description: {
        en: "Expert in scavenging and tinkering, finds resources everywhere.",
        fr: "Expert en fouille et bricolage, trouve des ressources partout.",
      },
      statBonuses: { luck: 3, intelligence: 1, agility: 1 },
      startingSkills: [
        { en: "Expert Search", fr: "Fouille experte" },
        { en: "Tinkering", fr: "Bricolage" },
      ],
      availableIn: ["apocalypse"],
    },
    {
      id: "brawler",
      name: { en: "Brawler", fr: "Bagarreur" },
      description: {
        en: "Street fighter, brutal and resilient.",
        fr: "Combattant de rue, brutal et résistant.",
      },
      statBonuses: { strength: 3, maxHp: 10, intelligence: -1 },
      startingSkills: [
        { en: "Punch", fr: "Coup de poing" },
        { en: "Endurance", fr: "Résistance" },
      ],
      availableIn: ["apocalypse"],
    },
    {
      id: "medic",
      name: { en: "Medic", fr: "Médecin" },
      description: {
        en: "One of the few who can heal, highly sought after.",
        fr: "Un des rares à savoir soigner, très recherché.",
      },
      statBonuses: { intelligence: 3, charisma: 2, strength: -1 },
      startingSkills: [
        { en: "First Aid", fr: "Premiers soins" },
        { en: "Diagnosis", fr: "Diagnostic" },
      ],
      availableIn: ["apocalypse"],
    },
    {
      id: "engineer",
      name: { en: "Engineer", fr: "Ingénieur" },
      description: {
        en: "Masters pre-war technology to create and repair.",
        fr: "Maîtrise la technologie d'avant pour créer et réparer.",
      },
      statBonuses: { intelligence: 3, agility: 1, charisma: -1 },
      startingSkills: [
        { en: "Repair", fr: "Réparation" },
        { en: "Improvised Trap", fr: "Piège improvisé" },
      ],
      availableIn: ["apocalypse"],
    },
  ],
  scifi: [
    {
      id: "pilot",
      name: { en: "Pilot", fr: "Pilote" },
      description: {
        en: "Ace space pilot, fast and precise.",
        fr: "As du pilotage spatial, rapide et précis.",
      },
      statBonuses: { agility: 3, luck: 2, strength: -1 },
      startingSkills: [
        { en: "Evasive Maneuver", fr: "Manoeuvre évasive" },
        { en: "Stellar Navigation", fr: "Navigation stellaire" },
      ],
      availableIn: ["scifi"],
    },
    {
      id: "soldier",
      name: { en: "Soldier", fr: "Soldat" },
      description: {
        en: "Trained combatant, disciplined and effective.",
        fr: "Combattant entraîné, discipliné et efficace.",
      },
      statBonuses: { strength: 2, maxHp: 10, agility: 1 },
      startingSkills: [
        { en: "Barrage Fire", fr: "Tir de barrage" },
        { en: "Tactical Cover", fr: "Couverture tactique" },
      ],
      availableIn: ["scifi"],
    },
    {
      id: "hacker",
      name: { en: "Hacker", fr: "Hacker" },
      description: {
        en: "Cyber pirate, controls systems remotely.",
        fr: "Pirate informatique, contrôle les systèmes à distance.",
      },
      statBonuses: { intelligence: 3, agility: 1, strength: -2 },
      startingSkills: [
        { en: "System Intrusion", fr: "Intrusion système" },
        { en: "Data Scan", fr: "Scan de données" },
      ],
      availableIn: ["scifi"],
    },
    {
      id: "diplomat",
      name: { en: "Diplomat", fr: "Diplomate" },
      description: {
        en: "Outstanding negotiator, resolves conflicts through words.",
        fr: "Négociateur hors pair, résout les conflits par la parole.",
      },
      statBonuses: { charisma: 3, intelligence: 2, strength: -2 },
      startingSkills: [
        { en: "Persuasion", fr: "Persuasion" },
        { en: "Cultural Analysis", fr: "Analyse culturelle" },
      ],
      availableIn: ["scifi"],
    },
    {
      id: "psion",
      name: { en: "Psion", fr: "Psionique" },
      description: {
        en: "Gifted with mental powers, manipulates mind and matter.",
        fr: "Doté de pouvoirs mentaux, manipule l'esprit et la matière.",
      },
      statBonuses: { intelligence: 2, maxMana: 20, charisma: 1 },
      startingSkills: [
        { en: "Telekinesis", fr: "Télékinésie" },
        { en: "Mind Reading", fr: "Lecture mentale" },
      ],
      availableIn: ["scifi"],
    },
  ],
};

export const getClassesByUniverse = (
  universeType: string,
): ClassDefinition[] => {
  return CLASSES[universeType] || CLASSES.fantasy;
};
