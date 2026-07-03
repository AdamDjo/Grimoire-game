import type { LocalizedString } from "./universe-templates";

export interface RaceDefinition {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  statBonuses: Partial<Record<string, number>>;
  availableIn: string[];
}

export const RACES: Record<string, RaceDefinition[]> = {
  fantasy: [
    {
      id: "sahelin",
      name: { en: "Sahelin", fr: "Sahélin" },
      description: {
        en: "Nomads of the southern salt roads, hardened by thirst and distance.",
        fr: "Nomades des routes du sel du Sud, endurcis par la soif et la distance.",
      },
      statBonuses: { sang: 1 },
      availableIn: ["fantasy"],
    },
    {
      id: "rivain",
      name: { en: "Rivain", fr: "Rivain" },
      description: {
        en: "Oasis-born people of letters, bargains, and careful influence.",
        fr: "Peuple des cités-oasis, lettré, marchand et patient dans l’influence.",
      },
      statBonuses: { cendre: 1 },
      availableIn: ["fantasy"],
    },
    {
      id: "therien",
      name: { en: "Therien", fr: "Thérien" },
      description: {
        en: "Hunters from the Doigts, known for discipline and hard survival.",
        fr: "Chasseurs des Doigts, connus pour leur discipline et leur survie rude.",
      },
      statBonuses: { sang: 1 },
      availableIn: ["fantasy"],
    },
    {
      id: "cendreur",
      name: { en: "Ash-Marked", fr: "Cendreur" },
      description: {
        en: "Children of ash and storm, marked by the Cendre from birth.",
        fr: "Enfants de cendre et de tempête, marqués par la Cendre dès la naissance.",
      },
      statBonuses: { souffle: 1 },
      availableIn: ["fantasy"],
    },
    {
      id: "changepeau",
      name: { en: "Skin-Changer", fr: "Changepeau" },
      description: {
        en: "Marginal shapeshifters whose bodies remember the desert differently.",
        fr: "Métamorphes marginaux dont le corps se souvient autrement du désert.",
      },
      statBonuses: { souffle: 1, cendre: -1 },
      availableIn: ["fantasy"],
    },
  ],
  apocalypse: [
    {
      id: "survivor",
      name: { en: "Survivor", fr: "Survivant" },
      description: {
        en: "A human hardened by years of survival in the ruins.",
        fr: "Un humain endurci par des années de survie dans les ruines.",
      },
      statBonuses: { maxHp: 5, luck: 1 },
      availableIn: ["apocalypse"],
    },
    {
      id: "mutant",
      name: { en: "Mutant", fr: "Mutant" },
      description: {
        en: "Transformed by radiation, gifted with strange abilities.",
        fr: "Transformé par les radiations, doté de capacités étranges.",
      },
      statBonuses: { strength: 2, intelligence: 1, charisma: -2 },
      availableIn: ["apocalypse"],
    },
    {
      id: "cyborg",
      name: { en: "Cyborg", fr: "Cyborg" },
      description: {
        en: "Half-human half-machine, augmented by pre-war technology.",
        fr: "Mi-humain mi-machine, augmenté par la technologie d'avant.",
      },
      statBonuses: { strength: 1, agility: 1, intelligence: 1 },
      availableIn: ["apocalypse"],
    },
    {
      id: "nomad",
      name: { en: "Nomad", fr: "Nomade" },
      description: {
        en: "A lone traveler, expert in exploration and trade.",
        fr: "Un voyageur solitaire, expert en exploration et commerce.",
      },
      statBonuses: { agility: 2, charisma: 1, maxHp: -5 },
      availableIn: ["apocalypse"],
    },
  ],
  scifi: [
    {
      id: "terran",
      name: { en: "Terran", fr: "Terrien" },
      description: {
        en: "Originally from Earth, adaptable and determined.",
        fr: "Originaire de la Terre, adaptable et déterminé.",
      },
      statBonuses: { charisma: 1, luck: 1, intelligence: 1 },
      availableIn: ["scifi"],
    },
    {
      id: "synth",
      name: { en: "Synthetic", fr: "Synthétique" },
      description: {
        en: "Artificial intelligence in a humanoid body.",
        fr: "Intelligence artificielle dans un corps humanoïde.",
      },
      statBonuses: { intelligence: 3, strength: 1, charisma: -2 },
      availableIn: ["scifi"],
    },
    {
      id: "xenoborn",
      name: { en: "Xenoborn", fr: "Xénoné" },
      description: {
        en: "Born from a crossbreed with an alien species, gifted with unique senses.",
        fr: "Né d'un croisement avec une espèce alien, doté de sens uniques.",
      },
      statBonuses: { agility: 2, intelligence: 1, luck: 1 },
      availableIn: ["scifi"],
    },
    {
      id: "voidwalker",
      name: { en: "Voidwalker", fr: "Marcheur du Vide" },
      description: {
        en: "Adapted to life in space, resilient and mysterious.",
        fr: "Adapté à la vie dans l'espace, résistant et mystérieux.",
      },
      statBonuses: { maxHp: 10, maxMana: 10, charisma: -1 },
      availableIn: ["scifi"],
    },
  ],
};

export const getRacesByUniverse = (universeType: string): RaceDefinition[] => {
  return RACES[universeType] || RACES.fantasy;
};
