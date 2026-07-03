'use client'

import { useRef } from 'react'

import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { Button } from '@/components/ui/Button'
import { EmberGlow } from '@/components/ui/EmberGlow'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap-init'

import { useClipReveal } from '../../_hooks/use-scroll-reveal'

import { OutroFooter } from './OutroFooter'
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
  const ctaRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const aubergeVideoRef = useRef<HTMLVideoElement>(null)

  useClipReveal({
    containerRef: sectionRef,
    target: '.aveugle-cendres-img',
  })

  useGSAP(
    () => {
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
            scrub: 1,
            invalidateOnRefresh: true,
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
        if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 1, y: 0, filter: 'blur(0px)' })
        if (footerRef.current)
          gsap.set(footerRef.current, { opacity: 1, y: 0, filter: 'blur(0px)' })
      } else if (crossfadeRef.current) {
        // Séquence Apple/Rockstar — timeline unique scrubbée sur `top 80% → top top`
        // (une seule ScrollTrigger au lieu de 4).
        //
        // - Phase 1 [0 → 0.75] : crossfade monte en opacité 0→1, reste flou 32px.
        //   On ne voit jamais une auberge nette pendant l'approche.
        // - Phase 2 [0.75 → 1] : flou 32px→0px + crossfade fade-out + sticky fade-in
        //   simultanément → passage de relais silencieux vers le sticky net.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
          defaults: { ease: 'none' },
        })

        tl.fromTo(
          crossfadeRef.current,
          { opacity: 0, filter: 'blur(32px)' },
          { opacity: 1, duration: 0.75 },
          0
        )
          .to(crossfadeRef.current, { filter: 'blur(0px)', duration: 0.25 }, 0.75)
          .to(crossfadeRef.current, { opacity: 0, duration: 0.25 }, 0.75)
          .to(stickyRef.current, { opacity: 1, duration: 0.25 }, 0.75)
      }

      // CTA "Entrer dans l'auberge" — reveal une fois que le sticky est en
      // place. Non-scrub : on tween une fois, il reste visible ensuite.
      if (!prefersReducedMotion && ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 24, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // OutroFooter — révèle juste après le CTA, reste visible ensuite.
      if (!prefersReducedMotion && footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { opacity: 0, y: 24, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            delay: 0.25,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Loop vidéo Auberge — démarre en amont de `top top` pour éviter le
      // gel : le clip-path (useClipReveal) masque la vidéo jusqu'à
      // `top top`, et Chrome/Safari throttlent le décodage d'un <video>
      // entièrement clippé. On lance la lecture dès `top 80%` (même moment
      // que le crossfade Auberge-modern floue) : la vidéo est déjà en cours
      // quand le clip commence à la révéler → plus de saccade au « mur ».
      //
      // Pas de `onLeave` à `bottom bottom` — c'est la fin de la section,
      // l'utilisateur y reste (CTA + footer). On coupe uniquement au retour
      // en amont (`onLeaveBack`) pour préserver le match cut avec Auberge.jpg.
      if (aubergeVideoRef.current) {
        const video = aubergeVideoRef.current
        video.load()
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom bottom',
          onEnter: () => {
            void video.play().catch(() => undefined)
          },
          onEnterBack: () => {
            void video.play().catch(() => undefined)
          },
          onLeaveBack: () => {
            video.pause()
            video.currentTime = 0
          },
        })
      }

      // Refresh une fois tous les ScrollTriggers (locaux + useClipReveal) posés,
      // pour que le clip-path gauche → droite du diptyque soit pris en compte.
      ScrollTrigger.refresh()
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      data-section-id="auberge"
      aria-label="Arrivée devant l’Auberge de l’Aveugle"
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

        {/* Vidéo overlay : version "cendres" (auberge animée en loop) révélée
            par clip-path. Poster = Auberge.jpg → zéro flash noir pendant le
            décodage, match cut préservé avec frame_060 T3. Même pattern que
            Section1Hero (Hero.mp4 + poster frame_001). */}
        <video
          ref={aubergeVideoRef}
          src="/home/auberge-scene.mp4"
          poster="/home/Auberge.jpg"
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="aveugle-img aveugle-cendres-img absolute inset-0 h-full w-full object-cover"
          style={{ clipPath: 'inset(0 100% 0 0)' }}
        />

        {/* Note : EmberParticles retirée ici — la fixed du Section1Hero (count=40)
            traverse déjà toutes les sections. Évite le cumul visuel auberge. */}

        {/* Vignette + dégradé bas pour lisibilité des citations + CTA.
            Animation `vignette-breathe` : l'opacité respire (0.82↔1, 6s)
            pour donner vie à l'image fixe. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 motion-safe:animate-vignette-breathe"
          style={{
            background:
              'linear-gradient(180deg, var(--bg-overlay-70) 0%, transparent 25%, transparent 55%, var(--bg-overlay-95) 100%)',
          }}
        />

        <QuoteOverlay containerRef={sectionRef} />

        {/* CTA final — phrase serif + bouton, posés bas pour laisser la vidéo
            cadrer la scène. Outro cinéma, pas page marketing. */}
        <div
          ref={ctaRef}
          className="pointer-events-auto absolute inset-x-0 bottom-[8%] z-[3] flex flex-col items-center px-6 text-center"
          style={{ opacity: 0 }}
        >
          <p
            className="font-serif italic"
            style={{
              fontSize: 'clamp(17px, 1.3vw, 21px)',
              lineHeight: 1.5,
              maxWidth: '38ch',
              marginBottom: 28,
              textShadow: '0 2px 16px rgba(0,0,0,.85)',
            }}
          >
            <AnimatedShinyText variant="gold-soft" shimmerWidth={220}>
              Le feu crépite. Une chandelle attend. Le reste du monde patientera.
            </AnimatedShinyText>
          </p>
          <MagneticButton strength={8}>
            <EmberGlow radius={240}>
              <Button variant="primary" style={{ fontSize: 13, letterSpacing: '0.24em' }}>
                Entrer dans l’auberge
              </Button>
            </EmberGlow>
          </MagneticButton>
        </div>

        <OutroFooter ref={footerRef} />
      </div>
    </section>
  )
}
