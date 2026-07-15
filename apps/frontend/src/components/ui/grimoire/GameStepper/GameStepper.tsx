'use client'

import { cn } from '@/lib/utils'

import type { ReactNode } from 'react'

import './game-stepper.css'

export interface GameStepperItem {
  id: string
  label: string
  icon?: ReactNode
  disabled?: boolean
}

export interface GameStepperProps {
  items: GameStepperItem[]
  currentId: string
  completedIds?: string[]
  orientation?: 'horizontal' | 'vertical' | 'responsive'
  onStepChange?: (id: string) => void
  className?: string
  ariaLabel?: string
  variant?: 'default' | 'character'
}

export function GameStepper({
  ariaLabel = 'Progression',
  className,
  completedIds = [],
  currentId,
  items,
  onStepChange,
  orientation = 'responsive',
  variant = 'default',
}: GameStepperProps) {
  const completed = new Set(completedIds)

  return (
    <nav
      className={cn(
        'game-stepper',
        `game-stepper--${orientation}`,
        `game-stepper--${variant}`,
        className
      )}
      aria-label={ariaLabel}
    >
      <ol className="game-stepper__list">
        {items.map((item) => {
          const isActive = item.id === currentId
          const isCompleted = completed.has(item.id)
          const state = isActive ? 'active' : isCompleted ? 'completed' : 'inactive'

          return (
            <li className={cn('game-stepper__item', `game-stepper__item--${state}`)} key={item.id}>
              <button
                type="button"
                className="game-stepper__button"
                aria-current={isActive ? 'step' : undefined}
                disabled={item.disabled}
                onClick={() => onStepChange?.(item.id)}
              >
                <span className="game-stepper__frame" aria-hidden="true">
                  <span className="game-stepper__glyph">{item.icon}</span>
                </span>
                <span className="game-stepper__label">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
