'use client'

import { useEffect, useRef, useState } from 'react'

type ToastVariant = 'default' | 'success' | 'danger'

interface ToastProps {
  message: string
  duration?: number
  variant?: ToastVariant
  onDismiss: () => void
}

const VARIANT_BORDER: Record<ToastVariant, string> = {
  default: 'var(--gold)',
  success: '#8fb84a',
  danger: 'var(--ruby)',
}

export function Toast({ message, duration = 3000, variant = 'default', onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    timerRef.current = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, duration)
    return () => {
      cancelAnimationFrame(raf)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [duration, onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '16px'})`,
        zIndex: 60,
        border: `1px solid ${VARIANT_BORDER[variant]}`,
        borderRadius: 'var(--radius)',
        background: 'linear-gradient(160deg, #211b14, #16110b)',
        boxShadow: `0 8px 32px rgba(0,0,0,.6), 0 0 20px ${VARIANT_BORDER[variant]}40`,
        padding: '14px 20px',
        fontFamily: 'var(--font-serif)',
        fontSize: '16px',
        color: 'var(--ink)',
        opacity: visible ? 1 : 0,
        transition: 'opacity .3s, transform .3s',
        whiteSpace: 'nowrap',
      }}
    >
      {message}
    </div>
  )
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

interface ToastState {
  id: number
  message: string
  variant?: ToastVariant
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([])
  const counter = useRef(0)

  const toast = (message: string, variant: ToastVariant = 'default') => {
    const id = ++counter.current
    setToasts((prev) => [...prev, { id, message, variant }])
  }

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, toast, dismiss }
}
