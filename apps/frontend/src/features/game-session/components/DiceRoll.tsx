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
    <div
      className="game-session-dice"
      aria-label={t('diceResult')}
      data-roll-mode={roll.rollMode}
      role="status"
    >
      <div className="game-session-dice__roll">
        <span className="game-session-die" data-critical={roll.critical ?? undefined}>
          <GameIcon decorative name="dice" size={48} />
          {roll.roll}
        </span>
        {roll.rollMode === 'disadvantage' ? (
          <span className="game-session-dice__mode">
            <GameIcon decorative name="warning" size={24} />
            {t('disadvantage')}
          </span>
        ) : roll.rollMode === 'advantage' ? (
          <span className="game-session-dice__mode">{t('advantage')}</span>
        ) : null}
      </div>
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
        {roll.rollMode === 'disadvantage' && roll.disadvantageCause ? (
          <p className="game-session-dice__cause">
            {t('disadvantageCause', { cause: roll.disadvantageCause })}
          </p>
        ) : null}
      </div>
    </div>
  )
}
