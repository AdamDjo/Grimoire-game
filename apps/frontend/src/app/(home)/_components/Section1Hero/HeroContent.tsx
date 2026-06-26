'use client'

import { Button } from '@/components/ui/Button'
import { CompassRose } from '@/components/ui/CompassRose'

import { SlideTexts } from './SlideTexts'

/**
 * HeroContent — bloc central posé par-dessus le hero animé
 * (CompassRose + paliers de texte rotatifs + CTA).
 *
 * Rendu dans une div fixe avec fade-out GSAP au scroll — la ref est gérée
 * par le parent (Section1Hero) via `textRef`.
 */
export function HeroContent() {
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
        <div style={{ marginBottom: 20 }}>
          <CompassRose size={36} />
        </div>

        <SlideTexts align="center" />

        <div className="pointer-events-auto" style={{ marginTop: 36 }}>
          <Button variant="primary" style={{ fontSize: 13, letterSpacing: '0.22em' }}>
            Entrer dans l&apos;Univers
          </Button>
        </div>
      </div>
    </>
  )
}
