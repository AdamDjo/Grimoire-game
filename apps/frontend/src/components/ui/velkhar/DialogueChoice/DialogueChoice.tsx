'use client'

import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

import './dialogue-choice.css'

export interface DialogueChoiceProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  number?: number
  selected?: boolean
}

export const DialogueChoice = forwardRef<HTMLButtonElement, DialogueChoiceProps>(
  function DialogueChoice(
    {
      children,
      className,
      disabled = false,
      icon,
      number,
      selected = false,
      type = 'button',
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        aria-pressed={selected}
        className={cn('dialogue-choice', selected && 'dialogue-choice--selected', className)}
        disabled={disabled}
        type={type}
        {...props}
      >
        {number !== undefined ? (
          <span className="dialogue-choice__number" aria-hidden="true">
            {number}
          </span>
        ) : null}
        {icon ? <span className="dialogue-choice__icon">{icon}</span> : null}
        <span className="dialogue-choice__label">{children}</span>
      </button>
    )
  }
)

DialogueChoice.displayName = 'DialogueChoice'
