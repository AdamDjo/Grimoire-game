'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

import { CosmicGlow } from './CosmicGlow'
import { ManifestoReveal } from './ManifestoReveal'

/**
 * Section2Seuil — "Le Seuil"
 *
 * Overlay sticky 100% transparent au départ. Le canvas fixed de Section1Hero
 * (qui affiche frame_096) reste visible derrière toute la traversée. Un voile
 * noir scrubbé monte progressivement par-dessus → crossfade continu, zéro coupure.
 * La card manifeste remonte au scroll façon Rockstar VI.
 */
export function Section2Seuil() {
  const sectionRef = useRef<HTMLElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const blurRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!veilRef.current || !cardRef.current || !blurRef.current) return

      if (prefersReducedMotion) {
        gsap.set(veilRef.current, { opacity: 0.5 })
        gsap.set(cardRef.current, { opacity: 1, y: 0, filter: 'blur(0px)' })
        gsap.set(blurRef.current, { opacity: 0 })
        return
      }

      // Phase 1 — Voile noir : 0 → 0.5. Démarre AVANT que Section2 soit
      // visible (top bottom) pour crossfader sur la frame_096 sans coupure.
      // Plafond modéré (0.5) : la frame_096 reste lisible derrière la card.
      gsap.fromTo(
        veilRef.current,
        { opacity: 0 },
        {
          opacity: 0.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
          },
        }
      )

      // Phase 2 — Card manifeste remonte (translateY + opacity + blur).
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 80, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
            end: 'center center',
            scrub: 1,
          },
        }
      )

      // Sortie de la card — la card reste lisible toute la durée de S2,
      // puis disparaît sur les tout derniers % (miroir de l'entrée).
      // Pendant ce temps un overlay de flou monte simultanément →
      // la card s'efface dans le flou, pas dans le vide.
      gsap.to(cardRef.current, {
        opacity: 0,
        y: -80,
        filter: 'blur(8px)',
        ease: 'power3.in',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'bottom 60%',
          end: 'bottom 10%',
          scrub: 1,
        },
      })

      // Phase 3 — Voile redescend 0.5 → 0.35 sur la même fenêtre que la
      // sortie de la card. Pas de coupure visuelle.
      gsap.to(veilRef.current, {
        opacity: 0.35,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'bottom 60%',
          end: 'bottom 10%',
          scrub: 1,
        },
      })

      // Overlay de flou — monte en fin de S2 (même fenêtre que la sortie
      // card), continue à exister sur le début de S3, puis s'atténue
      // (descente gérée côté Section3Aveugle). Garantit qu'on ne voit
      // jamais l'auberge nette pendant la jonction : flou maximal au
      // moment du passage, image nette uniquement quand le sticky est
      // pleinement installé.
      gsap.fromTo(
        blurRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'bottom 60%',
            end: 'bottom 10%',
            scrub: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      data-section-id="seuil"
      aria-label="Le Seuil — manifeste"
      className="relative z-10 h-[250vh]"
    >
      {/* Voile noir scrubbé — fixed pour couvrir TOUT le viewport (pas juste
          le sticky), sinon une bande horizontale apparaît à la jonction
          Section1/Section2 (canvas fixed visible sans voile au-dessus). */}
      <div
        ref={veilRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-black"
        style={{ opacity: 0 }}
      />

      {/* Marqueur invisible pour Section3 — l'amplitude réelle du flou est
          appliquée directement sur le crossfade auberge via `filter` (voir
          Section3Aveugle). Ici on n'a besoin que de l'opacité scrubbée
          comme proxy : 0 = pas de transition, 1 = pleine intensité. */}
      <div
        ref={blurRef}
        data-transition-blur
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{ opacity: 0, visibility: 'hidden' }}
      />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <CosmicGlow />

        {/* Card manifeste — un seul bloc qui remonte au scroll. */}
        <div
          ref={cardRef}
          className="absolute inset-0 flex items-center justify-center px-6"
          style={{ willChange: 'transform, opacity, filter' }}
        >
          <div
            className="relative rounded-2xl border border-white/10 px-8 py-10 md:px-14 md:py-14"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.18)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.45)',
            }}
          >
            <ManifestoReveal />
          </div>
        </div>
      </div>
    </section>
  )
}
