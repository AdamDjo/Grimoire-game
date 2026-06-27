'use client'

import { Button } from '@/components/ui/Button'
import { CompassRose } from '@/components/ui/CompassRose'

import { SlideTexts } from './SlideTexts'

import type { RefObject } from 'react'

interface HeroContentProps {
  /**
   * Refs sur chaque sous-bloc, utilisées par useCanvasScrollSequence pour
   * orchestrer la révélation en cascade (CompassRose → slide → CTA).
   */
  childRefs?: {
    compassRose: RefObject<HTMLDivElement | null>
    slideTexts: RefObject<HTMLDivElement | null>
    cta: RefObject<HTMLDivElement | null>
  }
}

/**
 * HeroContent — bloc central posé par-dessus le hero animé
 * (CompassRose + paliers de texte rotatifs + CTA).
 *
 * Caché à l'arrivée, révélé en cascade dès le premier scroll (orchestration
 * GSAP via les refs exposées par `childRefs`).
 */
export function HeroContent({ childRefs }: HeroContentProps) {
  return (
    <>
      {/* Scrim radial : assombrit le centre derrière le texte pour le contraste. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 45%, var(--bg-overlay-70) 0%, var(--bg-overlay-50) 40%, transparent 75%)',
        }}
      />

      <div className="flex flex-col items-center">
        <div ref={childRefs?.compassRose} style={{ marginBottom: 20 }}>
          <CompassRose size={36} />
        </div>

        <div ref={childRefs?.slideTexts} className="w-full">
          <SlideTexts align="center" />
        </div>

        <div ref={childRefs?.cta} className="pointer-events-auto" style={{ marginTop: 36 }}>
          <Button variant="primary" style={{ fontSize: 13, letterSpacing: '0.22em' }}>
            Entrer dans l&apos;Univers
          </Button>
        </div>
      </div>
    </>
  )
}
