import type { HTMLAttributes } from 'react'

import './narrative-passage.css'

export interface NarrativePassageProps extends HTMLAttributes<HTMLDivElement> {
  dropCap?: boolean
  align?: 'left' | 'center'
}

export function NarrativePassage({
  align = 'left',
  children,
  className = '',
  dropCap = false,
  ...props
}: NarrativePassageProps) {
  return (
    <div
      className={`narrative-passage narrative-passage--${align} ${dropCap ? 'narrative-passage--drop-cap' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
