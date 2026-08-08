'use client'

import { useRef } from 'react'

import { ScrollTrigger, gsap, useGSAP } from '@/lib/gsap-init'

import './scroll-progress-bar.css'

interface ScrollProgressBarProps {
  className?: string
}

/**
 * Fine barre dorée fixée en haut de l'écran, remplie de gauche à droite au fil
 * du scroll global (0 → bas de page). Remplace le rôle indicateur de la
 * scrollbar native (masquée en CSS). Un unique ScrollTrigger `end:'max'` pilote
 * le `scaleX` — `max` est recalculé à chaque refresh (après les pin-spacers),
 * donc la barre atteint 1 pile au vrai bas de page.
 */
export function ScrollProgressBar({ className = '' }: ScrollProgressBarProps) {
  const fillRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const fill = fillRef.current
      if (!fill) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap.set(fill, { scaleX: reduceMotion ? 1 : 0, transformOrigin: 'left' })
      if (reduceMotion) return

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        scrub: 0.3,
        onUpdate: (self) => {
          gsap.set(fill, { scaleX: self.progress })
        },
      })
    },
    { scope: fillRef }
  )

  return (
    <div
      className={`scroll-progress-bar fixed inset-x-0 top-0 z-[38] ${className}`}
      aria-hidden="true"
    >
      <div ref={fillRef} className="scroll-progress-bar__fill" aria-hidden="true" />
    </div>
  )
}
