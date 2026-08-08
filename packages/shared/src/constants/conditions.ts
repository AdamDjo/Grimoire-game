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
  /** Player-facing mechanical effect, kept next to the backend-owned rule. */
  effect: LocalizedString;
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
    effect: {
      en: "Disadvantage on every roll.",
      fr: "Désavantage à tous les jets.",
    },
    disadvantage: true,
    family: "backend",
    cure: { en: "Healing", fr: "Soin" },
  },
  {
    id: "poison",
    name: { en: "Poisoned", fr: "Empoisonnement" },
    effect: {
      en: "Lose 1 HP at the end of each turn outside combat.",
      fr: "Perd 1 PV à la fin de chaque tour hors combat.",
    },
    damagePerTurn: 1,
    disadvantage: false,
    family: "ia",
    cure: { en: "Healing", fr: "Soin" },
  },
  {
    id: "wound",
    name: { en: "Wound", fr: "Blessure" },
    effect: {
      en: "Disadvantage on Blood rolls and reduced carrying ability.",
      fr: "Désavantage aux jets de Sang et portage réduit.",
    },
    disadvantage: true,
    family: "backend",
    cure: { en: "Long rest", fr: "Repos long" },
  },
  {
    id: "freeze",
    name: { en: "Freeze", fr: "Gel" },
    effect: {
      en: "Breath is reduced and movement is hindered.",
      fr: "Souffle réduit et déplacements entravés.",
    },
    disadvantage: false,
    family: "ia",
    cure: { en: "Heat source", fr: "Source de chaleur" },
  },
  {
    id: "stun",
    name: { en: "Stun", fr: "Étourdissement" },
    effect: {
      en: "Lose the next combat turn.",
      fr: "Fait perdre le prochain tour de combat.",
    },
    disadvantage: false,
    family: "ia",
    cure: { en: "Next turn", fr: "Tour suivant" },
  },
  {
    id: "blindness",
    name: { en: "Temporary blindness", fr: "Cécité temporaire" },
    effect: {
      en: "Disadvantage on Breath perception rolls.",
      fr: "Désavantage aux jets de perception de Souffle.",
    },
    disadvantage: true,
    family: "ia",
    cure: { en: "Short duration", fr: "Courte durée" },
  },
  {
    id: "marsh_disease",
    name: { en: "Marsh disease", fr: "Maladie des marais" },
    effect: {
      en: "Disadvantage on every roll and fatigue drains twice as fast.",
      fr: "Désavantage à tous les jets et fatigue doublée.",
    },
    disadvantage: true,
    family: "ia",
    cure: { en: "Specific remedy", fr: "Soin spécifique" },
  },
  {
    id: "cendre_corrupt",
    name: { en: "Ash-corrupted", fr: "Cendre-corrompu" },
    effect: {
      en: "Calamine progresses toward irreversible transformation.",
      fr: "La Calamine progresse vers une transformation irréversible.",
    },
    disadvantage: false,
    family: "ia",
    cure: { en: "Progresses to Calamine", fr: "Progresse vers la Calamine" },
  },
  {
    id: "shaken_reason",
    name: { en: "Shaken reason", fr: "Raison ébranlée" },
    effect: {
      en: "Ash is reduced and hallucinations can alter perception.",
      fr: "Cendre réduite et hallucinations pouvant altérer la perception.",
    },
    disadvantage: false,
    family: "ia",
    cure: { en: "Variable", fr: "Variable" },
  },
  {
    id: "petrification",
    name: { en: "Slow petrification", fr: "Pétrification lente" },
    effect: {
      en: "Progressive penalties leading to death if untreated.",
      fr: "Malus progressifs menant à la mort sans traitement.",
    },
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
