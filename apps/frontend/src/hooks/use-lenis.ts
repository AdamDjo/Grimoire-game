'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

import { ScrollTrigger, gsap } from '@/lib/gsap-init'

// Singleton module-level : une seule instance Lenis vit à la fois (le hook n'est
// monté qu'une fois par LandingExperience). Les consommateurs hors React
// (MobileMenu, interception d'ancres) lisent l'instance active via getLenis().
// null en reduced-motion → les appelants retombent sur le scroll natif.
let activeLenis: Lenis | null = null

export function getLenis(): Lenis | null {
  return activeLenis
}

export function useLenis() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (time) => 1 - Math.pow(1 - time, 3),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    })

    activeLenis = lenis

    const updateScrollTrigger = () => {
      ScrollTrigger.update()
    }

    lenis.on('scroll', updateScrollTrigger)

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.off('scroll', updateScrollTrigger)
      lenis.destroy()
      if (activeLenis === lenis) {
        activeLenis = null
      }
    }
  }, [])
}
