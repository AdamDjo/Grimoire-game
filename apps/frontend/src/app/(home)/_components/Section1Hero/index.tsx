'use client'

import { useRef, useState } from 'react'

import { CompassRose } from '@/components/ui/CompassRose'
import { NavBar } from '@/components/ui/NavBar'
import { ScrollHint } from '@/components/ui/ScrollHint'
import { SidePagination } from '@/components/ui/SidePagination'

import { NAV_LINKS, SECTION_IDS } from '../../_data/home-data'
import { useCanvasScrollSequence } from '../../_hooks/use-canvas-scroll-sequence'

import { HeroContent } from './HeroContent'

/**
 * Section1Hero — première section de la landing, hero "méthode Apple".
 *
 * Une séquence de 96 frames WebP est dessinée dans un <canvas> en fonction de
 * la progression du scroll (scrub GSAP). Le bloc central (HeroContent) fait un
 * fade-out vers ~30 % du scroll pour laisser apprécier l'animation seule.
 *
 * Ce composant se limite à la composition + wiring du hook de séquence.
 */

/** Logo identique à la landing (CompassRose + "Grimoire"). */
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

  // Section active pour la pagination (le hero correspond à l'index 0).
  const [activeSection] = useState(0)

  useCanvasScrollSequence({
    containerRef,
    canvasRef,
    fadeTargetRefs: [textRef, scrollHintRef],
  })

  return (
    <section ref={containerRef} aria-label="Accueil" className="relative h-[300vh]">
      {/* Couche fond : séquence d'images (décorative).
          z-[1] : au-dessus de la texture "grain bois" globale (body::before, z-0). */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[1] h-screen w-full"
      />

      {/* Overlay dégradé linéaire pour la lisibilité du texte. */}
      <div
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          background:
            'linear-gradient(180deg, var(--bg-overlay-55) 0%, transparent 18%, transparent 68%, var(--bg-overlay-95) 100%)',
        }}
      />

      {/* Header — logo + nav. */}
      <NavBar logo={navLogo} links={navLinks} />

      {/* Pagination latérale. */}
      <SidePagination sections={SECTION_IDS} activeIndex={activeSection} />

      {/* Bloc central : fade-out au scroll (ref transmise au hook via textRef). */}
      <div
        ref={textRef}
        className="pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
      >
        <HeroContent />
      </div>

      {/* Scroll hint : disparaît avec le texte (ref transmise au hook). */}
      <ScrollHint ref={scrollHintRef} />
    </section>
  )
}
