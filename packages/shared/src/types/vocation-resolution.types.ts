/**
 * Free-concept host vocation resolution — L'Aveugle identifies which of the
 * 4 canon vocations best fits the player's free-form concept, personalizes
 * it, and the player gets an explicit veto before it's persisted.
 * @see docs/public/raw/07-CHARACTER-CREATION.md §2 step 4
 */

/** A shifted starting skill: the canon vocation skill, renamed to fit the free concept. */
export interface ShiftedSkill {
  original: string;
  shifted: string;
}

/** The AI successfully identified a host vocation among the 4 canon presets. */
export interface VocationResolutionResolved {
  status: "resolved";
  vocationId: string;
  customVocationName: string;
  narrativeTrait: string;
  shiftedSkills: ShiftedSkill[];
  announcement: string;
}

/** No AI resolution available — the player must pick a preset explicitly. */
export interface VocationResolutionFallback {
  status: "fallback";
  reason: "unintelligible_concept" | "ai_unavailable";
}

export type VocationResolutionResponse =
  | VocationResolutionResolved
  | VocationResolutionFallback;

export interface ResolveVocationRequest {
  freeConcept: string;
}
