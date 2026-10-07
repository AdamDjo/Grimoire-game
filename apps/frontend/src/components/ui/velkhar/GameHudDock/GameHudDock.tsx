import type { HTMLAttributes } from 'react'

import './game-hud-dock.css'

export interface GameHudDockProps extends HTMLAttributes<HTMLElement> {
  label?: string
}

export function GameHudDock({
  children,
  className = '',
  label = 'État du personnage',
  ...props
}: GameHudDockProps) {
  return (
    <aside aria-label={label} className={`game-hud-dock ${className}`} {...props}>
      <div className="game-hud-dock__content">{children}</div>
    </aside>
  )
}
