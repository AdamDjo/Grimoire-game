import type { Choice, SurvivalStats } from '@grimoire/shared'

/**
 * PROVISIONAL front-only consequence engine for the session demo.
 *
 * The backend (#98) currently returns narrative + choices only — no mechanical
 * consequences and no dice. To make the HUD move and show a roll (DoD of #99),
 * we simulate deltas on the client. This is disposable: once the backend owns
 * the rules and returns real `consequences`, this file is deleted.
 *
 * The AI/backend must stay the source of truth for canon rules — nothing here
 * is authoritative. It only animates the demo.
 */

/** A resolved d20 roll shown at risky pivots. */
export interface DiceRoll {
  /** Natural d20 result, 1–20. */
  value: number
  /** Whether the roll cleared the difficulty for the choice's risk. */
  success: boolean
  /** Target number the roll had to meet or beat. */
  target: number
}

export interface ChoiceResolution {
  survival: SurvivalStats
  /** Present only when the choice was risky enough to warrant a roll. */
  roll?: DiceRoll
}

/** Risk levels that trigger a visible d20 roll. */
const ROLL_RISK: ReadonlySet<NonNullable<Choice['riskLevel']>> = new Set([
  'medium',
  'high',
  'deadly',
])

/** Difficulty target per risk level (higher = harder). */
const RISK_TARGET: Record<NonNullable<Choice['riskLevel']>, number> = {
  safe: 5,
  low: 8,
  medium: 11,
  high: 14,
  deadly: 17,
}

/** Baseline survival drain applied every turn (walking the salt roads is costly). */
const BASE_DRAIN = { thirst: 4, hunger: 3, energy: 5 } as const

/** Extra HP lost on a failed risky roll, by risk level. */
const FAILURE_HP_LOSS: Record<NonNullable<Choice['riskLevel']>, number> = {
  safe: 0,
  low: 0,
  medium: 6,
  high: 12,
  deadly: 20,
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

/** Rolls a fair d20. */
export function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1
}

/**
 * Applies the simulated consequences of a choice to the current survival stats.
 * Every turn drains thirst/hunger/energy; risky choices roll a d20 and cost HP
 * on failure. Pure given the roll — the roll itself is the only randomness.
 */
export function resolveChoice(current: SurvivalStats, choice: Choice): ChoiceResolution {
  const risk = choice.riskLevel ?? 'safe'

  const next: SurvivalStats = {
    ...current,
    thirst: clamp(current.thirst - BASE_DRAIN.thirst, 0, 100),
    hunger: clamp(current.hunger - BASE_DRAIN.hunger, 0, 100),
    energy: clamp(current.energy - BASE_DRAIN.energy, 0, 100),
  }

  if (!ROLL_RISK.has(risk)) {
    return { survival: next }
  }

  const value = rollD20()
  const target = RISK_TARGET[risk]
  const success = value >= target

  if (!success) {
    next.hp = clamp(current.hp - FAILURE_HP_LOSS[risk], 0, current.maxHp)
  }

  return { survival: next, roll: { value, success, target } }
}
