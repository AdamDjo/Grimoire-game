import { useTranslations } from 'next-intl'

import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'

import type { GameSessionDiceRoll } from '../model/game-session.types'

interface DiceRollProps {
  roll: GameSessionDiceRoll
}

/** d20 display shown at risky pivots. Keyed by turn to re-animate. Backend-owned. */
export function DiceRoll({ roll }: DiceRollProps) {
  const t = useTranslations('Session')
  const modifierSign = roll.modifier >= 0 ? '+' : ''
  const modifier = `${modifierSign}${roll.modifier}`

  return (
    <div className="game-session-dice" aria-label={t('diceResult')} role="status">
      <span className="game-session-die" data-critical={roll.critical ?? undefined}>
        <GameIcon decorative name="dice" size={48} />
        {roll.roll}
      </span>
      <div>
        <div className="game-session-dice__outcome" data-success={roll.success}>
          {roll.success ? t('success') : t('failure')}
        </div>
        <div className="game-session-dice__target">
          {t('diceAgainst', {
            modifier,
            roll: roll.roll,
            target: roll.target,
            total: roll.total,
          })}
        </div>
      </div>
    </div>
  )
}
