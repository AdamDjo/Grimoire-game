import {
  applyBackendConditions,
  clearResolvedBackendConditions,
  computeDisadvantage,
  tickConditions,
} from './conditions'
import { rollCheck } from './dice'
import { applyTurnUpkeep, clearDyingOnHeal, resolveDying } from './survival'

import type {
  ActiveCondition,
  Attribute,
  Attributes,
  Choice,
  ChoiceConsequence,
  DiceRoll,
  Difficulty,
  Locale,
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
  /** Conditions active before this turn resolves. */
  activeConditions: ActiveCondition[]
  /** Turn number this choice resolves on — stamps newly-applied conditions and drives expiry. */
  turnNumber: number
  /** Session locale — determines the language of the Désavantage cause string (#168 source of truth). */
  locale: Locale
  /** Context grants advantage this turn (prepared plan, adapted item, ally help, exploited weakness). */
  advantage?: boolean
  /** Injected for deterministic tests. Defaults to Math.random. */
  rng?: () => number
}

export interface ResolveChoiceResult {
  updatedSurvival: SurvivalStats
  /** Conditions active after this turn's ticks, applications and clears. */
  updatedConditions: ActiveCondition[]
  /** Present only when the choice was risky enough to roll. */
  diceRoll?: DiceRoll
  /** Mechanical consequences applied this turn, for logging and the client. */
  consequences: ChoiceConsequence
  /** True only on a SECOND consecutive 0-HP hit — the session must end (endReason 'death'). */
  gameOver: boolean
}

/**
 * Resolves a player's choice mechanically. Pure given `rng`:
 * applies the per-turn survival drain, ticks active conditions (damage/turn, expiry),
 * rolls a d20 (with Désavantage when a severe condition is active) for risky choices, and
 * subtracts HP on failure. The backend is the sole source of truth here — the AI only
 * narrates the outcome.
 * @see docs/public/raw/06-SURVIVAL.md §2, docs/public/raw/08-DICE-RESOLUTION.md §5
 */
export function resolveChoice({
  attributes,
  survival,
  choice,
  activeConditions,
  turnNumber,
  locale,
  advantage,
  rng = Math.random,
}: ResolveChoiceInput): ResolveChoiceResult {
  const risk: Difficulty = choice.riskLevel ?? 'safe'

  // Drain, -1 PV/turn while thirst or hunger sits at 0 (non-cumulative between
  // the two), the consecutive-neglect counter and the Calamine it corrodes.
  // Shared with the combat path so a turn costs the same either way. #201, #235.
  const { survival: withNeglectCalamine, neglectCalamineDelta } = applyTurnUpkeep(survival, rng)

  const consequences: ChoiceConsequence = {
    survivalChanges: {
      thirst: withNeglectCalamine.thirst - survival.thirst,
      hunger: withNeglectCalamine.hunger - survival.hunger,
      energy: withNeglectCalamine.energy - survival.energy,
      ...(withNeglectCalamine.hp !== survival.hp
        ? { hp: withNeglectCalamine.hp - survival.hp }
        : {}),
      ...(neglectCalamineDelta > 0 ? { calamine: neglectCalamineDelta } : {}),
    },
  }

  const tick = tickConditions(activeConditions, withNeglectCalamine, turnNumber)
  let conditions = clearResolvedBackendConditions(tick.conditions, tick.survival)
  const survivalAfterTick = tick.survival
  if (survivalAfterTick.hp !== withNeglectCalamine.hp) {
    consequences.survivalChanges = {
      ...consequences.survivalChanges,
      hp: (consequences.survivalChanges?.hp ?? 0) + (survivalAfterTick.hp - withNeglectCalamine.hp),
    }
  }

  if (tick.lethal) {
    const dying = resolveDying(survivalAfterTick)
    consequences.gameOver = dying.definitiveDeath
    consequences.dying = !dying.definitiveDeath
    return {
      updatedSurvival: dying.survival,
      updatedConditions: conditions,
      consequences,
      gameOver: dying.definitiveDeath,
    }
  }

  if (!ROLL_RISKS.has(risk)) {
    const healed = clearDyingOnHeal(survivalAfterTick)
    conditions = applyBackendConditions(
      conditions,
      { survival: healed, woundingHit: false },
      turnNumber
    )
    return {
      updatedSurvival: healed,
      updatedConditions: conditions,
      consequences,
      gameOver: false,
    }
  }

  const disadvantage = computeDisadvantage(conditions, survivalAfterTick, locale)
  const diceRoll = rollCheck(attributes, ATTRIBUTE_BY_TYPE[choice.type], risk, rng, {
    advantage,
    disadvantage,
  })

  // Canon: combat and sauvegarde (flee) draw blood on failure. A failed
  // persuasion/exploration/skill check stays a narrative complication (the AI
  // narrates it), never an HP penalty.
  let hp = survivalAfterTick.hp
  const isCombatCrit = choice.type === 'combat' && diceRoll.critical === 'failure'
  if (!diceRoll.success && PHYSICAL_RISK_TYPES.has(choice.type)) {
    hp = clamp(survivalAfterTick.hp - PHYSICAL_FAILURE_HP_LOSS[risk], 0, survivalAfterTick.maxHp)
    consequences.survivalChanges = {
      ...consequences.survivalChanges,
      hp: (consequences.survivalChanges?.hp ?? 0) + (hp - survivalAfterTick.hp),
    }
  }

  const woundingHit = hp <= 0 || isCombatCrit
  let updatedSurvival: SurvivalStats = { ...survivalAfterTick, hp }
  let gameOver = false

  if (hp <= 0) {
    const dying = resolveDying(updatedSurvival)
    updatedSurvival = dying.survival
    gameOver = dying.definitiveDeath
    consequences.gameOver = dying.definitiveDeath
    consequences.dying = !dying.definitiveDeath
  } else {
    updatedSurvival = clearDyingOnHeal(updatedSurvival)
  }

  conditions = applyBackendConditions(
    conditions,
    { survival: updatedSurvival, woundingHit },
    turnNumber
  )

  return { updatedSurvival, updatedConditions: conditions, diceRoll, consequences, gameOver }
}
