import { gsap, useGSAP } from '@/lib/gsap-init'

import type { RefObject } from 'react'

export function useLandingHeroEntrance(
  rootRef: RefObject<HTMLDivElement | null>,
  preloaderDone: boolean
) {
  useGSAP(
    () => {
      if (!preloaderDone) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const hero = rootRef.current?.querySelector<HTMLElement>('[data-motion="hero"]')
      const heroReveals = hero
        ? gsap.utils.toArray<HTMLElement>(hero.querySelectorAll('[data-motion="reveal"]'))
        : []
      const heroTitleLines = hero
        ? gsap.utils.toArray<HTMLElement>(hero.querySelectorAll('[data-motion="title"] span'))
        : []

      if (reduceMotion) {
        gsap.set(
          '[data-motion="chrome"], [data-motion="hero-actions"], [data-motion="hero"] [data-motion="reveal"], [data-motion="hero"] [data-motion="title"] span',
          { autoAlpha: 1, y: 0 }
        )
        return
      }

      const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } })

      timeline
        .to(heroTitleLines, { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.14 }, 0)
        .to(heroReveals, { autoAlpha: 1, y: 0, duration: 1.15, stagger: 0.12 }, 0.15)
        .to('[data-motion="chrome"]', { autoAlpha: 1, y: 0, duration: 1.25 }, 0.1)
        .to('[data-motion="hero-actions"]', { autoAlpha: 1, y: 0, duration: 1 }, 0.55)
        .to('[data-hero-scroll-hint]', { opacity: 1, duration: 0.9 }, 0.9)
    },
    { scope: rootRef, dependencies: [preloaderDone], revertOnUpdate: true }
  )
}
