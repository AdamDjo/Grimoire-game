'use client'

import { Button } from '@/components/ui/Button'
import { CompassRose } from '@/components/ui/CompassRose'
import { EmberGlow } from '@/components/ui/EmberGlow'
import { MagneticButton } from '@/components/ui/MagneticButton'

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
          <div
            style={{
              transform: 'translate3d(calc(var(--mx, 0) * 6px), calc(var(--my, 0) * 6px), 0)',
              willChange: 'transform',
            }}
          >
            <CompassRose size={36} />
          </div>
        </div>

        <div ref={childRefs?.slideTexts} className="w-full">
          <div
            style={{
              transform: 'translate3d(calc(var(--mx, 0) * 8px), calc(var(--my, 0) * 8px), 0)',
              willChange: 'transform',
            }}
          >
            <SlideTexts align="center" />
          </div>
        </div>

        <div ref={childRefs?.cta} className="pointer-events-auto" style={{ marginTop: 36 }}>
          <div
            style={{
              transform: 'translate3d(calc(var(--mx, 0) * 12px), calc(var(--my, 0) * 12px), 0)',
              willChange: 'transform',
            }}
          >
            <MagneticButton pulse strength={8}>
              <EmberGlow radius={240}>
                <Button variant="primary" style={{ fontSize: 13, letterSpacing: '0.22em' }}>
                  Entrer dans l&apos;Univers
                </Button>
              </EmberGlow>
            </MagneticButton>
          </div>
        </div>
      </div>
    </>
  )
}
