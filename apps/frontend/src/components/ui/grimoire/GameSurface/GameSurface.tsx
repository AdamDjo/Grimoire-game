import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

import type { HTMLAttributes } from 'react'

import './game-surface.css'

export type GameSurfaceVariant = 'card' | 'stats' | 'parchment'
export type GameSurfaceElement = 'section' | 'article' | 'div' | 'aside'
export type GameSurfacePadding = 'none' | 'sm' | 'md' | 'lg'

export interface GameSurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: GameSurfaceElement
  variant?: GameSurfaceVariant
  padding?: GameSurfacePadding
}

export const GameSurface = forwardRef<HTMLElement, GameSurfaceProps>(function GameSurface(
  { as: Component = 'section', children, className, padding = 'md', variant = 'card', ...props },
  ref
) {
  return (
    <Component
      ref={ref as never}
      className={cn(
        'game-surface',
        `game-surface--${variant}`,
        `game-surface--padding-${padding}`,
        className
      )}
      {...props}
    >
      <div className="game-surface__content">{children}</div>
    </Component>
  )
})

GameSurface.displayName = 'GameSurface'
