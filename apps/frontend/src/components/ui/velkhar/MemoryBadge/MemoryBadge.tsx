import type { ReactNode } from 'react'

import './memory-badge.css'

export interface MemoryBadgeProps {
  title: string
  visual: ReactNode
  selected?: boolean
  className?: string
}

export function MemoryBadge({ className = '', selected = false, title, visual }: MemoryBadgeProps) {
  return (
    <figure className={`memory-badge ${selected ? 'memory-badge--selected' : ''} ${className}`}>
      <div className="memory-badge__visual">{visual}</div>
      <figcaption>{title}</figcaption>
    </figure>
  )
}
