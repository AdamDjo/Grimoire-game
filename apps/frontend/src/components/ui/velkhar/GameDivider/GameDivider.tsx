import { cn } from '@/lib/utils'

import type { HTMLAttributes } from 'react'

import './game-divider.css'

export type GameDividerOrientation = 'horizontal' | 'vertical'
export type GameDividerVariant = 'simple' | 'diamond' | 'ornate' | 'celestial' | 'auberge'
export type GameDividerSize = 'sm' | 'md' | 'lg'

export interface GameDividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: GameDividerOrientation
  variant?: GameDividerVariant
  size?: GameDividerSize
}

export function GameDivider({
  className,
  orientation = 'horizontal',
  size = 'md',
  variant = 'diamond',
  ...props
}: GameDividerProps) {
  return (
    <div
      className={cn(
        'game-divider',
        `game-divider--${orientation}`,
        `game-divider--${variant}`,
        `game-divider--${size}`,
        className
      )}
      role="separator"
      aria-orientation={orientation}
      {...props}
    >
      <span className="game-divider__line" aria-hidden="true" />
      <span className="game-divider__ornament" aria-hidden="true" />
      <span className="game-divider__line" aria-hidden="true" />
    </div>
  )
}
