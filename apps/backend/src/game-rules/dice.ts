import {
  type Attribute,
  type Attributes,
  attributeModifier,
  type Difficulty,
  type DiceRoll,
  DIFFICULTY_TARGET,
} from '@grimoire/shared'

export type { Difficulty, DiceRoll }
export { DIFFICULTY_TARGET }

export interface RollCheckOptions {
  /** Context grants advantage (prepared plan, adapted item, ally help, exploited weakness). */
  advantage?: boolean
  /** A severe active condition imposes disadvantage. Cause is the condition name, for transparency. */
  disadvantage?: { cause: string }
}

/**
 * Rolls 1d20 (or 2d20 keep best/worst under advantage/disadvantage), adds the attribute
 * modifier, and compares to the difficulty target.
 * @see docs/canon/08-DICE-RESOLUTION.md §5 (Avantage et Désavantage)
 */
export function rollCheck(
  attributes: Attributes,
  attribute: Attribute,
  difficulty: Difficulty,
  rng: () => number = Math.random,
  options: RollCheckOptions = {}
): DiceRoll {
  // Advantage and disadvantage cancel out — a single d20, per canon §5.
  const hasAdvantage = Boolean(options.advantage) && !options.disadvantage
  const hasDisadvantage = Boolean(options.disadvantage) && !options.advantage

  const rollOnce = () => 1 + Math.floor(rng() * 20)
  const first = rollOnce()
  const second = hasAdvantage || hasDisadvantage ? rollOnce() : null
  const roll =
    second === null ? first : hasAdvantage ? Math.max(first, second) : Math.min(first, second)

  const modifier = attributeModifier(attributes[attribute])
  const total = roll + modifier
  const target = DIFFICULTY_TARGET[difficulty]

  const critical: DiceRoll['critical'] = roll === 20 ? 'success' : roll === 1 ? 'failure' : null

  // Natural 20 always succeeds, natural 1 always fails (canon d20 convention).
  const success = critical === 'success' ? true : critical === 'failure' ? false : total >= target

  const rollMode: DiceRoll['rollMode'] = hasAdvantage
    ? 'advantage'
    : hasDisadvantage
      ? 'disadvantage'
      : 'normal'

  return {
    roll,
    modifier,
    total,
    target,
    success,
    critical,
    rollMode,
    ...(hasDisadvantage && options.disadvantage
      ? { disadvantageCause: options.disadvantage.cause }
      : {}),
  }
}
