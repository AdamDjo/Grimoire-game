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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.75)',
      }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div
        className="animate-rise"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          background: 'linear-gradient(160deg, #211b14, #16110b)',
          boxShadow: '0 24px 64px rgba(0,0,0,.7)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {title && (
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-disp)',
                fontSize: '13px',
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}
            >
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              marginLeft: 'auto',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              color: 'var(--ink-3)',
              fontSize: '18px',
              lineHeight: 1,
              transition: 'color .2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--ink)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--ink-3)'
            }}
          >
            ✕
          </button>
        </div>

        {/* Ornament */}
        <div style={{ padding: '0 24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              margin: '0',
            }}
          >
            <span
              style={{
                flex: '0 1 120px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--gold-dark))',
              }}
            />
            <span
              style={{
                width: '5px',
                height: '5px',
                background: 'var(--gold-dark)',
                transform: 'rotate(45deg)',
              }}
            />
            <span
              style={{
                flex: '0 1 120px',
                height: '1px',
                background: 'linear-gradient(270deg, transparent, var(--gold-dark))',
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px 24px' }}>{children}</div>
      </div>
    </div>
  )
}
