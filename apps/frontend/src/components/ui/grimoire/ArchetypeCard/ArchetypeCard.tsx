'use client'

import { GameButton } from '../GameButton/GameButton'
import { GamePanel } from '../GamePanel/GamePanel'

import type { ReactNode } from 'react'

import './archetype-card.css'

export interface ArchetypeCardProps {
  id: string
  title: string
  description: string
  eyebrow?: string
  illustration?: ReactNode
  selected?: boolean
  disabled?: boolean
  actionLabel?: string
  onSelect?: (id: string) => void
  onPreview?: (id: string) => void
  onPreviewEnd?: () => void
  className?: string
}

export function ArchetypeCard({
  actionLabel = 'Choisir',
  className = '',
  description,
  disabled = false,
  eyebrow,
  id,
  illustration,
  onPreview,
  onPreviewEnd,
  onSelect,
  selected = false,
  title,
}: ArchetypeCardProps) {
  return (
    <GamePanel
      as="article"
      variant="compact"
      tone={selected ? 'gold' : 'neutral'}
      padding="sm"
      interactive={!disabled}
      className={`archetype-card ${selected ? 'archetype-card--selected' : ''} ${className}`}
      aria-disabled={disabled || undefined}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget
        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
          onPreviewEnd?.()
        }
      }}
      onFocus={() => onPreview?.(id)}
      onMouseEnter={() => onPreview?.(id)}
      onMouseLeave={onPreviewEnd}
    >
      {illustration ? <div className="archetype-card__illustration">{illustration}</div> : null}
      <div className="archetype-card__body">
        {eyebrow ? <span className="archetype-card__eyebrow">{eyebrow}</span> : null}
        <h3 className="archetype-card__title">{title}</h3>
        <p className="archetype-card__description">{description}</p>
      </div>
      <GameButton
        variant={selected ? 'primary' : 'secondary'}
        size="sm"
        disabled={disabled}
        onClick={() => onSelect?.(id)}
        aria-pressed={selected}
      >
        {selected ? 'Sélectionnée' : actionLabel}
      </GameButton>
    </GamePanel>
  )
}
