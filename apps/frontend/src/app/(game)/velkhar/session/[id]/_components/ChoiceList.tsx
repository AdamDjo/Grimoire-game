import type { Choice } from '@grimoire/shared'

interface ChoiceListProps {
  choices: Choice[]
  disabled: boolean
  onChoose: (choice: Choice) => void
}

/** Provisional choice list: one button per Game Master choice. */
export function ChoiceList({ choices, disabled, onChoose }: ChoiceListProps) {
  return (
    <ul className="gs-choices" aria-label="Choices">
      {choices.map((choice) => (
        <li key={choice.id}>
          <button
            type="button"
            className="gs-choice"
            disabled={disabled}
            onClick={() => onChoose(choice)}
          >
            <span>{choice.text}</span>
            {choice.riskLevel ? (
              <span className="gs-risk" data-risk={choice.riskLevel}>
                {choice.riskLevel}
              </span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  )
}
