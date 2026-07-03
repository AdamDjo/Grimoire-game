'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

interface UseMagneticHoverOptions {
  ref: RefObject<HTMLElement | null>
  /** Force max en px. */
  strength?: number
  /** Lerp (0-1) : plus haut = plus réactif. */
  lerp?: number
}

/**
 * useMagneticHover — rend un élément magnétique au curseur.
 *
 * Extrait de MagneticButton pour réutilisation sur n'importe quel élément
 * (CTA final, icônes, etc.). Skip auto si `prefers-reduced-motion` ou
 * device tactile sans hover fin.
 *
 * Applique directement `transform` sur `ref.current.style`. Ne s'occupe pas
 * du `scale(press)` — laisser ça au composant qui gère le state pressed.
 */
export function useMagneticHover({ ref, strength = 6, lerp = 0.15 }: UseMagneticHoverOptions) {
  const [enabled, setEnabled] = useState(false)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setEnabled(!reduce && fineHover)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * lerp
      current.current.y += (target.current.y - current.current.y) * lerp
      el.style.transform = `translate(${current.current.x.toFixed(2)}px, ${current.current.y.toFixed(2)}px)`
      raf.current = requestAnimationFrame(tick)
    }

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = ((e.clientX - cx) / (rect.width / 2)) * strength
      const dy = ((e.clientY - cy) / (rect.height / 2)) * strength
      target.current.x = Math.max(-strength, Math.min(strength, dx))
      target.current.y = Math.max(-strength, Math.min(strength, dy))
    }

    const onLeave = () => {
      target.current.x = 0
      target.current.y = 0
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    raf.current = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [enabled, lerp, ref, strength])

  return { enabled }
}
