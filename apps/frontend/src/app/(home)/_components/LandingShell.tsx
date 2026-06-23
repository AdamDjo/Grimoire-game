'use client'

import { useState, useEffect } from 'react'

import { PageShell } from '@/components/ui/PageShell'
import { SECTION_IDS } from '@/lib/home-data'

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
      <nav
        aria-label="Sections de la page"
        style={{
          position: 'fixed',
          right: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          alignItems: 'center',
        }}
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
