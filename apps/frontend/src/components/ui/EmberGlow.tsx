'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface EmberGlowProps {
  /** Rayon d'influence en px. Défaut 220. */
  radius?: number
  /** Lerp 0..1. Défaut 0.12. */
  lerp?: number
  /** Children rendus avec le glow appliqué via box-shadow + filter. */
  children: ReactNode
  className?: string
}

/**
 * EmberGlow — wrapper qui s'embrase quand la souris s'approche.
 *
 * Mesure la distance souris ↔ centre de l'enfant à chaque rAF. Écrit une
 * CSS var `--ember` (0 = froid, 1 = embrasé) sur le wrapper. Le rendu
 * applique box-shadow doré + brightness + scale subtil pilotés par cette var.
 *
 * Respect : pointer-coarse / reduced-motion → glow statique faible (var = 0.2).
 */
export function EmberGlow({ radius = 220, lerp = 0.12, children, className }: EmberGlowProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const el = ref.current
    if (!el) return

    if (reduce || coarse) {
      el.style.setProperty('--ember', '0.2')
      return
    }

    let target = 0
    let current = 0
    let rafId = 0
    let mounted = true

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      // Inverse normalisée : proche = 1, loin = 0.
      target = Math.max(0, 1 - dist / radius)
    }

    const tick = () => {
      if (!mounted) return
      current += (target - current) * lerp
      el.style.setProperty('--ember', current.toFixed(3))
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      mounted = false
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
    }
  }, [lerp, radius])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        // Box-shadow qui grandit + s'intensifie avec --ember (0..1).
        borderRadius: 9999,
        boxShadow: `
          0 0 calc(12px + var(--ember, 0) * 28px) calc(2px + var(--ember, 0) * 6px) rgba(224, 196, 137, calc(0.18 + var(--ember, 0) * 0.55)),
          0 0 calc(40px + var(--ember, 0) * 80px) calc(8px + var(--ember, 0) * 18px) rgba(196, 100, 40, calc(0.0 + var(--ember, 0) * 0.35))
        `,
        filter: 'brightness(calc(1 + var(--ember, 0) * 0.18))',
        transition: 'filter 0.4s ease-out',
      }}
    >
      {children}
    </div>
  )
}
