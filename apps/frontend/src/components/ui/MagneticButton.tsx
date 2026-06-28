'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  /** Force d'attraction max (px). Défaut 6, monter à 10 pour CTAs énormes. */
  strength?: number
  /** Active le pulse doré continu (glow-pulse). */
  pulse?: boolean
  className?: string
}

/**
 * MagneticButton — wrapper qui rend les enfants "magnétiques" au curseur.
 *
 * - Suit la souris ±strength px (lerp 0.15, rAF).
 * - `:active scale(0.96)` via state press.
 * - Pulse doré optionnel (`box-shadow` animé via keyframe `glow-pulse`).
 * - Désactivé en `prefers-reduced-motion` et sur écrans tactiles (no hover).
 * - Wrap de Button — n'altère pas son DOM ni ses ARIA.
 */
export function MagneticButton({
  children,
  strength = 6,
  pulse = false,
  className,
}: MagneticButtonProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setEnabled(!reduce && fineHover)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const el = wrapperRef.current
    if (!el) return

    const tick = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.15
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.15
      const tx = currentRef.current.x.toFixed(2)
      const ty = currentRef.current.y.toFixed(2)
      const scale = pressed ? 0.96 : 1
      el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`
      rafRef.current = requestAnimationFrame(tick)
    }

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // Normalisation : on amortit la distance par la moitié de la largeur du wrapper.
      const dx = ((e.clientX - cx) / (rect.width / 2)) * strength
      const dy = ((e.clientY - cy) / (rect.height / 2)) * strength
      targetRef.current.x = Math.max(-strength, Math.min(strength, dx))
      targetRef.current.y = Math.max(-strength, Math.min(strength, dy))
    }

    const onLeave = () => {
      targetRef.current.x = 0
      targetRef.current.y = 0
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [enabled, pressed, strength])

  return (
    <div
      ref={wrapperRef}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className={[
        'inline-block will-change-transform',
        pulse ? 'rounded-[var(--radius)] motion-safe:animate-glow-pulse' : '',
        className ?? '',
      ].join(' ')}
      style={{ transition: enabled ? 'transform 0s' : 'transform 0.3s ease-out' }}
    >
      {children}
    </div>
  )
}
