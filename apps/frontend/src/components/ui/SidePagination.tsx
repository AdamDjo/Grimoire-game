'use client'

import { PaginationDot } from './PaginationDot'

interface SidePaginationProps {
  sections: readonly string[]
  activeIndex: number
  ariaLabel?: string
}

/**
 * Scroll vers une section identifiée par `data-section-id`.
 * Utilise `window.scrollTo` — intercepté par Lenis pour un scroll fluide.
 */
function scrollToSection(sectionId: string) {
  const target = document.querySelector(`[data-section-id="${sectionId}"]`)
  if (!target) return
  const top = (target as HTMLElement).getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top, behavior: 'smooth' })
}

export function SidePagination({
  sections,
  activeIndex,
  ariaLabel = 'Sections de la page',
}: SidePaginationProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-[200] flex-col gap-[18px] items-center"
    >
      {sections.map((id, i) => (
        <PaginationDot
          key={id}
          sectionId={id}
          active={activeIndex === i}
          onClick={() => scrollToSection(id)}
        />
      ))}
    </nav>
  )
}
