import { GameDivider } from '../GameDivider/GameDivider'
import { GameOrnament } from '../GameOrnament/GameOrnament'

import type { HTMLAttributes } from 'react'

import './game-section-heading.css'

export interface GameSectionHeadingProps extends HTMLAttributes<HTMLElement> {
  title: string
  eyebrow?: string
  description?: string
  ornament?: 'none' | 'watcher'
  level?: 1 | 2 | 3
}

export function GameSectionHeading({
  className = '',
  description,
  eyebrow,
  level = 2,
  ornament = 'none',
  title,
  ...props
}: GameSectionHeadingProps) {
  const heading = level === 1 ? <h1>{title}</h1> : level === 2 ? <h2>{title}</h2> : <h3>{title}</h3>

  return (
    <header className={`game-section-heading ${className}`} {...props}>
      {eyebrow ? <p className="game-section-heading__eyebrow">{eyebrow}</p> : null}
      <div className="game-section-heading__title-row">
        <GameDivider size="sm" variant="simple" />
        {heading}
        <GameDivider size="sm" variant="simple" />
      </div>
      {description ? <p className="game-section-heading__description">{description}</p> : null}
      {ornament === 'watcher' ? (
        <GameOrnament
          className="game-section-heading__ornament"
          decorative
          name="watcher"
          size="md"
        />
      ) : null}
    </header>
  )
}
