/**
 * Dice resolution contract. Rolls happen on the backend (Game Master),
 * never on the AI or the client. The frontend only displays the result.
 */

export type Difficulty = "safe" | "low" | "medium" | "high" | "deadly";

/**
 * Target numbers per difficulty, anchored on the canon DC table (08-DICE §1):
 * 5 très facile / 8 facile / 10 moyen / 13 difficile / 16 très difficile.
 * DC 19+ (extrême, héroïque, légendaire) stay reserved for the AI-set epic
 * moments and are out of the A1 riskLevel scope. Backend is the sole source.
 */
export const DIFFICULTY_TARGET: Record<Difficulty, number> = {
  safe: 5,
  low: 8,
  medium: 10,
  high: 13,
  deadly: 16,
};

/**
 * Roll mode, per canon 08-DICE §5. "normal" = 1d20. "advantage"/"disadvantage" = 2d20,
 * keep best/worst. Advantage and disadvantage cancel out to "normal" when both apply.
 */
export type RollMode = "normal" | "advantage" | "disadvantage";

export interface DiceRoll {
  roll: number;
  modifier: number;
  total: number;
  target: number;
  success: boolean;
  /** Natural 20 / natural 1 flags for narration flavor. */
  critical: "success" | "failure" | null;
  /** Roll mode actually applied, after advantage/disadvantage cancellation. */
  rollMode: RollMode;
  /** Why disadvantage applied (e.g. the condition name), for player-facing transparency. Unset when rollMode is not "disadvantage". */
  disadvantageCause?: string;
}
