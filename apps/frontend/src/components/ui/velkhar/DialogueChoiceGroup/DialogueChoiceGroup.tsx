import type { HTMLAttributes, ReactNode } from 'react'

import './dialogue-choice-group.css'

export interface DialogueChoiceGroupProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  children: ReactNode
}

export function DialogueChoiceGroup({
  children,
  className = '',
  label,
  ...props
}: DialogueChoiceGroupProps) {
  return (
    <div
      aria-label={label}
      className={`dialogue-choice-group ${className}`}
      role="group"
      {...props}
    >
      {children}
    </div>
  )
}
