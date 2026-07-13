'use client'

import { forwardRef } from 'react'

import { GameButton } from '../GameButton/GameButton'
import { GameIcon } from '../GameIcon/GameIcon'
import { GameTextarea } from '../GameTextarea/GameTextarea'

import type { GameTextareaProps } from '../GameTextarea/GameTextarea'

import './narrative-composer.css'

export interface NarrativeComposerProps extends GameTextareaProps {
  actionLabel?: string
  onAction?: () => void
  actionDisabled?: boolean
}

export const NarrativeComposer = forwardRef<HTMLTextAreaElement, NarrativeComposerProps>(
  function NarrativeComposer(
    {
      actionDisabled = false,
      actionLabel = 'Agir',
      className = '',
      onAction,
      placeholder = 'Autre action — décris ce que tu veux faire…',
      ...props
    },
    ref
  ) {
    return (
      <div className={`narrative-composer ${className}`}>
        <span className="narrative-composer__icon" aria-hidden="true">
          <GameIcon decorative name="quill" size={32} />
        </span>
        <GameTextarea
          ref={ref}
          className="narrative-composer__control"
          placeholder={placeholder}
          {...props}
        />
        <GameButton
          aria-label={actionLabel}
          className="narrative-composer__action"
          disabled={actionDisabled}
          onClick={onAction}
          size="sm"
          variant="icon"
        >
          <GameIcon decorative name="arrow" size={24} />
        </GameButton>
      </div>
    )
  }
)

NarrativeComposer.displayName = 'NarrativeComposer'
