import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

import type { TextareaHTMLAttributes } from 'react'

import './game-textarea.css'

export interface GameTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const GameTextarea = forwardRef<HTMLTextAreaElement, GameTextareaProps>(
  function GameTextarea(
    { 'aria-invalid': ariaInvalid, className, disabled = false, invalid = false, ...props },
    ref
  ) {
    const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true'

    return (
      <span
        className={cn(
          'game-textarea',
          isInvalid && 'game-textarea--invalid',
          disabled && 'game-textarea--disabled'
        )}
      >
        <textarea
          ref={ref}
          className={cn('game-textarea__control', className)}
          aria-invalid={isInvalid || undefined}
          disabled={disabled}
          {...props}
        />
      </span>
    )
  }
)

GameTextarea.displayName = 'GameTextarea'
