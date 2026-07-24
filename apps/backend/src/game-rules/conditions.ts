import { CONDITIONS, getConditionDefinition } from '@grimoire/shared'

import { gaugeTier } from './survival'

import type { ActiveCondition, ConditionId, Locale, SurvivalStats } from '@grimoire/shared'

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

const hasCondition = (conditions: ActiveCondition[], id: ConditionId): boolean =>
  conditions.some((condition) => condition.id === id)

/**
 * [BACKEND] conditions applied automatically on threshold crossing, never proposed by the AI.
 * @see docs/public/raw/06-SURVIVAL.md §2 "Les deux familles de conditions"
 */
export interface BackendConditionTriggerInput {
  survival: SurvivalStats
  /** True when this turn's HP loss brought the character to 0 and they were revived, or a combat critical hit landed. */
  woundingHit: boolean
}

/**
 * Applies backend-family conditions (`fever`, `wound`) that should now be active given the
 * current turn's state, without duplicating ones already present.
 */
export function applyBackendConditions(
  conditions: ActiveCondition[],
  { survival, woundingHit }: BackendConditionTriggerInput,
  turnNumber: number
): ActiveCondition[] {
  const next = [...conditions]

  const feverTriggered = survival.hunger <= 0 || survival.thirst <= 0
  if (feverTriggered && !hasCondition(next, 'fever')) {
    next.push({
      id: 'fever',
      source: 'backend',
      appliedAtTurn: turnNumber,
      expiresRule: { type: 'until_cured' },
    })
  }

  if (woundingHit && !hasCondition(next, 'wound')) {
    next.push({
      id: 'wound',
      source: 'backend',
      appliedAtTurn: turnNumber,
      expiresRule: { type: 'until_cured' },
    })
  }

  return next
}

/**
 * Removes a condition once its cure condition is no longer met (e.g. fever clears once
 * hunger and thirst are both back above 0). Conditions with `expiresRule: "until_cured"` and
 * no matching auto-clear rule here persist until an explicit cure (rest, item, etc.).
 */
export function clearResolvedBackendConditions(
  conditions: ActiveCondition[],
  survival: SurvivalStats
): ActiveCondition[] {
  const feverShouldClear = survival.hunger > 0 && survival.thirst > 0
  return conditions.filter((condition) => !(condition.id === 'fever' && feverShouldClear))
}

export interface TickConditionsResult {
  conditions: ActiveCondition[]
  survival: SurvivalStats
  /** True when a condition's per-turn damage brought HP to 0 this tick. */
  lethal: boolean
}

/**
 * Applies per-turn condition damage (e.g. poison) and expires conditions whose `turns` rule
 * has elapsed. Pure and deterministic — combat vs out-of-combat poison rate is not yet
 * distinguished (out of scope for #181; canon 06-SURVIVAL §2 splits it, revisit with combat turns).
 */
export function tickConditions(
  conditions: ActiveCondition[],
  survival: SurvivalStats,
  turnNumber: number
): TickConditionsResult {
  let hp = survival.hp

  for (const condition of conditions) {
    const definition = getConditionDefinition(condition.id)
    if (definition?.damagePerTurn) {
      hp = clamp(hp - definition.damagePerTurn, 0, survival.maxHp)
    }
  }

  const remaining = conditions.filter((condition) => {
    if (condition.expiresRule.type !== 'turns') return true
    return turnNumber - condition.appliedAtTurn < condition.expiresRule.count
  })

  return {
    conditions: remaining,
    survival: { ...survival, hp },
    lethal: hp <= 0,
  }
}

const CRITICAL_GAUGE_NAME: Record<'thirst' | 'hunger' | 'energy', Record<'fr' | 'en', string>> = {
  thirst: { fr: 'soif critique', en: 'critical thirst' },
  hunger: { fr: 'faim critique', en: 'critical hunger' },
  energy: { fr: 'fatigue critique', en: 'critical exhaustion' },
}

/**
 * Whether any active condition OR critical survival gauge (thirst/hunger/energy
 * at 25 or below, #201) imposes Désavantage right now, and why (for
 * player-facing transparency). Non-cumulative: multiple severe conditions and/or
 * multiple critical gauges still yield a single cause string — the player never
 * stacks Désavantage twice.
 * @see docs/public/raw/08-DICE-RESOLUTION.md §5, docs/public/raw/06-SURVIVAL.md §1
 */
export function computeDisadvantage(
  conditions: ActiveCondition[],
  survival: SurvivalStats,
  locale: Locale
): { cause: string } | undefined {
  const nameKey = locale === 'fr' ? 'fr' : 'en'
  const severe = conditions.filter(
    (condition) => getConditionDefinition(condition.id)?.disadvantage
  )
  const conditionNames = severe.map(
    (condition) => getConditionDefinition(condition.id)?.name[nameKey] ?? condition.id
  )

  const criticalGaugeNames = (['thirst', 'hunger', 'energy'] as const)
    .filter((gauge) => gaugeTier(survival[gauge]) === 'critical')
    .map((gauge) => CRITICAL_GAUGE_NAME[gauge][nameKey])

  const names = [...conditionNames, ...criticalGaugeNames]
  if (names.length === 0) return undefined

  return { cause: names.join(', ') }
}

/**
 * Validates an AI-proposed [IA-PROPOSÉE] condition against the canon whitelist. Plausibility
 * (narrative/biome context) is judged by the caller — this only checks the id is a known,
 * AI-proposable condition id (06-SURVIVAL §2).
 */
export function isValidAiConditionId(id: string): id is ConditionId {
  const definition = CONDITIONS.find((condition) => condition.id === id)
  return definition?.family === 'ia'
}

export function applyAiCondition(
  conditions: ActiveCondition[],
  id: ConditionId,
  turnNumber: number
): ActiveCondition[] {
  if (hasCondition(conditions, id)) return conditions
  return [
    ...conditions,
    { id, source: 'ai', appliedAtTurn: turnNumber, expiresRule: { type: 'until_cured' } },
  ]
}

/** Max Calamine gained from a single AI-proposed source in one turn. @see docs/public/raw/06-SURVIVAL.md §4 */
export const CALAMINE_DELTA_CAP = 20

/** Calamine tiers (06-SURVIVAL §4). `dead` is the 100 transformation threshold, not a narrative tier. */
export type CalamineTier = 'none' | 'stage1' | 'stage2' | 'stage3' | 'dead'

/**
 * The canon tier for a given Calamine value: 0-24 none, 25-49 stage 1,
 * 50-74 stage 2, 75-99 stage 3, 100 = transformation (Calciné).
 */
export function calamineTier(calamine: number): CalamineTier {
  if (calamine >= 100) return 'dead'
  if (calamine >= 75) return 'stage3'
  if (calamine >= 50) return 'stage2'
  if (calamine >= 25) return 'stage1'
  return 'none'
}

/**
 * Bounds an AI-proposed Calamine delta to the canon cap, dropping non-positive
 * or non-finite values. There is no passive drain and no canon source lowers
 * Calamine via `apply_condition` — only positive deltas from a validated
 * narrative source are meaningful here.
 * @see docs/public/raw/06-SURVIVAL.md §4
 */
export function clampCalamineDelta(delta: number): number {
  if (!Number.isFinite(delta) || delta <= 0) return 0
  return Math.min(delta, CALAMINE_DELTA_CAP)
}

/**
 * Applies a bounded Calamine delta to survival stats, clamped to [0, 100].
 * Only `cendre_corrupt` proposals carry a meaningful delta — callers must
 * check the condition id before calling this (see `resolveTurn` in
 * `session.service.ts`, applied post-hoc once the AI proposal is known).
 */
export function applyCalamineDelta(survival: SurvivalStats, delta: number): SurvivalStats {
  const bounded = clampCalamineDelta(delta)
  if (bounded === 0) return survival
  return { ...survival, calamine: clamp(survival.calamine + bounded, 0, 100) }
}
