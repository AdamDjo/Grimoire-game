/**
 * Curated localization for canon brand terms.
 * The AI never re-translates these — the dictionary is hand-written and stable.
 * Free prose is localized by the Game Master; brand terms come from here.
 */
export interface LocalizedString {
  en: string;
  fr: string;
}

import type { Attribute } from "../types/character.types";

/** Canon attribute names (SANG / SOUFFLE / VOLONTÉ). */
export const ATTRIBUTE_LABELS: Record<Attribute, LocalizedString> = {
  blood: { en: "Blood", fr: "Sang" },
  breath: { en: "Breath", fr: "Souffle" },
  will: { en: "Will", fr: "Volonté" },
};
