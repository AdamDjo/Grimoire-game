import type { ReactNode } from 'react'

import './location-identity.css'

export interface LocationIdentityProps {
  world: string
  place: string
  icon?: ReactNode
  className?: string
}

export function LocationIdentity({ className = '', icon, place, world }: LocationIdentityProps) {
  return (
    <div aria-label={`${world}, ${place}`} className={`location-identity ${className}`}>
      {icon ? (
        <span className="location-identity__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span>{world}</span>
      <i aria-hidden="true">·</i>
      <strong>{place}</strong>
    </div>
  )
}
