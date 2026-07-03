'use client'

import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'

import { HERO_SLIDES } from '../../_data/home-data'

type Slide = (typeof HERO_SLIDES)[number]

/** Alignement horizontal du contenu. */
type Align = 'center' | 'start'

/** Contenu d'un palier : tagline + titre doré + description. */
function SlideContent({ slide, align }: { slide: Slide; align: Align }) {
  const alignClass =
    align === 'center' ? 'flex flex-col items-center text-center' : 'flex flex-col items-start'

  return (
    <div className={alignClass}>
      {/* Tagline — shimmer or doux */}
      <p className="text-disp-sm" style={{ marginBottom: 14 }}>
        <AnimatedShinyText variant="gold-soft" shimmerWidth={180}>
          {slide.tagline}
        </AnimatedShinyText>
      </p>

      {/* Title — AnimatedShinyText (shimmer or qui va-et-vient), pas de
          KineticText (SplitText casserait le background-clip: text). */}
      <h1
        className="font-display font-bold motion-safe:animate-hero-title-reveal"
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

      {/* Description — shimmer ink doux */}
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
 * description) avec révélation KineticText char-by-char au mount.
 *
 * Les 3 niveaux entrent avec des staggers naturellement décalés grâce au
 * nombre de chars différents (tagline court → title court → description longue).
 * prefers-reduced-motion géré dans KineticText.
 */
export function SlideTexts({ align = 'center' }: { align?: Align }) {
  const slide = HERO_SLIDES[0]

  return (
    <div className="w-full">
      <SlideContent slide={slide} align={align} />
    </div>
  )
}
