'use client'

import { useEffect, useState } from 'react'

/**
 * IntroLoader — overlay noir initial qui se dissipe au mount.
 *
 * Donne le sentiment d'entrer dans une expérience plutôt que de charger
 * une page. Mot "Grimoire" centré en Cinzel doré, fade-out 0.9s puis
 * `visibility: hidden` pour ne plus bloquer les clics. Démontable du DOM
 * après la transition pour libérer le z-index. Respecte prefers-reduced-motion
 * (skip total, jamais affiché).
 */
export function IntroLoader() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mql.matches) {
      setReducedMotion(true)
      return
    }
    // Démontage du DOM ~150ms après la fin de l'animation (0.9s).
    const t = window.setTimeout(() => setDone(true), 1100)
    return () => window.clearTimeout(t)
  }, [])

  if (reducedMotion || done) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] animate-intro-fade"
    >
      <span className="text-gradient-gold font-display text-2xl uppercase tracking-[0.4em] sm:text-3xl">
        Grimoire
      </span>
    </div>
  )
}
