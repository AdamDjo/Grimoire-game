import { type Attribute, type Attributes, attributeModifier } from '@grimoire/shared'

export type Difficulty = 'safe' | 'low' | 'medium' | 'high' | 'deadly'

/** Target numbers per difficulty. Rolls resolve on the backend, never the AI. */
export const DIFFICULTY_TARGET: Record<Difficulty, number> = {
  safe: 5,
  low: 8,
  medium: 12,
  high: 16,
  deadly: 19,
}

export interface DiceRoll {
  roll: number
  modifier: number
  total: number
  target: number
  success: boolean
  /** Natural 20 / natural 1 flags for narration flavor. */
  critical: 'success' | 'failure' | null
}

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
