import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

import type { InputHTMLAttributes, ReactNode } from 'react'

import './game-input.css'

export interface GameInputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: ReactNode
  trailingAction?: ReactNode
  invalid?: boolean
  inputClassName?: string
  variant?: 'default' | 'framed' | 'framed-v2'
}

export const GameInput = forwardRef<HTMLInputElement, GameInputProps>(function GameInput(
  {
    'aria-invalid': ariaInvalid,
    className,
    disabled = false,
    inputClassName,
    invalid = false,
    leadingIcon,
    trailingAction,
    variant = 'default',
    ...props
  },
  ref
) {
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true'

  return (
    <span
      className={cn(
        'game-input',
        `game-input--${variant}`,
        leadingIcon && 'game-input--with-leading',
        trailingAction && 'game-input--with-trailing',
        isInvalid && 'game-input--invalid',
        disabled && 'game-input--disabled',
        className
      )}
    >
      {leadingIcon ? (
        <span className="game-input__leading" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <input
        ref={ref}
        className={cn('game-input__control', inputClassName)}
        disabled={disabled}
        aria-invalid={isInvalid || undefined}
        {...props}
      />
      {trailingAction ? <span className="game-input__trailing">{trailingAction}</span> : null}
    </span>
  )
})

GameInput.displayName = 'GameInput'
