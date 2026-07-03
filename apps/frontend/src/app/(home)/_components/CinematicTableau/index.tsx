'use client'

import { useRef } from 'react'

import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { KineticText } from '@/components/ui/KineticText'
import { useHighPerformanceMode } from '@/hooks/use-high-performance-mode'

import { useFrameSequenceScrub } from '../../_hooks/use-frame-sequence-scrub'

interface CinematicTableauProps {
  /** id passé en `data-section-id` (utilisé par SidePagination). */
  id: string
  /** Titre a11y de la section. */
  ariaLabel: string
  /** Dossier public des frames webp (ex. "/home/frames_cendres"). */
  framesDir: string
  /** Nombre de frames dans la séquence. */
  frameCount: number
  /** Phrase kinetic centrale (révélation char-by-char au scroll). */
  kineticLine: string
  /** Chiffre romain posé au-dessus de la phrase (I / II / III). */
  eyebrow?: string
  /** Fallback statique si les assets ne sont pas encore générés / device faible. */
  fallbackImage?: string
  /** Hauteur de la section en unités viewport. Défaut 200 (desktop). */
  heightVh?: number
  /** Cherche les frames en multi-tier (desktop/tablet/mobile). Défaut true. */
  multiTier?: boolean
}

/**
 * CinematicTableau — brique de tableau cinématique scrubbé.
 *
 * Timeline scrub :
 *  - Phase A (0 → 0.1) : entrée (canvas fade-in)
 *  - Phase B (0.1 → 0.75) : scrub des frames webp
 *  - Phase C (0.75 → 1) : dernière frame reste fixed → match cut avec section suivante
 *
 * La phrase kinetic entre au moment où la section atteint le centre du viewport
 * (via ScrollTrigger interne de `KineticText`).
 *
 * Fallback : si device faible (`useHighPerformanceMode` = false) OU si les
 * assets ne sont pas encore là, on affiche `fallbackImage` en plein écran +
 * la phrase statique. Pas de canvas, pas de scrub.
 */
export function CinematicTableau({
  id,
  ariaLabel,
  framesDir,
  frameCount,
  kineticLine,
  eyebrow,
  fallbackImage,
  heightVh = 200,
  multiTier = true,
}: CinematicTableauProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const highPerf = useHighPerformanceMode()

  useFrameSequenceScrub({
    containerRef: sectionRef,
    canvasRef,
    framesDir,
    frameCount,
    multiTier,
    lazyPreload: true,
  })

  return (
    <section
      ref={sectionRef}
      data-section-id={id}
      aria-label={ariaLabel}
      className="relative z-10"
      style={{ height: `${heightVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {highPerf ? (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            style={{ willChange: 'transform' }}
          />
        ) : (
          fallbackImage && (
            <img
              src={fallbackImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )
        )}

        {/* Vignette légère juste sous le texte central (assez pour lisibilité,
            sans assombrir l'image). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(5,5,6,0.35) 0%, transparent 55%)',
          }}
        />

        {/* Bloc central : eyebrow numéroté + phrase kinetic. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
          {eyebrow && (
            <KineticText
              text={eyebrow}
              as="span"
              trigger="scroll"
              start="top 65%"
              duration={0.7}
              stagger={0.04}
              style={{
                fontFamily: 'var(--font-disp)',
                fontSize: 'clamp(11px, 1vw, 14px)',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                opacity: 0.7,
              }}
            />
          )}

          <p
            className="font-serif italic text-center"
            style={{
              fontSize: 'clamp(34px, 5.5vw, 84px)',
              lineHeight: 1.15,
              maxWidth: '18ch',
              letterSpacing: '-0.01em',
              textShadow: '0 2px 24px rgba(0,0,0,.85)',
            }}
          >
            <AnimatedShinyText variant="gold-strong" shimmerWidth={320}>
              {kineticLine}
            </AnimatedShinyText>
          </p>
        </div>
      </div>
    </section>
  )
}
