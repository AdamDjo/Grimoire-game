'use client'

import { PaginationDot } from './PaginationDot'

interface SidePaginationProps {
  sections: readonly string[]
  activeIndex: number
  ariaLabel?: string
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
        <PaginationDot key={id} sectionId={id} active={activeIndex === i} />
      ))}
    </nav>
  )
}
