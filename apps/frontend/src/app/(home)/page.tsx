'use client'

import { useRef } from 'react'

import { SidePagination } from '@/components/ui/SidePagination'

import { Section1Hero } from './_components/Section1Hero'
import { Section2Seuil } from './_components/Section2Seuil'
import { Section3Aveugle } from './_components/Section3Aveugle'
import { Section4Pacte } from './_components/Section4Pacte'
import { Section5Footer } from './_components/Section5Footer'
import { SECTION_IDS } from './_data/home-data'
import { useActiveSection } from './_hooks/use-active-section'

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null)
  const activeIndex = useActiveSection(SECTION_IDS)

  return (
    <main ref={mainRef} className="relative">
      <SidePagination sections={SECTION_IDS} activeIndex={activeIndex} />

      <Section1Hero />
      <Section2Seuil />
      <Section3Aveugle />
      <Section4Pacte />
      <Section5Footer />
    </main>
  )
}
