import type { SurvivalStats } from '@grimoire/shared'

/**
 * Per-turn survival drain. Walking the salt roads wears down thirst, hunger and
 * energy. Pure and deterministic.
 *
 * Canon 06-SURVIVAL: degradation is *slow* and death by survival is rare and
 * telegraphed — the gauges are ambient pressure, not a turn-by-turn timer. So a
 * full gauge lasts many turns; thirst leads (desert setting, salt-walker), then
 * energy, then hunger. Rebalanced for #201: a full gauge now empties in ~25-33
 * turns instead of ~33-100 — still slow, but the tiers below actually get felt
 * before the run ends. Backend owns these — tuning is a constant change.
 */
export const TURN_DRAIN = { thirst: 4, hunger: 3, energy: 4 } as const

/**
 * Narrative-facing gauge tiers, canon 06-SURVIVAL §1 échelle: 75 = légère gêne,
 * 50 = malus modéré (souffrance perceptible), 25 = malus sévère → Désavantage
 * (08-DICE-RESOLUTION §5 replaces the old flat -1/-2 malus language), 0 = the
 * existing `fever` backend condition already covers the mechanical floor.
 */
export type GaugeTier = 'ok' | 'strained' | 'severe' | 'critical'

/**
 * Tier for a single 0-100 survival gauge (thirst/hunger/energy). 25 and below
 * is `critical` — the threshold at which `computeDisadvantage` applies
 * Désavantage (game-rules/conditions.ts), confirmed non-cumulative even when
 * several gauges are critical at once.
 */
export function gaugeTier(value: number): GaugeTier {
  if (value <= 25) return 'critical'
  if (value <= 50) return 'severe'
  if (value <= 75) return 'strained'
  return 'ok'
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

/**
 * Applies the baseline per-turn drain to the survival gauges, clamped to 0..100.
 * hp/maxHp/calamine are untouched here — they move through consequences, not drain.
 */
export function applyTurnDrain(stats: SurvivalStats): SurvivalStats {
  return {
    ...stats,
    thirst: clamp(stats.thirst - TURN_DRAIN.thirst, 0, 100),
    hunger: clamp(stats.hunger - TURN_DRAIN.hunger, 0, 100),
    energy: clamp(stats.energy - TURN_DRAIN.energy, 0, 100),
  }
}

/** Clamps a single survival gauge to its valid 0..max range. */
export function clampGauge(value: number, max = 100): number {
  return clamp(value, 0, max)
}

/**
 * Consecutive turns of thirst=0 or hunger=0 required before prolonged neglect
 * starts corroding Calamine. #201, docs/canon/06-SURVIVAL.md §4.
 */
export const NEGLECT_STREAK_THRESHOLD = 3

/** Calamine/turn range applied once neglect has run for `NEGLECT_STREAK_THRESHOLD`+ turns. */
export const NEGLECT_CALAMINE_RANGE = { min: 3, max: 5 } as const

/**
 * -1 PV/turn while thirst or hunger sits at 0, non-cumulative between the two
 * gauges (still -1, not -2, when both are empty at once). #201.
 */
export function applyNeglectErosion(stats: SurvivalStats): SurvivalStats {
  const neglected = stats.thirst <= 0 || stats.hunger <= 0
  if (!neglected) return stats
  return { ...stats, hp: clamp(stats.hp - 1, 0, stats.maxHp) }
}

/**
 * Advances the consecutive-neglect counter: +1 while thirst or hunger is at 0,
 * reset to 0 the instant both are back above 0. Pure bookkeeping — the
 * resulting Calamine delta is computed separately by `rollNeglectCalamine`.
 */
export function tickNeglectStreak(stats: SurvivalStats): SurvivalStats {
  const neglected = stats.thirst <= 0 || stats.hunger <= 0
  return { ...stats, neglectStreak: neglected ? stats.neglectStreak + 1 : 0 }
}

/**
 * BACKEND-triggered Calamine source (never AI-proposed): once neglect has run
 * `NEGLECT_STREAK_THRESHOLD`+ consecutive turns, +3 to +5 Calamine/turn.
 * @see docs/canon/06-SURVIVAL.md §4
 */
export function rollNeglectCalamine(
  neglectStreak: number,
  rng: () => number = Math.random
): number {
  if (neglectStreak < NEGLECT_STREAK_THRESHOLD) return 0
  const { min, max } = NEGLECT_CALAMINE_RANGE
  return min + Math.floor(rng() * (max - min + 1))
}

export interface TurnUpkeepResult {
  survival: SurvivalStats
  /** Calamine added by prolonged neglect this turn, 0 when the streak is short. */
  neglectCalamineDelta: number
}

/**
 * The full per-turn survival upkeep: drain, neglect erosion, streak, and the
 * Calamine that prolonged neglect corrodes.
 *
 * Extracted so that *every* kind of turn pays it, not just the exploration one.
 * Canon says "-1 PV par tour" and "+3 à +5 Calamine par tour" without carving
 * out an exception for fighting (§4, §59) — and a turn spent trading blows is
 * still a turn. Leaving combat outside this cycle would have made starving free
 * as long as the player kept swinging, which is the opposite of the pressure
 * survival is meant to apply.
 *
 * Pure given `rng`, like every other rule in this folder.
 * @see docs/canon/06-SURVIVAL.md §4
 */
export function applyTurnUpkeep(
  stats: SurvivalStats,
  rng: () => number = Math.random
): TurnUpkeepResult {
  const drained = applyTurnDrain(stats)
  const eroded = applyNeglectErosion(drained)
  const tracked = tickNeglectStreak(eroded)
  const neglectCalamineDelta = rollNeglectCalamine(tracked.neglectStreak, rng)

  return {
    survival:
      neglectCalamineDelta > 0
        ? { ...tracked, calamine: clamp(tracked.calamine + neglectCalamineDelta, 0, 100) }
        : tracked,
    neglectCalamineDelta,
  }
}

export interface DyingResolution {
  survival: SurvivalStats
  /** True once this hit is the SECOND consecutive 0-HP event — definitive death. */
  definitiveDeath: boolean
}

/**
 * Universal "mourant" safety net (#201, supersedes the old "0 PV = inconscience"
 * rule): the first time HP reaches 0, from any source (combat, condition damage,
 * survival neglect), the character is telegraphed as dying and HP is pinned at 0
 * for one full reprieve turn — no immediate game over. A second 0-HP hit while
 * already dying is definitive death. Healing back above 0 clears the flag
 * elsewhere (`clearDyingOnHeal`) — this function only ever sets it.
 * @see docs/canon/06-SURVIVAL.md §7
 */
export function resolveDying(stats: SurvivalStats): DyingResolution {
  if (stats.hp > 0) return { survival: stats, definitiveDeath: false }

  if (stats.isDying) {
    return { survival: { ...stats, hp: 0 }, definitiveDeath: true }
  }

  return { survival: { ...stats, hp: 0, isDying: true }, definitiveDeath: false }
}

/** Clears the "mourant" flag once HP is healed back above 0 (item, rest, ally help). */
export function clearDyingOnHeal(stats: SurvivalStats): SurvivalStats {
  if (stats.hp <= 0 || !stats.isDying) return stats
  return { ...stats, isDying: false }
}
