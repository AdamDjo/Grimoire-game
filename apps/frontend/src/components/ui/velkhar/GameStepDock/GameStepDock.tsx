import type { HTMLAttributes, ReactNode } from 'react'

import './game-step-dock.css'

export interface GameStepDockProps extends HTMLAttributes<HTMLElement> {
  label?: string
  actions?: ReactNode
}

export function GameStepDock({
  actions,
  children,
  className = '',
  label = 'Étapes du parcours',
  ...props
}: GameStepDockProps) {
  return (
    <nav aria-label={label} className={`game-step-dock ${className}`} {...props}>
      <div className="game-step-dock__steps">{children}</div>
      {actions ? <div className="game-step-dock__actions">{actions}</div> : null}
    </nav>
  )
}
