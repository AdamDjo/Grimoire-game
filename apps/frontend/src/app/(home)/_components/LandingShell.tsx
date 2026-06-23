'use client'

import { useState, useEffect } from 'react'

import { PageShell } from '@/components/ui/PageShell'
import { SECTION_IDS } from '@/lib/home-data'

import { LandingAmbiance } from './LandingAmbiance'
import { PaginationDot } from './PaginationDot'

export function LandingShell({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    const ids = [...SECTION_IDS]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(ids.indexOf(entry.target.id as (typeof SECTION_IDS)[number]))
          }
        })
      },
      { threshold: 0.5 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <PageShell scrollSnap>
      <LandingAmbiance />

      <nav
        aria-label="Sections de la page"
        className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-[200] flex-col gap-[18px] items-center"
      >
        {SECTION_IDS.map((id, i) => (
          <PaginationDot
            key={id}
            sectionId={id}
            active={activeSection === i}
            onClick={() => {
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        ))}
      </nav>

      {children}
    </PageShell>
  )
}
