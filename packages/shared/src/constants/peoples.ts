import type { Attribute } from "../types/character.types";
import type { LocalizedString } from "./localized";

/**
 * Velkhar peoples. Each grants a small attribute bonus.
 * @see docs/private/raw/04-ATTRIBUTES.md, 06-SURVIVAL.md
 */
export interface PeopleDefinition {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  attributeBonus: Partial<Record<Attribute, number>>;
}

export const PEOPLES: PeopleDefinition[] = [
  {
    id: "sahelin",
    name: { en: "Sahelin", fr: "Sahélin" },
    description: {
      en: "Nomads of the southern salt roads, hardened by thirst and distance.",
      fr: "Nomades des routes du sel du Sud, endurcis par la soif et la distance.",
    },
    attributeBonus: { blood: 1 },
  },
  {
    id: "rivain",
    name: { en: "Rivain", fr: "Rivain" },
    description: {
      en: "Oasis-born people of letters, bargains, and careful influence.",
      fr: "Peuple des cités-oasis, lettré, marchand et patient dans l’influence.",
    },
    attributeBonus: { ash: 1 },
  },
  {
    id: "therien",
    name: { en: "Therien", fr: "Thérien" },
    description: {
      en: "Hunters from the Fingers, known for discipline and hard survival.",
      fr: "Chasseurs des Doigts, connus pour leur discipline et leur survie rude.",
    },
    attributeBonus: { blood: 1 },
  },
  {
    id: "cendreur",
    name: { en: "Ash-Marked", fr: "Cendreur" },
    description: {
      en: "Children of ash and storm, marked by the Ash from birth.",
      fr: "Enfants de cendre et de tempête, marqués par la Cendre dès la naissance.",
    },
    attributeBonus: { breath: 1 },
  },
  {
    id: "changepeau",
    name: { en: "Skin-Changer", fr: "Changepeau" },
    description: {
      en: "Marginal shapeshifters whose bodies remember the desert differently.",
      fr: "Métamorphes marginaux dont le corps se souvient autrement du désert.",
    },
    attributeBonus: { breath: 1, ash: -1 },
  },
];

export const getPeople = (id: string): PeopleDefinition | undefined =>
  PEOPLES.find((p) => p.id === id);
