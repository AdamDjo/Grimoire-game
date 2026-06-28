'use client'

import { useEffect, useRef } from 'react'

interface UseMouseParallaxOptions {
  /** Élément racine où écouter la souris. Défaut : window. */
  containerRef?: React.RefObject<HTMLElement | null>
  /** Coefficient de lissage 0–1 (0.1 = doux). Défaut 0.08. */
  lerp?: number
  /** Désactive sous certains seuils. */
  disabled?: boolean
}

/**
 * useMouseParallax — expose la position souris normalisée (-1..1) via
 * deux CSS variables `--mx` et `--my` sur l'élément ref retourné.
 *
 * Permet ensuite d'utiliser `transform: translate3d(calc(var(--mx) * Xpx), calc(var(--my) * Ypx), 0)`
 * sur N enfants avec des coefficients différents → effet parallax sans
 * JS par couche.
 *
 * Respect : pointer-coarse (mobile/tablette tactile) → no-op.
 *           prefers-reduced-motion → no-op.
 *
 * Perf : un seul rAF, lerp partagé, écriture batchée des deux CSS vars.
 */
export function useMouseParallax({
  containerRef,
  lerp = 0.08,
  disabled = false,
}: UseMouseParallaxOptions = {}) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disabled) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduce || coarse) return

    const target = rootRef.current
    if (!target) return

    const source = containerRef?.current ?? window

    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let rafId = 0
    let mounted = true

    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth
      const h = window.innerHeight
      tx = (e.clientX / w) * 2 - 1
      ty = (e.clientY / h) * 2 - 1
    }

    const tick = () => {
      if (!mounted) return
      cx += (tx - cx) * lerp
      cy += (ty - cy) * lerp
      target.style.setProperty('--mx', cx.toFixed(3))
      target.style.setProperty('--my', cy.toFixed(3))
      rafId = requestAnimationFrame(tick)
    }

    source.addEventListener('mousemove', onMove as EventListener, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      mounted = false
      cancelAnimationFrame(rafId)
      source.removeEventListener('mousemove', onMove as EventListener)
    }
  }, [containerRef, lerp, disabled])

  return rootRef
}
