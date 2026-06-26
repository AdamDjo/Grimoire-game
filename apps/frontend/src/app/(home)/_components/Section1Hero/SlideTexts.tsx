'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'

import { HERO_SLIDES, HERO_SLIDE_DURATION_MS, heroSlideReveal } from '../../_data/home-data'

type Slide = (typeof HERO_SLIDES)[number]

/** Alignement horizontal du contenu. */
type Align = 'center' | 'start'

/** Contenu d'un palier : tagline + titre doré + description. */
function SlideContent({ slide, align }: { slide: Slide; align: Align }) {
  return (
    <div
      className={
        align === 'center'
          ? 'flex flex-col items-center text-center'
          : 'flex flex-col items-center md:items-start'
      }
    >
      <p className="text-disp-sm" style={{ marginBottom: 14 }}>
        <AnimatedShinyText variant="gold-soft" shimmerWidth={140}>
          {slide.tagline}
        </AnimatedShinyText>
      </p>

      <h1
        className="font-display font-bold"
        style={{
          fontSize: 'clamp(32px, 7vw, 72px)',
          letterSpacing: '0.06em',
          lineHeight: 1.05,
          margin: '0 0 20px',
          whiteSpace: 'pre-line',
        }}
      >
        <AnimatedShinyText variant="gold-strong" shimmerWidth={280}>
          {slide.title}
        </AnimatedShinyText>
      </h1>

      <p className="text-serif-md" style={{ marginBottom: 0, maxWidth: 500 }}>
        <AnimatedShinyText variant="ink-soft" shimmerWidth={220}>
          {slide.description}
        </AnimatedShinyText>
      </p>
    </div>
  )
}

/**
 * SlideTexts — fait défiler en boucle les paliers de texte du hero
 * (tagline + titre doré + description). Le CompassRose et le CTA restent hors
 * de ce composant, donc fixes.
 *
 * - Rotation auto toutes les HERO_SLIDE_DURATION_MS, en pause au survol/focus.
 * - Transition « fondu + brume » via AnimatePresence (heroSlideReveal).
 * - Respecte prefers-reduced-motion : pas de rotation, palier 1 figé.
 * - Hauteur stabilisée : tous les paliers sont empilés (grid 1×1) en
 *   « fantômes » invisibles → le conteneur prend la hauteur du plus long et le
 *   titre/CTA ne sautent pas entre les transitions. Responsive, sans px fixe.
 */
export function SlideTexts({ align = 'center' }: { align?: Align }) {
  const prefersReducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion || paused) return

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, HERO_SLIDE_DURATION_MS)

    return () => clearInterval(id)
  }, [prefersReducedMotion, paused])

  const slide = HERO_SLIDES[index]
  const transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div
      className="grid w-full"
      aria-roledescription="carrousel"
      aria-label="Présentation de l’univers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Fantômes : réservent la hauteur du plus grand palier (sans saut). */}
      {HERO_SLIDES.map((s) => (
        <div key={s.title} aria-hidden="true" className="invisible" style={{ gridArea: '1 / 1' }}>
          <SlideContent slide={s} align={align} />
        </div>
      ))}

      {/* Palier visible animé, superposé dans la même cellule de grille. */}
      <div style={{ gridArea: '1 / 1' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            variants={prefersReducedMotion ? undefined : heroSlideReveal}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={transition}
            aria-live="polite"
          >
            <SlideContent slide={slide} align={align} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
