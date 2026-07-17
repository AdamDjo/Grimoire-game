'use client'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

import { GameButton } from '../GameButton/GameButton'

import type { ReactNode } from 'react'

import './game-window.css'

export interface GameWindowProps {
  children: ReactNode
  className?: string
  label: string
  onClose: () => void
  title: ReactNode
}

/**
 * Accessible world-agnostic overlay window.
 * Worlds customize its frame through class names and CSS variables.
 */
export function GameWindow({ children, className, label, onClose, title }: GameWindowProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      )
      if (focusableElements.length === 0) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.documentElement.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <div className={cn('game-window-layer', className)}>
      <button
        aria-label="Dismiss panel"
        aria-hidden="true"
        className="game-window-layer__backdrop"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <section
        ref={dialogRef}
        aria-label={label}
        aria-modal="true"
        className="game-window"
        role="dialog"
        tabIndex={-1}
      >
        <div className="game-window__header">
          <h2>{title}</h2>
          <GameButton
            ref={closeRef}
            aria-label="Close panel"
            onClick={onClose}
            size="sm"
            variant="icon"
          >
            ×
          </GameButton>
        </div>
        <div className="game-window__content">{children}</div>
      </section>
    </div>
  )
}
