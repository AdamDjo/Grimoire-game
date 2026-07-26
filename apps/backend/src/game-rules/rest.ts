import { attributeModifier } from '@grimoire/shared'

import type { PersistedInventoryItem, SurvivalStats } from '@grimoire/shared'

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

/**
 * The two rest types the backend resolves mid-run. "inn" is a distinct,
 * session-ending flow (`endSessionAtInn` in `session.service.ts`, canon
 * 09-ACTION-LOOP §7) and is deliberately out of scope for this ticket (#184,
 * issue title: "Action de repos — court / feu").
 * @see docs/public/raw/06-SURVIVAL.md §3
 */
export type RestType = 'short' | 'fire'

/**
 * Canon rest rates (06-SURVIVAL §3, "Taux de repos (contrat moteur)"). All
 * gauges are clamped to [0, 100] by the caller. Values are normative — never
 * invented, never tuned here without updating the canon table first.
 */
export const REST_RATES = {
  short: { energy: 20, hunger: 0, thirst: 0, calamine: 0 },
  fire: { energy: 60, hunger: 60, thirst: 60, calamine: -10 },
} as const satisfies Record<
  RestType,
  { energy: number; hunger: number; thirst: number; calamine: number }
>

/**
 * Whether the character carries at least one item whose effect heals HP —
 * the mechanical proxy for canon's "si bandages" gating (06-SURVIVAL §3, §8:
 * "Bandages — Soin lors du repos"). No item carries a dedicated "isBandage"
 * flag in the shared contract; `effect.healAmount` is the only structural
 * signal for "an item that heals", so it stands in for "has bandages" here.
 */
export function hasHealingItem(items: PersistedInventoryItem[]): boolean {
  return items.some((item) => (item.effect?.healAmount ?? 0) > 0)
}

export interface RestOptions {
  /**
   * Whether the character has provisions (food/water) for the "fire" rest's
   * hunger/thirst recovery (canon: "« +60 faim/soif » ne s'applique que si
   * le perso a des provisions"). NOTE: the shared inventory contract has no
   * structural flag for a food/water item (unlike healing, which maps to
   * `effect.healAmount`) — #183's V2 scope never implemented a depletable
   * provisions stock. Callers must supply this explicitly; `session.service.ts`
   * currently defaults it to `true` until a real provisions mechanic exists
   * (tracked as a follow-up, not invented here).
   */
  hasProvisions: boolean
  rng?: () => number
}

export interface RestResult {
  survival: SurvivalStats
  /** The 1d4 (short) or 1d4+mod SANG (fire) healing roll actually applied, 0 when no bandages were carried. */
  healRolled: number
}

/** Rolls 1dN using the injected rng (same convention as `game-rules/dice.ts`/`rollNeglectCalamine`). */
function rollDie(sides: number, rng: () => number): number {
  return 1 + Math.floor(rng() * sides)
}

/**
 * Applies canon rest rates (06-SURVIVAL §3) to survival stats. The AI never
 * chooses these values — it only proposes the rest via `restRequested`
 * (15-GAME-MASTER §4.5); this is the backend's sole computation.
 *
 * - `short`: +20 energy, +1d4 HP if the character carries a healing item
 *   ("bandages"), no hunger/thirst/calamine change.
 * - `fire`: +60 energy, +60 hunger/thirst (only if `hasProvisions`), +1d4 +
 *   mod SANG HP if bandages, -10 calamine.
 *
 * All gauges clamp to [0, 100] (HP clamps to `maxHp`). Rest risk (ambush) is
 * explicitly deferred to a future ticket — this function is always safe.
 */
export function applyRest(
  type: RestType,
  survival: SurvivalStats,
  items: PersistedInventoryItem[],
  bloodAttribute: number,
  { hasProvisions, rng = Math.random }: RestOptions
): RestResult {
  const rates = REST_RATES[type]
  const bandaged = hasHealingItem(items)

  const healRolled = bandaged
    ? type === 'fire'
      ? rollDie(4, rng) + attributeModifier(bloodAttribute)
      : rollDie(4, rng)
    : 0

  const hungerGain = hasProvisions ? rates.hunger : 0
  const thirstGain = hasProvisions ? rates.thirst : 0

  return {
    survival: {
      ...survival,
      energy: clamp(survival.energy + rates.energy, 0, 100),
      hunger: clamp(survival.hunger + hungerGain, 0, 100),
      thirst: clamp(survival.thirst + thirstGain, 0, 100),
      hp: clamp(survival.hp + healRolled, 0, survival.maxHp),
      calamine: clamp(survival.calamine + rates.calamine, 0, 100),
    },
    healRolled,
  }
}
