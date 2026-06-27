'use client'

import { useEffect, useState } from 'react'

/**
 * useActiveSection — observe les `<section data-section-id>` et retourne l'index
 * de celle qui occupe le plus l'écran. Utilisé par SidePagination pour suivre
 * la section visible pendant le scroll cinématique.
 */
export function useActiveSection(sectionIds: readonly string[]): number {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const nodes = sectionIds
      .map((id) => document.querySelector<HTMLElement>(`[data-section-id="${id}"]`))
      .filter((n): n is HTMLElement => n !== null)

    if (nodes.length === 0) return

    const visibility = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.sectionId
          if (!id) continue
          visibility.set(id, entry.intersectionRatio)
        }

        let bestId = sectionIds[0]
        let bestRatio = -1
        for (const id of sectionIds) {
          const ratio = visibility.get(id) ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        }

        const idx = sectionIds.indexOf(bestId)
        if (idx >= 0) setActiveIndex(idx)
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [sectionIds])

  return activeIndex
}
