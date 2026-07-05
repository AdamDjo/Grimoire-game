'use client'

import { useRef } from 'react'

import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { KineticText } from '@/components/ui/KineticText'
import { useHighPerformanceMode } from '@/hooks/use-high-performance-mode'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap-init'

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
  /** Image de départ utilisée pour un match cut avant la séquence. */
  introFrameSrc?: string
  /** Numéro de la première frame source. Défaut 1. */
  frameStart?: number
  /** Phrase kinetic centrale (révélation char-by-char au scroll). */
  kineticLine: string
  /** Chiffre romain posé au-dessus de la phrase (I / II / III). */
  eyebrow?: string
  /** Fallback statique si les assets ne sont pas encore générés / device faible. */
  fallbackImage?: string
  /** Hauteur de la section en unités viewport. Défaut 200 (desktop). */
  heightVh?: number
  /** Début du scrub dans la section, entre 0 et 1. Défaut 0.1. */
  scrubStart?: number
  /** Fin du scrub dans la section, entre 0 et 1. Défaut 0.75. */
  scrubEnd?: number
  /** Début de révélation du texte dans la section, entre 0 et 1. Défaut immédiat. */
  contentRevealStart?: number
  /** Début de sortie du texte dans la section, entre 0 et 1. */
  contentExitStart?: number
  /** Point de départ ScrollTrigger de la timeline texte. */
  contentScrollStart?: string
  /** Points de snap doux pour éviter les zones mortes entre deux textes. */
  contentSnapPoints?: number[]
  /** Durée normalisée de l'entrée texte. */
  contentRevealDuration?: number
  /** Durée normalisée de la sortie texte. */
  contentExitDuration?: number
  /** Cherche les frames en multi-tier (desktop/tablet/mobile). Défaut true. */
  multiTier?: boolean
  /** Utilise une scène plein écran fixed au lieu d'un sticky qui entre par le bas. */
  fixedStage?: boolean
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
  introFrameSrc,
  frameStart = 1,
  kineticLine,
  eyebrow,
  fallbackImage,
  heightVh = 200,
  scrubStart = 0.1,
  scrubEnd = 0.75,
  contentRevealStart = 0,
  contentExitStart,
  contentSnapPoints,
  contentRevealDuration = 0.14,
  contentExitDuration = 0.12,
  multiTier = true,
  fixedStage = false,
  contentScrollStart = fixedStage ? 'top bottom' : 'top top',
}: CinematicTableauProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const highPerf = useHighPerformanceMode()
  const baseImage = introFrameSrc ?? fallbackImage
  const contentSnapKey = contentSnapPoints?.join(',') ?? ''

  useFrameSequenceScrub({
    containerRef: sectionRef,
    canvasRef,
    framesDir,
    frameCount,
    introFrameSrc,
    frameStart,
    multiTier,
    scrubStart,
    scrubEnd,
    lazyPreload: true,
  })

  useGSAP(
    () => {
      if (!fixedStage) return

      const stage = stageRef.current
      const section = sectionRef.current
      if (!stage || !section) return

      gsap.set(stage, { autoAlpha: 0 })

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        onToggle: (self) => {
          gsap.to(stage, {
            autoAlpha: self.isActive ? 1 : 0,
            duration: self.isActive ? 0.12 : 0,
            ease: 'none',
            overwrite: true,
          })
        },
        onRefresh: (self) => {
          gsap.set(stage, { autoAlpha: self.isActive ? 1 : 0 })
        },
      })

      return () => trigger.kill()
    },
    { scope: sectionRef, dependencies: [fixedStage] }
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      const content = contentRef.current
      if (!section || !content || (contentRevealStart <= 0 && contentExitStart === undefined))
        return

      gsap.set(content, { autoAlpha: 0, y: 24, filter: 'blur(8px)' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: contentScrollStart,
          end: 'bottom top',
          scrub: 1,
          snap:
            contentSnapPoints && contentSnapPoints.length > 0
              ? {
                  snapTo: contentSnapPoints,
                  duration: { min: 0.25, max: 0.55 },
                  delay: 0.05,
                  ease: 'power2.inOut',
                }
              : undefined,
        },
      })

      tl.to(
        content,
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          ease: 'power2.out',
          duration: contentRevealDuration,
        },
        contentRevealStart
      )

      if (contentExitStart !== undefined) {
        tl.to(
          content,
          {
            autoAlpha: 0,
            y: -18,
            filter: 'blur(8px)',
            ease: 'power2.in',
            duration: contentExitDuration,
          },
          contentExitStart
        )
      }

      return () => tl.kill()
    },
    {
      scope: sectionRef,
      dependencies: [
        contentRevealStart,
        contentExitStart,
        contentScrollStart,
        contentSnapKey,
        contentRevealDuration,
        contentExitDuration,
      ],
    }
  )

  return (
    <section
      ref={sectionRef}
      data-section-id={id}
      aria-label={ariaLabel}
      className="relative z-10"
      style={{ height: `${heightVh}vh` }}
    >
      <div
        ref={stageRef}
        className={
          fixedStage
            ? 'pointer-events-none fixed inset-0 z-[20] h-screen w-full overflow-hidden opacity-0'
            : 'sticky top-0 h-screen w-full overflow-hidden'
        }
      >
        {highPerf ? (
          <>
            {baseImage && (
              <img
                src={baseImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              style={{ willChange: 'transform' }}
            />
          </>
        ) : (
          baseImage && (
            <img
              src={baseImage}
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
        <div
          ref={contentRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 px-6"
        >
          {eyebrow && (
            <KineticText
              text={eyebrow}
              as="span"
              trigger={contentRevealStart > 0 ? 'mount' : 'scroll'}
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
