import type { Attribute } from "../types/character.types";
import type { LocalizedString } from "./localized";

/**
 * Velkhar vocations. @see docs/canon/04-ATTRIBUTES.md, 05-VOCATIONS.md
 * A fifth "free concept" path lets the player describe a custom vocation.
 */
export interface VocationDefinition {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  /** Starting attribute values (3–18) before people bonuses. */
  baseAttributes: Record<Attribute, number>;
  startingSkills: LocalizedString[];
}

export const VOCATIONS: VocationDefinition[] = [
  {
    id: "salt-walker",
    name: { en: "Salt-Walker", fr: "Marcheur-du-Sel" },
    description: {
      en: "Caravan survivor, trader, and desert guide of the Makhzen.",
      fr: "Survivant des caravanes, marchand et guide du Makhzen.",
    },
    baseAttributes: { blood: 14, breath: 10, will: 10 },
    startingSkills: [
      { en: "Desert Trade", fr: "Commerce du sel" },
      { en: "Endurance", fr: "Endurance" },
    ],
  },
  {
    id: "shadow-blade",
    name: { en: "Shadow-Blade", fr: "Lame-Ombre" },
    description: {
      en: "Contract killer and keeper of secrets tied to the Shadow Hand.",
      fr: "Tueur de contrats et gardien de secrets lié à la Main d’Ombre.",
    },
    baseAttributes: { blood: 10, breath: 14, will: 10 },
    startingSkills: [
      { en: "Silent Approach", fr: "Approche silencieuse" },
      { en: "Contract Sense", fr: "Sens du contrat" },
    ],
  },
  {
    id: "watcher",
    name: { en: "Watcher", fr: "Veilleur" },
    description: {
      en: "Careful scholar of Archon ruins and dormant artefacts.",
      fr: "Érudit prudent des ruines archontes et des artefacts endormis.",
    },
    baseAttributes: { blood: 10, breath: 14, will: 10 },
    startingSkills: [
      { en: "Ruin Reading", fr: "Lecture des ruines" },
      { en: "Artefact Caution", fr: "Prudence d’artefact" },
    ],
  },
  {
    id: "word-weaver",
    name: { en: "Word-Weaver", fr: "Tisse-Verbe" },
    description: {
      en: "The only vocation able to awaken artefacts, at the cost of Calamine.",
      fr: "La seule vocation capable d’éveiller les artefacts, au prix de la Calamine.",
    },
    baseAttributes: { blood: 9, breath: 11, will: 14 },
    startingSkills: [
      { en: "Awaken Artefact", fr: "Éveil d’artefact" },
      { en: "Calamine Sense", fr: "Sens de la Calamine" },
    ],
  },
];

export const getVocation = (id: string): VocationDefinition | undefined =>
  VOCATIONS.find((v) => v.id === id);
