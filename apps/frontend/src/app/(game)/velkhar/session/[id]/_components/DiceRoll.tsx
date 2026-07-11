import type { DiceRoll as DiceRollResult } from '../_lib/consequences'

interface DiceRollProps {
  roll: DiceRollResult
}

/** Provisional d20 display shown at risky pivots. Keyed by turn to re-animate. */
export function DiceRoll({ roll }: DiceRollProps) {
  return (
    <div className="gs-dice" aria-label="Dice roll">
      <span className="gs-die">{roll.value}</span>
      <div>
        <div className="gs-dice-outcome" data-success={roll.success}>
          {roll.success ? 'Success' : 'Failure'}
        </div>
        <div className="gs-dice-target">d20 vs {roll.target}</div>
      </div>
    </div>
  )
}
