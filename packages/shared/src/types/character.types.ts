/**
 * Velkhar character model — canon triptyque + survie.
 * @see docs/private/raw/04-ATTRIBUTES.md, 06-SURVIVAL.md
 */

/** The three canon attributes (SANG / SOUFFLE / CENDRE). Values range 3–18. */
export type Attribute = "blood" | "breath" | "ash";

export type Attributes = Record<Attribute, number>;

/**
 * Attribute modifier from the raw value (3–18).
 * Canon table: 3=-3, 4-5=-2, 6-7=-1, 8-11=0, 12-13=+1, 14-15=+2, 16-17=+3, 18=+4.
 */
export function attributeModifier(value: number): number {
  if (value <= 3) return -3;
  if (value <= 5) return -2;
  if (value <= 7) return -1;
  if (value <= 11) return 0;
  if (value <= 13) return 1;
  if (value <= 15) return 2;
  if (value <= 17) return 3;
  return 4;
}

/** Max HP derived from the blood attribute. Canon: PV_max = 10 + mod SANG. */
export function maxHpFromBlood(blood: number): number {
  return 10 + attributeModifier(blood);
}

/**
 * Persistent altered states beyond the gauges.
 * @see docs/private/raw/06-SURVIVAL.md §2
 */
export type Condition =
  | "fever"
  | "poisoned"
  | "wounded"
  | "frozen"
  | "stunned"
  | "blinded"
  | "marsh_sickness"
  | "ash_corrupted"
  | "shaken_mind"
  | "slow_petrification";

/** Survival gauges (0–100), all tied to the blood attribute. */
export interface SurvivalStats {
  hp: number;
  maxHp: number; // = maxHpFromBlood(attributes.blood)
  thirst: number;
  hunger: number;
  energy: number;
  /** Accumulated Cendre corruption (0–100). 100 = death (Calciné). */
  calamine: number;
}

export interface CharacterStats {
  attributes: Attributes;
  survival: SurvivalStats;
  conditions: Condition[];
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  /** People id, see PEOPLES in constants/peoples. */
  people: string;
  /** Vocation id, see VOCATIONS in constants/vocations. */
  vocation: string;
  /** Free-form concept when the player picks the "custom vocation" path. */
  freeConcept?: string;
  stats: CharacterStats;
  backstory?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface CreateCharacterInput {
  name: string;
  people: string;
  vocation: string;
  freeConcept?: string;
}
