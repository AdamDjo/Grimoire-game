'use client'

import { useState } from 'react'

import {
  LandingShell,
  NavigationBar,
  HeroSection,
  UniversSection,
  PersonnageSection,
  CommunauteSection,
} from './_components'

export default function LandingPage() {
  const [selectedPortrait, setSelectedPortrait] = useState(3)

  return (
    <LandingShell>
      <NavigationBar />
      <HeroSection />
      <UniversSection />
      <PersonnageSection
        selectedPortrait={selectedPortrait}
        onSelectPortrait={setSelectedPortrait}
      />
      <CommunauteSection />
    </LandingShell>
  )
}
