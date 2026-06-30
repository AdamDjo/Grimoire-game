'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'

import { HERO_SLIDES, heroSlideReveal } from '../../_data/home-data'

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
 * SlideTexts — affiche le premier palier du hero (tagline + titre doré +
 * description) avec son animation d'entrée « fondu + brume » jouée une fois
 * au mount. Les autres paliers du carrousel ont migré dans Section2Seuil
 * (cards horizontales scrubbées).
 *
 * Respecte prefers-reduced-motion : palier figé sans animation.
 */
export function SlideTexts({ align = 'center' }: { align?: Align }) {
  const prefersReducedMotion = useReducedMotion()
  const slide = HERO_SLIDES[0]
  const transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div className="w-full">
      <motion.div
        variants={prefersReducedMotion ? undefined : heroSlideReveal}
        initial="hidden"
        animate="visible"
        transition={transition}
      >
        <SlideContent slide={slide} align={align} />
      </motion.div>
    </div>
  )
}
