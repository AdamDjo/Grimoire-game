'use client'

import { type ReactNode, useEffect, useRef } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'oklch(0 0 0 / .65)' }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className="relative w-full max-w-lg bg-[var(--bg-2)] border border-[var(--line)] rounded-[var(--radius)] shadow-2xl animate-rise">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
          {title && (
            <h2 className="font-disp text-[var(--ember)] text-base uppercase tracking-widest">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="ml-auto text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors duration-150 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
