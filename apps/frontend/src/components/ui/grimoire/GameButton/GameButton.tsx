import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

import './game-button.css'

export type GameButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'icon'
  | 'cinematic'
  | 'radiant'
  | 'landing'
  | 'landing-ghost'
  | 'landing-gameplay'
export type GameButtonTone = 'gold' | 'blood' | 'soul' | 'cendre'
export type GameButtonSize = 'sm' | 'md' | 'lg'

export interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GameButtonVariant
  tone?: GameButtonTone
  size?: GameButtonSize
  loading?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  static?: boolean
}

export const GameButton = forwardRef<HTMLButtonElement, GameButtonProps>(function GameButton(
  {
    children,
    className,
    disabled = false,
    leadingIcon,
    loading = false,
    size = 'md',
    static: isStatic = false,
    tone = 'gold',
    trailingIcon,
    type = 'button',
    variant = 'primary',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'game-button',
        `game-button--${variant}`,
        `game-button--${tone}`,
        `game-button--${size}`,
        isStatic && 'game-button--static',
        className
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="game-button__spinner" aria-hidden="true" /> : null}
      {!loading && leadingIcon ? (
        <span className="game-button__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <span className="game-button__label">{children}</span>
      {!loading && trailingIcon ? (
        <span className="game-button__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  )
})

GameButton.displayName = 'GameButton'
