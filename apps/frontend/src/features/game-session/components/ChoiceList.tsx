import { useTranslations } from 'next-intl'

import { DialogueChoice } from '@/components/ui/grimoire/DialogueChoice/DialogueChoice'
import { DialogueChoiceGroup } from '@/components/ui/grimoire/DialogueChoiceGroup/DialogueChoiceGroup'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'

import type { GameSessionChoice } from '../model/game-session.types'
import type { GameIconName } from '@/components/ui/grimoire/GameIcon/GameIcon'

interface ChoiceListProps {
  choices: GameSessionChoice[]
  disabled: boolean
  selectedChoiceId?: string | null
  onChoose: (choice: GameSessionChoice) => void
}

const CHOICE_ICON: Record<GameSessionChoice['type'], GameIconName> = {
  action: 'compass',
  combat: 'crossed-swords',
  dialog: 'dialogue',
  flee: 'footprint',
  skill: 'eye',
  use_item: 'potion',
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
      {choices.map((choice) => (
        <DialogueChoice
          key={choice.id}
          className="game-session-choice"
          disabled={disabled}
          icon={<GameIcon decorative name={CHOICE_ICON[choice.type]} size={32} />}
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
