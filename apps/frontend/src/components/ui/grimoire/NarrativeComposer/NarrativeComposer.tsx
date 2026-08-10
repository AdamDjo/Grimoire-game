'use client'

import Image from 'next/image'
import { forwardRef } from 'react'

import { GameButton } from '../GameButton/GameButton'
import { GameTextarea } from '../GameTextarea/GameTextarea'

import type { GameTextareaProps } from '../GameTextarea/GameTextarea'

import './narrative-composer.css'

export interface NarrativeComposerProps extends GameTextareaProps {
  actionLabel?: string
  heading?: string
  onAction?: () => void
  actionDisabled?: boolean
}

export const NarrativeComposer = forwardRef<HTMLTextAreaElement, NarrativeComposerProps>(
  function NarrativeComposer(
    {
      actionDisabled = false,
      actionLabel = 'Agir',
      className = '',
      heading = 'Action libre',
      onAction,
      placeholder = 'Autre action — décris ce que tu veux faire…',
      ...props
    },
    ref
  ) {
    return (
      <div className={`narrative-composer ${className}`}>
        <span className="narrative-composer__icon" aria-hidden="true">
          <Image alt="" height={83} src="/encre-de-sel/icons/action-quill.webp" width={88} />
        </span>
        <div className="narrative-composer__body">
          <span className="narrative-composer__heading">{heading}</span>
          <GameTextarea
            ref={ref}
            className="narrative-composer__control"
            placeholder={placeholder}
            rows={1}
            surface="bare"
            {...props}
          />
        </div>
        <GameButton
          aria-label={actionLabel}
          className="narrative-composer__action"
          disabled={actionDisabled}
          onClick={onAction}
          size="sm"
          variant="icon"
        >
          <Image alt="" fill sizes="82px" src="/encre-de-sel/icons/action-submit-tile.webp" />
        </GameButton>
      </div>
    )
  }
)

NarrativeComposer.displayName = 'NarrativeComposer'
