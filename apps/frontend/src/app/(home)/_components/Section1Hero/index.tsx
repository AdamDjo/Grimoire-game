'use client'

import { useRef } from 'react'

import { CompassRose } from '@/components/ui/CompassRose'
import { NavBar } from '@/components/ui/NavBar'
import { ScrollHint } from '@/components/ui/ScrollHint'

import { NAV_LINKS } from '../../_data/home-data'
import { useCanvasScrollSequence } from '../../_hooks/use-canvas-scroll-sequence'
import { useMouseParallax } from '../../_hooks/use-mouse-parallax'
import { EmberParticles } from '../EmberParticles'

import { HeroContent } from './HeroContent'

/**
 * Section1Hero — première section de la landing, hero "méthode Apple".
 *
 * Intro : Hero.mp4 plein écran en loop, sans texte. Dès le premier scroll,
 * la vidéo s'efface, la séquence de 96 frames WebP prend le relais (scrub
 * GSAP) et le texte central se révèle en cascade (CompassRose → slide → CTA).
 * Le texte ressort symétriquement à la fin du scroll, et la dernière frame
 * reste à l'écran pour assurer la continuité visuelle avec Section2Seuil.
 */

const navLogo = (
  <>
    <CompassRose size={28} />
    <span className="text-gradient-gold font-display font-bold uppercase text-[18px] tracking-[0.22em]">
      Grimoire
    </span>
  </>
)

const navLinks = NAV_LINKS.map((label, i) => ({ label, href: '#', active: i === 0 }))

export function Section1Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const compassRoseRef = useRef<HTMLDivElement>(null)
  const slideTextsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useCanvasScrollSequence({
    containerRef,
    canvasRef,
    videoRef,
    textRef,
    scrollHintRef,
    textChildRefs: { compassRose: compassRoseRef, slideTexts: slideTextsRef, cta: ctaRef },
  })

  // Parallax souris — écrit --mx/--my sur le container racine. Les couches
  // enfants utilisent ces vars pour translater à des intensités différentes.
  const parallaxRef = useMouseParallax({ lerp: 0.08 })

  // Compose containerRef (GSAP scrub) + parallaxRef (CSS vars) sur la section.
  const setSectionRef = (el: HTMLElement | null) => {
    containerRef.current = el
    parallaxRef.current = el as HTMLDivElement | null
  }

  return (
    <section
      ref={setSectionRef}
      data-section-id="hero"
      aria-label="Accueil"
      className="relative h-[300vh]"
    >
      {/* Vidéo d'accueil : autoplay loop muet, visible uniquement à l'arrivée,
          puis crossfade vers le canvas dès le premier scroll. */}
      <video
        ref={videoRef}
        src="/home/Hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/home/frames_transition/frame_001.webp"
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[2] h-screen w-full object-cover will-change-[opacity]"
        style={{
          transform:
            'translate3d(calc(var(--mx, 0) * -3px), calc(var(--my, 0) * -3px), 0) scale(1.02)',
        }}
      />

      {/* Canvas frame-by-frame : opacity 0 au départ, fade-in pendant l'intro. */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[3] h-screen w-full"
        style={{
          opacity: 0,
          transform:
            'translate3d(calc(var(--mx, 0) * -3px), calc(var(--my, 0) * -3px), 0) scale(1.02)',
        }}
      />

      {/* Braises dorées flottantes — couche atmosphérique sous l'overlay. */}
      <EmberParticles variant="gold" count={40} position="fixed" zIndex={4} />

      {/* Overlay dégradé pour la lisibilité du texte. */}
      <div
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{
          background:
            'linear-gradient(180deg, var(--bg-overlay-55) 0%, transparent 18%, transparent 80%, var(--bg-overlay-50) 100%)',
        }}
      />

      <NavBar logo={navLogo} links={navLinks} />

      {/* Bloc central : caché à l'arrivée (opacity 0 + blur), révélé au scroll. */}
      <div
        ref={textRef}
        className="pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity: 0, filter: 'blur(8px)', transform: 'translateY(24px)' }}
      >
        <HeroContent
          childRefs={{
            compassRose: compassRoseRef,
            slideTexts: slideTextsRef,
            cta: ctaRef,
          }}
        />
      </div>

      <ScrollHint ref={scrollHintRef} />
    </section>
  )
}
