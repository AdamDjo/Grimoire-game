'use client'

import { useEffect, useState } from 'react'

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number
  connection?: { effectiveType?: string; saveData?: boolean }
}

/**
 * useHighPerformanceMode — retourne `false` si l'appareil est trop faible pour
 * les tableaux cinématiques (60 frames × 3 séquences).
 *
 * Critères de déclassement :
 *  - `hardwareConcurrency < 4` (CPU faible)
 *  - `deviceMemory < 4` (mémoire faible, Chrome/Android uniquement)
 *  - connection `2g` / `slow-2g` ou `saveData: true`
 *  - `prefers-reduced-motion: reduce`
 *
 * Retourne `true` par défaut en SSR (on suppose desktop) — la vérification
 * définitive se fait au mount, donc si false → fallback graceful (image
 * fixe + texte statique) après hydratation.
 */
export function useHighPerformanceMode(): boolean {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const nav = navigator as NavigatorWithMemory
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowCpu = (nav.hardwareConcurrency ?? 8) < 4
    const lowMem = nav.deviceMemory !== undefined && nav.deviceMemory < 4
    const slowNet =
      !!nav.connection &&
      (nav.connection.effectiveType === '2g' ||
        nav.connection.effectiveType === 'slow-2g' ||
        nav.connection.saveData === true)

    setEnabled(!reduce && !lowCpu && !lowMem && !slowNet)
  }, [])

  return enabled
}
