'use client'

import { useEffect, useRef } from 'react'

import { FilmGrain } from '@/components/ui/FilmGrain'
import { GoldCursor } from '@/components/ui/GoldCursor'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { SidePagination } from '@/components/ui/SidePagination'
import { useLenis } from '@/hooks/use-lenis'

import { AmbientAudio } from './_components/AmbientAudio'
import { CinematicTableau } from './_components/CinematicTableau'
import { IntroLoader } from './_components/IntroLoader'
import { Section1Hero } from './_components/Section1Hero'
import { Section3Aveugle } from './_components/Section3Aveugle'
import { KINETIC_LINES, SECTION_IDS } from './_data/home-data'
import { useActiveSection } from './_hooks/use-active-section'

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null)
  const activeIndex = useActiveSection(SECTION_IDS)

  useLenis()

  // Empêche le navigateur de restaurer la position de scroll au refresh —
  // la landing est cinématique, on doit toujours repartir du Hero pour que
  // la timeline GSAP joue dans l'ordre.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  return (
    <main ref={mainRef} className="relative">
      <IntroLoader />
      <FilmGrain />
      <ScrollProgress />
      <GoldCursor />
      <AmbientAudio />
      <SidePagination sections={SECTION_IDS} activeIndex={activeIndex} />

      <Section1Hero />

      {/* Tableau 1 — Cendres de Velkhar.
          Fallback = frame_096 du Hero (match cut natif) tant que les assets
          `frames_cendres/` ne sont pas générés. */}
      <CinematicTableau
        id="cendres"
        ariaLabel="Cendres de Velkhar — tableau cinématique"
        framesDir="/home/frames_cendres"
        frameCount={60}
        kineticLine={KINETIC_LINES.cendres}
        eyebrow="I"
        fallbackImage="/home/frames_transition/frame_096.webp"
        multiTier={false}
      />

      {/* Tableau 2 — L’Artefact. */}
      <CinematicTableau
        id="artefact"
        ariaLabel="L’Artefact — tableau cinématique"
        framesDir="/home/frames_artefact"
        frameCount={60}
        kineticLine={KINETIC_LINES.artefact}
        eyebrow="II"
        fallbackImage="/home/frames_transition/frame_096.webp"
        multiTier={false}
      />

      {/* Tableau 3 — La Nuit avant l’Auberge. */}
      <CinematicTableau
        id="nuit"
        ariaLabel="La Nuit — tableau cinématique"
        framesDir="/home/frames_nuit"
        frameCount={60}
        kineticLine={KINETIC_LINES.nuit}
        eyebrow="III"
        fallbackImage="/home/Auberge.jpg"
        multiTier={false}
      />

      {/* Section 5 — Arrivée devant l'Auberge (ex-Section3Aveugle).
          Le composant garde son nom historique mais data-section-id="auberge". */}
      <Section3Aveugle />
    </main>
  )
}
