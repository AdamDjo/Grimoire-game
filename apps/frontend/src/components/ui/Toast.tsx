'use client'

import { useEffect, useRef, useState } from 'react'

interface ToastProps {
  message: string
  duration?: number
  onDismiss: () => void
}

export function Toast({ message, duration = 3000, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Trigger enter animation
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
      className={[
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]',
        'bg-[var(--bg-3)] border border-[var(--ember-deep)] text-[var(--ink)]',
        'px-5 py-3 rounded-xl text-sm font-ui shadow-2xl',
        'transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      ].join(' ')}
    >
      {message}
    </div>
  )
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

interface ToastState {
  id: number
  message: string
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([])
  const counter = useRef(0)

  const toast = (message: string) => {
    const id = ++counter.current
    setToasts((prev) => [...prev, { id, message }])
  }

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, toast, dismiss }
}
