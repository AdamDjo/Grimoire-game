'use client'

import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'

import type { ReactNode } from 'react'

/**
 * UniversCard — card glassmorphique générique utilisée par les 3 slides
 * horizontales de Section2Seuil. Le parent gère l'anim de reveal (blur/y/opacity)
 * via GSAP au passage dans la viewport horizontale.
 *
 * - children remplace `description` quand on a un contenu riche (ex. ManifestoReveal).
 * - tagline + title sont optionnels (la card 1 manifeste n'en a pas, tout vit dans children).
 */
export function UniversCard({
  tagline,
  title,
  description,
  children,
}: {
  tagline?: string
  title?: string
  description?: string
  children?: ReactNode
}) {
  return (
    <div
      className="relative rounded-2xl border border-white/10 px-8 py-10 md:px-14 md:py-14"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.18)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.45)',
        maxWidth: 'min(90vw, 880px)',
      }}
    >
      {children ?? (
        <div className="flex flex-col items-center text-center">
          {tagline ? (
            <p className="text-disp-sm" style={{ marginBottom: 14 }}>
              <AnimatedShinyText variant="gold-soft" shimmerWidth={140}>
                {tagline}
              </AnimatedShinyText>
            </p>
          ) : null}

          {title ? (
            <h2
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
                {title}
              </AnimatedShinyText>
            </h2>
          ) : null}

          {description ? (
            <p className="text-serif-md" style={{ marginBottom: 0, maxWidth: 600 }}>
              <AnimatedShinyText variant="ink-soft" shimmerWidth={220}>
                {description}
              </AnimatedShinyText>
            </p>
          ) : null}
        </div>
      )}
    </div>
  )
}
