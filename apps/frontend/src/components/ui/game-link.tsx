import Link from 'next/link'

import { cn } from '@/lib/utils'

import type {
  GameButtonSize,
  GameButtonTone,
  GameButtonVariant,
} from './grimoire/GameButton/GameButton'
import type { ComponentProps, ReactNode } from 'react'

import './grimoire/GameButton/game-button.css'

export interface GameLinkProps extends Omit<ComponentProps<typeof Link>, 'children'> {
  children: ReactNode
  leadingIcon?: ReactNode
  size?: GameButtonSize
  tone?: GameButtonTone
  trailingIcon?: ReactNode
  variant?: GameButtonVariant
}

export function GameLink({
  children,
  className,
  leadingIcon,
  size = 'md',
  tone = 'gold',
  trailingIcon,
  variant = 'primary',
  ...props
}: GameLinkProps) {
  return (
    <Link
      className={cn(
        'game-button',
        `game-button--${variant}`,
        `game-button--${tone}`,
        `game-button--${size}`,
        className
      )}
      {...props}
    >
      {leadingIcon ? (
        <span className="game-button__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <span className="game-button__label">{children}</span>
      {trailingIcon ? (
        <span className="game-button__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </Link>
  )
}
