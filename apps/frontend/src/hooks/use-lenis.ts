'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

import { gsap, ScrollTrigger } from '@/lib/gsap-init'

interface UseLenisOptions {
  /** Désactive Lenis complètement (par ex. sur pages hors landing). */
  enabled?: boolean
}

/**
 * useLenis — smooth scroll global type Cuberto/Levora, couplé à ScrollTrigger.
 *
 * Skip automatique si :
 *  - `prefers-reduced-motion: reduce`
 *  - pointer coarse (touch) et viewport < 640px (iOS Safari jitter connu)
 *  - `enabled === false`
 *
 * Sur `(home)` uniquement. Ne jamais monter dans les pages app.
 */
export function useLenis({ enabled = true }: UseLenisOptions = {}): void {
  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarseSmall =
      window.matchMedia('(pointer: coarse)').matches &&
      window.matchMedia('(max-width: 639px)').matches

    if (prefersReducedMotion || isCoarseSmall) return

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      syncTouch: true,
    })

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCb)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerCb)
      lenis.destroy()
    }
  }, [enabled])
}
