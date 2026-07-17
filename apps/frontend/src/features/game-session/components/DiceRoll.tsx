import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'

import type { GameSessionDiceRoll } from '../model/game-session.types'

interface DiceRollProps {
  roll: GameSessionDiceRoll
}

/** d20 display shown at risky pivots. Keyed by turn to re-animate. Backend-owned. */
export function DiceRoll({ roll }: DiceRollProps) {
  const modifierSign = roll.modifier >= 0 ? '+' : ''

  return (
    <div className="game-session-dice" aria-label="Dice roll result" role="status">
      <span className="game-session-die" data-critical={roll.critical ?? undefined}>
        <GameIcon decorative name="dice" size={48} />
        {roll.roll}
      </span>
      <div>
        <div className="game-session-dice__outcome" data-success={roll.success}>
          {roll.success ? 'Success' : 'Failure'}
        </div>
        <div className="game-session-dice__target">
          d20 {roll.roll} {modifierSign}
          {roll.modifier} = {roll.total} against {roll.target}
        </div>
      </div>
    </div>
  )
}
