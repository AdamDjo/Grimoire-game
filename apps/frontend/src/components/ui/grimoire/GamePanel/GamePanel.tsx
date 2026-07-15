import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

import type { HTMLAttributes, ReactNode } from 'react'

import './game-panel.css'

export type GamePanelElement = 'section' | 'article' | 'div' | 'aside'
export type GamePanelVariant =
  | 'main'
  | 'sidebar'
  | 'compact'
  | 'header'
  | 'footer'
  | 'character-form'
  | 'character-aside'
  | 'character-form-v2'
  | 'character-aside-v2'
export type GamePanelTone = 'neutral' | 'gold' | 'blood' | 'soul' | 'cendre'
export type GamePanelPadding = 'none' | 'sm' | 'md' | 'lg'

export interface GamePanelProps extends HTMLAttributes<HTMLElement> {
  as?: GamePanelElement
  variant?: GamePanelVariant
  tone?: GamePanelTone
  ornament?: 'none' | 'diamond'
  padding?: GamePanelPadding
  interactive?: boolean
  ornamentSlot?: ReactNode
}

export const GamePanel = forwardRef<HTMLElement, GamePanelProps>(function GamePanel(
  {
    as: Component = 'section',
    children,
    className,
    interactive = false,
    ornament = 'none',
    ornamentSlot,
    padding = 'md',
    tone = 'neutral',
    variant = 'main',
    ...props
  },
  ref
) {
  return (
    <Component
      ref={ref as never}
      className={cn(
        'game-panel',
        `game-panel--${variant}`,
        `game-panel--${tone}`,
        `game-panel--padding-${padding}`,
        ornament === 'diamond' && 'game-panel--ornament-integrated',
        interactive && 'game-panel--interactive',
        className
      )}
      {...props}
    >
      {ornamentSlot ? (
        <span className="game-panel__ornament game-panel__ornament--custom" aria-hidden="true">
          {ornamentSlot}
        </span>
      ) : null}
      <div className="game-panel__content">{children}</div>
    </Component>
  )
})

GamePanel.displayName = 'GamePanel'
