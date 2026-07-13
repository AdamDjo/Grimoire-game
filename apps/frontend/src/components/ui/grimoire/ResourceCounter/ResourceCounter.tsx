import type { ReactNode } from 'react'

import './resource-counter.css'

export interface ResourceCounterProps {
  label: string
  value: number | string
  icon?: ReactNode
  compact?: boolean
  className?: string
}

export function ResourceCounter({
  className = '',
  compact = false,
  icon,
  label,
  value,
}: ResourceCounterProps) {
  return (
    <div
      aria-label={`${label} : ${value}`}
      className={`resource-counter ${compact ? 'resource-counter--compact' : ''} ${className}`}
    >
      {icon ? (
        <span className="resource-counter__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="resource-counter__value">{value}</span>
      {!compact ? <span className="resource-counter__label">{label}</span> : null}
    </div>
  )
}
