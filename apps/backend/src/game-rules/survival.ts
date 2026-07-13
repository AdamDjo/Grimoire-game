import type { SurvivalStats } from '@grimoire/shared'

/**
 * Per-turn survival drain. Walking the salt roads wears down thirst, hunger and
 * energy. Pure and deterministic.
 *
 * Canon 06-SURVIVAL: degradation is *slow* and death by survival is rare and
 * telegraphed — the gauges are ambient pressure, not a turn-by-turn timer. So a
 * full gauge lasts many turns; thirst leads (desert setting, salt-walker), then
 * energy, then hunger. Backend owns these — tuning is a constant change.
 */
export const TURN_DRAIN = { thirst: 2, hunger: 1, energy: 2 } as const

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
