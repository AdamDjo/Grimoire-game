'use client'

import { GameButton } from '../GameButton/GameButton'
import { GamePanel } from '../GamePanel/GamePanel'

import type { ReactNode } from 'react'

import './vocation-card.css'

export interface VocationCardProps {
  id: string
  title: string
  description: string
  illustration?: ReactNode
  selected?: boolean
  disabled?: boolean
  actionLabel?: string
  onSelect?: (id: string) => void
  className?: string
}

export function VocationCard({
  actionLabel = 'Choisir',
  className = '',
  description,
  disabled = false,
  id,
  illustration,
  onSelect,
  selected = false,
  title,
}: VocationCardProps) {
  return (
    <GamePanel
      as="article"
      variant="compact"
      tone={selected ? 'gold' : 'neutral'}
      padding="sm"
      interactive={!disabled}
      className={`vocation-card ${selected ? 'vocation-card--selected' : ''} ${className}`}
      aria-disabled={disabled || undefined}
    >
      {illustration ? <div className="vocation-card__illustration">{illustration}</div> : null}
      <div className="vocation-card__body">
        <h3 className="vocation-card__title">{title}</h3>
        <p className="vocation-card__description">{description}</p>
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
