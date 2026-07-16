import { GameIcon } from '@/components/ui/grimoire'

import type { DiceRoll as DiceRollResult } from '@grimoire/shared'

interface DiceRollProps {
  roll: DiceRollResult
}

/** d20 display shown at risky pivots. Keyed by turn to re-animate. Backend-owned. */
export function DiceRoll({ roll }: DiceRollProps) {
  const modifierSign = roll.modifier >= 0 ? '+' : ''

  return (
    <div className="gs-dice" aria-label="Dice roll result" role="status">
      <span className="gs-die" data-critical={roll.critical ?? undefined}>
        <GameIcon decorative name="dice" size={48} />
        {roll.roll}
      </span>
      <div>
        <div className="gs-dice-outcome" data-success={roll.success}>
          {roll.success ? 'Success' : 'Failure'}
        </div>
        <div className="gs-dice-target">
          d20 {roll.roll} {modifierSign}
          {roll.modifier} = {roll.total} against {roll.target}
        </div>
      </div>
    </div>
  )
}
