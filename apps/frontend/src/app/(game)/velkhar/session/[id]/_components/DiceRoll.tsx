import type { DiceRoll as DiceRollResult } from '@grimoire/shared'

interface DiceRollProps {
  roll: DiceRollResult
}

/** d20 display shown at risky pivots. Keyed by turn to re-animate. Backend-owned. */
export function DiceRoll({ roll }: DiceRollProps) {
  const modifierSign = roll.modifier >= 0 ? '+' : ''

  return (
    <div className="gs-dice" aria-label="Dice roll">
      <span className="gs-die" data-critical={roll.critical ?? undefined}>
        {roll.roll}
      </span>
      <div>
        <div className="gs-dice-outcome" data-success={roll.success}>
          {roll.success ? 'Success' : 'Failure'}
        </div>
        <div className="gs-dice-target">
          {roll.roll}
          {modifierSign}
          {roll.modifier} = {roll.total} vs {roll.target}
        </div>
      </div>
    </div>
  )
}
