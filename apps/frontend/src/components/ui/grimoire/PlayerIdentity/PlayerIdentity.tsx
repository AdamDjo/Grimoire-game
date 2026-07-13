import type { ReactNode } from 'react'

import './player-identity.css'

export interface PlayerIdentityProps {
  name: string
  subtitle?: string
  avatar?: ReactNode
  resources?: ReactNode
  compact?: boolean
  className?: string
}

export function PlayerIdentity({
  avatar,
  className = '',
  compact = false,
  name,
  resources,
  subtitle,
}: PlayerIdentityProps) {
  return (
    <section
      aria-label={`Personnage : ${name}`}
      className={`player-identity ${compact ? 'player-identity--compact' : ''} ${className}`}
    >
      {avatar ? <div className="player-identity__avatar">{avatar}</div> : null}
      <div className="player-identity__copy">
        <strong>{name}</strong>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>
      {resources ? <div className="player-identity__resources">{resources}</div> : null}
    </section>
  )
}
