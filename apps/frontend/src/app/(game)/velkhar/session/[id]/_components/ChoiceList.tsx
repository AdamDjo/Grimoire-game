import {
  DialogueChoice,
  DialogueChoiceGroup,
  GameIcon,
  type GameIconName,
} from '@/components/ui/grimoire'

import type { Choice } from '@grimoire/shared'

interface ChoiceListProps {
  choices: Choice[]
  disabled: boolean
  selectedChoiceId?: string | null
  onChoose: (choice: Choice) => void
}

const CHOICE_ICON: Record<Choice['type'], GameIconName> = {
  action: 'compass',
  combat: 'crossed-swords',
  dialog: 'dialogue',
  flee: 'footprint',
  skill: 'eye',
  use_item: 'potion',
}

const RISK_LABEL: NonNullable<Record<NonNullable<Choice['riskLevel']>, string>> = {
  safe: 'Safe',
  low: 'Low risk',
  medium: 'Risky',
  high: 'High risk',
  deadly: 'Deadly',
}

/** Game Master choices, rendered as immediate and readable player intentions. */
export function ChoiceList({
  choices,
  disabled,
  onChoose,
  selectedChoiceId = null,
}: ChoiceListProps) {
  return (
    <DialogueChoiceGroup className="gs-choices" label="Available actions">
      {choices.map((choice) => (
        <DialogueChoice
          key={choice.id}
          className="gs-choice"
          disabled={disabled}
          icon={<GameIcon decorative name={CHOICE_ICON[choice.type]} size={32} />}
          selected={selectedChoiceId === choice.id}
          onClick={() => onChoose(choice)}
        >
          <span className="gs-choice__text">{choice.text}</span>
          {choice.riskLevel ? (
            <span className="gs-risk" data-risk={choice.riskLevel}>
              {RISK_LABEL[choice.riskLevel]}
            </span>
          ) : null}
        </DialogueChoice>
      ))}
    </DialogueChoiceGroup>
  )
}
