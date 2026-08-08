import { cn } from '@/lib/utils'

import type { HTMLAttributes, ReactNode } from 'react'

import './game-top-bar.css'

export interface GameTopBarProps extends HTMLAttributes<HTMLElement> {
  start: ReactNode
  center?: ReactNode
  end?: ReactNode
  label?: string
  variant?: 'default' | 'transparent'
}

export function GameTopBar({
  center,
  className = '',
  end,
  label = 'Main navigation',
  start,
  variant = 'default',
  ...props
}: GameTopBarProps) {
  return (
    <header
      aria-label={label}
      className={cn('game-top-bar', `game-top-bar--${variant}`, className)}
      {...props}
    >
      <div className="game-top-bar__start">{start}</div>
      {center ? <div className="game-top-bar__center">{center}</div> : null}
      {end ? <div className="game-top-bar__end">{end}</div> : null}
    </header>
  )
}
