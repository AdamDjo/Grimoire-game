'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

import { UNIVERS_CARDS } from '../../_data/home-data'

import { CosmicGlow } from './CosmicGlow'
import { ManifestoReveal } from './ManifestoReveal'
import { UniversCard } from './UniversCard'

/**
 * Section2Seuil — "Le Seuil → Univers"
 *
 * Section pinned : le scroll vertical fait défiler horizontalement 3 cards
 * glassmorphiques (card 1 = manifeste, cards 2 & 3 = lore Velkhar).
 *
 * Transitions portées par les éléments eux-mêmes, sans overlay global :
 *  - Entrée  : card 1 émerge floue/transparente (scrub `top bottom → top top`)
 *              et atteint son état net pile à l'activation du pin.
 *  - Sortie  : card 3 se dissout (blur + opacity + y) sur le dernier quart du
 *              pin, avant que S3 prenne le relais.
 */
export function Section2Seuil() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el
  }

  // 3 cards : 1 manifeste + 2 paliers lore (UNIVERS_CARDS).
  const totalCards = 1 + UNIVERS_CARDS.length

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!trackRef.current) return

      if (prefersReducedMotion) {
        gsap.set(trackRef.current, { x: 0 })
        gsap.set(cardsRef.current, { opacity: 1, y: 0, filter: 'blur(0px)' })
        return
      }

      const firstCard = cardsRef.current[0]
      const lastCard = cardsRef.current[totalCards - 1]

      // Phase 1 — Reveal scrubbé de la card 1 PENDANT que la section entre
      // dans le viewport en flow normal (avant le pin). La card 1 est floue
      // et transparente pendant qu'elle monte ; elle atteint son état net pile
      // quand la section devient pinned. Pas de bord visible, pas de panneau.
      if (firstCard) {
        gsap.fromTo(
          firstCard,
          { opacity: 0, y: 60, filter: 'blur(24px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          }
        )
      }

      // Cards 2 & 3 — opacity 1 d'office (le scroll horizontal s'occupe de
      // les amener au centre une par une, elles sont hors-viewport tant que
      // ce n'est pas leur tour).
      cardsRef.current.slice(1).forEach((c) => {
        if (c) gsap.set(c, { opacity: 1, y: 0, filter: 'blur(0px)' })
      })

      // Phase 2 — Scroll-jacking horizontal pinned, dans une timeline pour
      // pouvoir y ajouter le fadeout de la card 3 sur le dernier quart.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * totalCards}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Le défilement horizontal occupe 0 → 0.75 de la timeline. La card 3
      // est ainsi centrée à ~0.66 et a un quart de scroll pour être lue.
      tl.to(
        trackRef.current,
        {
          x: () => -(totalCards - 1) * window.innerWidth,
          ease: 'none',
          duration: 0.75,
        },
        0
      )

      // Phase 3 — Fadeout de la card 3 sur les derniers 25% du pin.
      // Quand le pin se relâche, la card est déjà dissoute → S3 prend le
      // relais sur un vide propre.
      if (lastCard) {
        tl.to(
          lastCard,
          {
            opacity: 0,
            y: -40,
            filter: 'blur(24px)',
            ease: 'power2.in',
            duration: 0.25,
          },
          0.75
        )
      }
    },
    { scope: sectionRef, dependencies: [totalCards] }
  )

  return (
    <section
      ref={sectionRef}
      data-section-id="seuil"
      aria-label="Le Seuil — univers de Velkhar"
      className="relative z-10"
    >
      <div className="relative h-screen w-full overflow-hidden">
        <CosmicGlow />

        {/* Track horizontal — 3 cards côte à côte, déplacé via GSAP. */}
        <div
          ref={trackRef}
          className="absolute inset-0 flex items-center"
          style={{
            width: `${totalCards * 100}vw`,
            willChange: 'transform',
          }}
        >
          {/* Card 1 — Manifeste */}
          <div
            ref={setCardRef(0)}
            className="flex h-full items-center justify-center px-6"
            style={{ width: '100vw', willChange: 'transform, opacity, filter' }}
          >
            <UniversCard>
              <ManifestoReveal />
            </UniversCard>
          </div>

          {/* Cards 2 & 3 — Lore Velkhar */}
          {UNIVERS_CARDS.map((slide, i) => (
            <div
              key={slide.title}
              ref={setCardRef(i + 1)}
              className="flex h-full items-center justify-center px-6"
              style={{ width: '100vw', willChange: 'transform, opacity, filter' }}
            >
              <UniversCard
                tagline={slide.tagline}
                title={slide.title}
                description={slide.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
