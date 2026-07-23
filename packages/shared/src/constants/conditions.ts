import type { ConditionId } from "../types/character.types";
import type { LocalizedString } from "./localized";

/**
 * Who is allowed to apply a condition.
 * @see docs/public/raw/06-SURVIVAL.md §2
 */
export type ConditionFamily = "backend" | "ia";

export interface ConditionDefinition {
  id: ConditionId;
  name: LocalizedString;
  /** Damage per turn while active, if any (e.g. poison). */
  damagePerTurn?: number;
  /** Whether this condition imposes Désavantage (2d20, keep worst) per canon 08-DICE §5. */
  disadvantage: boolean;
  family: ConditionFamily;
  /** How the condition is cured. */
  cure: LocalizedString;
}

/**
 * Canon table of survival conditions.
 * @see docs/public/raw/06-SURVIVAL.md §2
 */
export const CONDITIONS: ConditionDefinition[] = [
  {
    id: "fever",
    name: { en: "Fever", fr: "Fièvre" },
    disadvantage: true,
    family: "backend",
    cure: { en: "Healing", fr: "Soin" },
  },
  {
    id: "poison",
    name: { en: "Poisoned", fr: "Empoisonnement" },
    damagePerTurn: 1,
    disadvantage: false,
    family: "ia",
    cure: { en: "Healing", fr: "Soin" },
  },
  {
    id: "wound",
    name: { en: "Wound", fr: "Blessure" },
    disadvantage: true,
    family: "backend",
    cure: { en: "Long rest", fr: "Repos long" },
  },
  {
    id: "freeze",
    name: { en: "Freeze", fr: "Gel" },
    disadvantage: false,
    family: "ia",
    cure: { en: "Heat source", fr: "Source de chaleur" },
  },
  {
    id: "stun",
    name: { en: "Stun", fr: "Étourdissement" },
    disadvantage: false,
    family: "ia",
    cure: { en: "Next turn", fr: "Tour suivant" },
  },
  {
    id: "blindness",
    name: { en: "Temporary blindness", fr: "Cécité temporaire" },
    disadvantage: true,
    family: "ia",
    cure: { en: "Short duration", fr: "Courte durée" },
  },
  {
    id: "marsh_disease",
    name: { en: "Marsh disease", fr: "Maladie des marais" },
    disadvantage: true,
    family: "ia",
    cure: { en: "Specific remedy", fr: "Soin spécifique" },
  },
  {
    id: "cendre_corrupt",
    name: { en: "Ash-corrupted", fr: "Cendre-corrompu" },
    disadvantage: false,
    family: "ia",
    cure: { en: "Progresses to Calamine", fr: "Progresse vers la Calamine" },
  },
  {
    id: "shaken_reason",
    name: { en: "Shaken reason", fr: "Raison ébranlée" },
    disadvantage: false,
    family: "ia",
    cure: { en: "Variable", fr: "Variable" },
  },
  {
    id: "petrification",
    name: { en: "Slow petrification", fr: "Pétrification lente" },
    disadvantage: false,
    family: "ia",
    cure: { en: "Mortal if untreated", fr: "Mortel si non soigné" },
  },
];

export function getConditionDefinition(
  id: ConditionId,
): ConditionDefinition | undefined {
  return CONDITIONS.find((condition) => condition.id === id);
}
