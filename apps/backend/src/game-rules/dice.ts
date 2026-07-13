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

/** Rolls 1d20, adds the attribute modifier, and compares to the difficulty target. */
export function rollCheck(
  attributes: Attributes,
  attribute: Attribute,
  difficulty: Difficulty,
  rng: () => number = Math.random
): DiceRoll {
  const roll = 1 + Math.floor(rng() * 20)
  const modifier = attributeModifier(attributes[attribute])
  const total = roll + modifier
  const target = DIFFICULTY_TARGET[difficulty]

  const critical: DiceRoll['critical'] = roll === 20 ? 'success' : roll === 1 ? 'failure' : null

  // Natural 20 always succeeds, natural 1 always fails (canon d20 convention).
  const success = critical === 'success' ? true : critical === 'failure' ? false : total >= target

  return { roll, modifier, total, target, success, critical }
}
