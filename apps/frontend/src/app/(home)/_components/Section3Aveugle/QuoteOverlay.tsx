'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

import { DustReveal } from '@/components/ui/DustReveal'

import { AVEUGLE_QUOTES } from '../../_data/home-data'

interface QuoteOverlayProps {
  containerRef: React.RefObject<HTMLElement | null>
}

/**
 * QuoteOverlay — 3 citations diégétiques en sous-titre cinéma, posées en bord
 * d'écran (left/right alterné). Apparaissent à des paliers de scroll distincts
 * (≈ 5%, 40%, 75% de la section), restent à l'écran ~25%, disparaissent.
 */
export function QuoteOverlay({ containerRef }: QuoteOverlayProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      const quotes = wrapperRef.current?.querySelectorAll<HTMLElement>('.aveugle-quote')
      if (!quotes || quotes.length === 0) return

      // Les 3 citations doivent toutes disparaître avant `bottom-=25% bottom`
      // (≈ 75% du scroll de la section h-[300vh]), moment où la vidéo auberge
      // commence son fade-in. Sinon elles se superposent à la scène finale.
      const starts = [0.04, 0.28, 0.5]

      quotes.forEach((quote, i) => {
        const start = starts[i] ?? 0
        const end = start + 0.18

        gsap.fromTo(
          quote,
          { opacity: 0, y: 24, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: `top+=${start * 100}% top`,
              end: `top+=${(start + 0.08) * 100}% top`,
              scrub: true,
            },
          }
        )

        gsap.to(quote, {
          opacity: 0,
          y: -24,
          filter: 'blur(8px)',
          ease: 'power2.in',
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top+=${end * 100}% top`,
            end: `top+=${(end + 0.08) * 100}% top`,
            scrub: true,
          },
        })
      })
    },
    { scope: wrapperRef }
  )

  return (
    <div ref={wrapperRef} className="pointer-events-none absolute inset-0">
      {AVEUGLE_QUOTES.map((quote, i) => {
        const isLeft = quote.align === 'left'
        return (
          <p
            key={quote.text}
            className="aveugle-quote font-serif italic"
            style={{
              opacity: 0,
              position: 'absolute',
              bottom: `${14 + i * 6}%`,
              [isLeft ? 'left' : 'right']: '8%',
              maxWidth: 'min(520px, 42vw)',
              textAlign: isLeft ? 'left' : 'right',
              fontSize: 'clamp(18px, 2vw, 26px)',
              lineHeight: 1.4,
              color: 'var(--gold-light)',
              textShadow: '0 2px 18px rgba(0,0,0,0.85)',
            }}
          >
            <DustReveal
              text={quote.text}
              startDelay={0.15}
              wordStagger={0.1}
              duration={1.5}
              withQuotes
            />
          </p>
        )
      })}
    </div>
  )
}
