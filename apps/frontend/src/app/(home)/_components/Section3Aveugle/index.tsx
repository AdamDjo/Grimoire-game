'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

import { useClipReveal } from '../../_hooks/use-scroll-reveal'

import { QuoteOverlay } from './QuoteOverlay'

/**
 * Section3Aveugle — "L'Aveugle"
 *
 * Diptyque cinématique : deux images superposées (version sombre dessous,
 * version "cendres" dessus). Le scroll ouvre la version cendres comme un
 * rideau de gauche à droite. Zoom subtil synchronisé pour le souffle Rockstar.
 * Citations diégétiques posées en bord d'écran, paliers de scroll.
 */
export function Section3Aveugle() {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const crossfadeRef = useRef<HTMLDivElement>(null)

  useClipReveal({
    containerRef: sectionRef,
    target: '.aveugle-cendres-img',
  })

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)
      const imgs = stickyRef.current?.querySelectorAll<HTMLImageElement>('.aveugle-img')
      if (!imgs || !stickyRef.current) return

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap.fromTo(
        imgs,
        { scale: 1.0 },
        {
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      )

      // Crossfade Rockstar — overlay `fixed` plein écran avec l'image auberge.
      // Monte en opacité 0 → 1 sur top bottom → top top, par-dessus la
      // frame_096 + voile S2. Pas de bande horizontale : l'overlay couvre tout
      // le viewport en permanence. Le sticky reste invisible jusqu'à top top
      // puis prend le relais d'un coup (clip-path + zoom animés).
      if (prefersReducedMotion) {
        gsap.set(stickyRef.current, { opacity: 1, autoAlpha: 1 })
        if (crossfadeRef.current) gsap.set(crossfadeRef.current, { autoAlpha: 0 })
      } else if (crossfadeRef.current) {
        // Séquence Apple/Rockstar :
        // - L'auberge monte en opacité TOUT EN ÉTANT FLOUE (filter blur 32px)
        //   sur la fin de S2 + début de S3. On ne voit jamais une auberge nette.
        // - Sur `top 20% → top top`, le flou s'atténue (32px → 0px) en même
        //   temps que le crossfade passe le relais au sticky.
        // - Le sticky est nette de naissance (clip-path noir au départ).

        // Tween A — crossfade monte en opacité, déjà flou.
        gsap.fromTo(
          crossfadeRef.current,
          { opacity: 0, filter: 'blur(32px)' },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'top 20%',
              scrub: true,
            },
          }
        )

        // Tween B — flou descend 32px → 0px sur `top 20% → top top`.
        gsap.to(crossfadeRef.current, {
          filter: 'blur(0px)',
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 20%',
            end: 'top top',
            scrub: true,
          },
        })

        // Tween C — crossfade s'efface en opacité sur la même fenêtre.
        gsap.to(crossfadeRef.current, {
          opacity: 0,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 20%',
            end: 'top top',
            scrub: true,
          },
        })

        // Tween D — sticky monte simultanément (deux Auberge-modern
        // identiques au cadrage → crossfade silencieux).
        gsap.to(stickyRef.current, {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 20%',
            end: 'top top',
            scrub: true,
          },
        })
      }

      // Refresh après le prochain frame pour laisser useClipReveal (hook séparé)
      // s'enregistrer avant le recalcul des positions — sinon le clip-path
      // gauche → droite des deux images du diptyque n'est pas pris en compte.
      requestAnimationFrame(() => ScrollTrigger.refresh())
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      data-section-id="aveugle"
      aria-label="L’Aveugle — diptyque cinématique"
      className="relative z-10 h-[300vh]"
    >
      {/* Overlay de crossfade — fixed plein écran avec l'image auberge.
          Visible uniquement pendant l'approche (avant que Section 3 atteigne
          top top). Garantit zéro bande horizontale. */}
      <div
        ref={crossfadeRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
        style={{ opacity: 0 }}
      >
        <img
          src="/home/Auberge-modern.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ opacity: 0 }}
      >
        {/* Image base : version sombre (taverne). */}
        <img
          src="/home/Auberge-modern.jpg"
          alt=""
          aria-hidden="true"
          className="aveugle-img absolute inset-0 h-full w-full object-cover"
        />

        {/* Image overlay : version "cendres" révélée par clip-path. */}
        <img
          src="/home/Auberge.jpg"
          alt=""
          aria-hidden="true"
          className="aveugle-img aveugle-cendres-img absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: 'inset(0 100% 0 0)' }}
        />

        {/* Vignette + dégradé bas pour lisibilité des citations. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, var(--bg-overlay-70) 0%, transparent 25%, transparent 55%, var(--bg-overlay-95) 100%)',
          }}
        />

        <QuoteOverlay containerRef={sectionRef} />
      </div>
    </section>
  )
}
