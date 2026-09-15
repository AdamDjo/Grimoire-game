import { useTranslations } from 'next-intl'

import { DialogueChoice } from '@/components/ui/grimoire/DialogueChoice/DialogueChoice'
import { DialogueChoiceGroup } from '@/components/ui/grimoire/DialogueChoiceGroup/DialogueChoiceGroup'

import type { GameSessionChoice } from '../model/game-session.types'

interface ChoiceListProps {
  choices: GameSessionChoice[]
  disabled: boolean
  selectedChoiceId?: string | null
  onChoose: (choice: GameSessionChoice) => void
}

/** Game Master choices, rendered as immediate and readable player intentions. */
export function ChoiceList({
  choices,
  disabled,
  onChoose,
  selectedChoiceId = null,
}: ChoiceListProps) {
  const t = useTranslations('Session')
  const riskLabel: Record<NonNullable<GameSessionChoice['riskLevel']>, string> = {
    safe: t('riskSafe'),
    low: t('riskLow'),
    medium: t('riskMedium'),
    high: t('riskHigh'),
    deadly: t('riskDeadly'),
  }

  return (
    <DialogueChoiceGroup className="game-session-choices" label={t('actionsAvailable')}>
      {choices.map((choice, index) => (
        <DialogueChoice
          key={choice.id}
          className="game-session-choice"
          disabled={disabled}
          number={index + 1}
          selected={selectedChoiceId === choice.id}
          onClick={() => onChoose(choice)}
        >
          <span className="game-session-choice__text">{choice.text}</span>
          {choice.riskLevel ? (
            <span className="game-session-risk" data-risk={choice.riskLevel}>
              {riskLabel[choice.riskLevel]}
            </span>
          ) : null}
        </DialogueChoice>
      ))}
    </DialogueChoiceGroup>
  )
}
