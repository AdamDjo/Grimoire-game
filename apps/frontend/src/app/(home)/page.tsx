'use client'

import { useRef } from 'react'

import { FilmGrain } from '@/components/ui/FilmGrain'
import { GoldCursor } from '@/components/ui/GoldCursor'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { SidePagination } from '@/components/ui/SidePagination'

import { AmbientAudio } from './_components/AmbientAudio'
import { IntroLoader } from './_components/IntroLoader'
import { Section1Hero } from './_components/Section1Hero'
import { Section2Seuil } from './_components/Section2Seuil'
import { Section3Aveugle } from './_components/Section3Aveugle'
import { SECTION_IDS } from './_data/home-data'
import { useActiveSection } from './_hooks/use-active-section'

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null)
  const activeIndex = useActiveSection(SECTION_IDS)

  return (
    <main ref={mainRef} className="relative">
      <IntroLoader />
      <FilmGrain />
      <ScrollProgress />
      <GoldCursor />
      <AmbientAudio />
      <SidePagination sections={SECTION_IDS} activeIndex={activeIndex} />
      <Section1Hero />
      <Section2Seuil />
      <Section3Aveugle />
    </main>
  )
}
