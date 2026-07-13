import { rollCheck } from './dice'
import { applyTurnDrain } from './survival'

import type {
  Attribute,
  Attributes,
  Choice,
  ChoiceConsequence,
  DiceRoll,
  Difficulty,
  SurvivalStats,
} from '@grimoire/shared'

/**
 * Which attribute a choice tests, derived from its `type`.
 * SANG (blood) = force/combat, SOUFFLE (breath) = agility/movement,
 * CENDRE (ash) = mind/social.
 */
const ATTRIBUTE_BY_TYPE: Record<Choice['type'], Attribute> = {
  combat: 'blood',
  action: 'breath',
  flee: 'breath',
  dialog: 'ash',
  skill: 'ash',
  use_item: 'ash',
}

/** Risk levels that warrant a visible d20 check. Below this, no roll. */
const ROLL_RISKS: ReadonlySet<Difficulty> = new Set(['medium', 'high', 'deadly'])

/**
 * Choice types whose failure is a physical threat, per canon (06-SURVIVAL §6:
 * "sauvegarde" pivots — résister au poison, échapper au Ventre-Gris — roll
 * alongside combat) and 08-DICE §3 ("Sauvegarde" is its own pivot category next
 * to "Combat clé"). A failed dialog/skill/use_item check stays a pure narrative
 * complication (08-DICE §2), never HP loss.
 */
const PHYSICAL_RISK_TYPES: ReadonlySet<Choice['type']> = new Set(['combat', 'flee'])

/**
 * HP lost on a *failed* physical roll, by risk level. Canon §7: damage = weapon
 * die + SANG mod for combat; these flat values stand in for real damage dice
 * (and for the equivalent sauvegarde harm) until 10-COMBAT lands.
 */
const PHYSICAL_FAILURE_HP_LOSS: Record<Difficulty, number> = {
  safe: 0,
  low: 0,
  medium: 6,
  high: 12,
  deadly: 20,
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

export interface ResolveChoiceInput {
  attributes: Attributes
  survival: SurvivalStats
  choice: Choice
  /** Injected for deterministic tests. Defaults to Math.random. */
  rng?: () => number
}

export interface ResolveChoiceResult {
  updatedSurvival: SurvivalStats
  /** Present only when the choice was risky enough to roll. */
  diceRoll?: DiceRoll
  /** Mechanical consequences applied this turn, for logging and the client. */
  consequences: ChoiceConsequence
  /** True once hp reaches 0 — the session must end (endReason 'death'). */
  gameOver: boolean
}

/**
 * Resolves a player's choice mechanically. Pure given `rng`:
 * applies the per-turn survival drain, rolls a d20 for risky choices, and
 * subtracts HP on failure. The backend is the sole source of truth here —
 * the AI only narrates the outcome.
 */
export function resolveChoice({
  attributes,
  survival,
  choice,
  rng = Math.random,
}: ResolveChoiceInput): ResolveChoiceResult {
  const risk: Difficulty = choice.riskLevel ?? 'safe'

  const drained = applyTurnDrain(survival)
  const consequences: ChoiceConsequence = {
    survivalChanges: {
      thirst: drained.thirst - survival.thirst,
      hunger: drained.hunger - survival.hunger,
      energy: drained.energy - survival.energy,
    },
  }

  if (!ROLL_RISKS.has(risk)) {
    return { updatedSurvival: drained, consequences, gameOver: false }
  }

  const diceRoll = rollCheck(attributes, ATTRIBUTE_BY_TYPE[choice.type], risk, rng)

  // Canon: combat and sauvegarde (flee) draw blood on failure. A failed
  // persuasion/exploration/skill check stays a narrative complication (the AI
  // narrates it), never an HP penalty.
  let hp = drained.hp
  if (!diceRoll.success && PHYSICAL_RISK_TYPES.has(choice.type)) {
    hp = clamp(drained.hp - PHYSICAL_FAILURE_HP_LOSS[risk], 0, drained.maxHp)
    consequences.survivalChanges = { ...consequences.survivalChanges, hp: hp - drained.hp }
  }

  const updatedSurvival: SurvivalStats = { ...drained, hp }
  const gameOver = hp <= 0
  if (gameOver) {
    consequences.gameOver = true
  }

  return { updatedSurvival, diceRoll, consequences, gameOver }
}
