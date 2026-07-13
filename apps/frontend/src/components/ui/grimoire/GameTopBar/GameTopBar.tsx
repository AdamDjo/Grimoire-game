import type { HTMLAttributes, ReactNode } from 'react'

import './game-top-bar.css'

export interface GameTopBarProps extends HTMLAttributes<HTMLElement> {
  start: ReactNode
  center?: ReactNode
  end?: ReactNode
  label?: string
}

export function GameTopBar({
  center,
  className = '',
  end,
  label = 'Navigation principale',
  start,
  ...props
}: GameTopBarProps) {
  return (
    <header aria-label={label} className={`game-top-bar ${className}`} {...props}>
      <div className="game-top-bar__start">{start}</div>
      {center ? <div className="game-top-bar__center">{center}</div> : null}
      {end ? <div className="game-top-bar__end">{end}</div> : null}
    </header>
  )
}
