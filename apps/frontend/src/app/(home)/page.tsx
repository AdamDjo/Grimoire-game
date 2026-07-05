'use client'

import { useEffect, useRef } from 'react'

import { FilmGrain } from '@/components/ui/FilmGrain'
import { GoldCursor } from '@/components/ui/GoldCursor'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { SidePagination } from '@/components/ui/SidePagination'
import { useLenis } from '@/hooks/use-lenis'

import { AmbientAudio } from './_components/AmbientAudio'
import { IntroLoader } from './_components/IntroLoader'
import { Section1Hero } from './_components/Section1Hero'
import { Section2Triptyque } from './_components/Section2Triptyque'
import { Section3Aveugle } from './_components/Section3Aveugle'
import { SECTION_IDS } from './_data/home-data'
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

      {/* Section 2 — Le Triptyque. Trois plaques en accordéon (Mémoire / MJ /
          Velkhar) révélées au scroll sur frame_060 + bandeau de promesse.
          Remplace l'ancien carrousel cinématique (CinematicChapterRail). */}
      <Section2Triptyque />

      {/* Section 5 — Arrivée devant l'Auberge (ex-Section3Aveugle).
          Le composant garde son nom historique mais data-section-id="auberge". */}
      <Section3Aveugle />
    </main>
  )
}
