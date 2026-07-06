'use client'

import { useRef, useState } from 'react'

import { useLenis } from '@/hooks/use-lenis'
import { ScrollTrigger, gsap, useGSAP } from '@/lib/gsap-init'

import { LANDING_MEDIA } from '../../_data/landing-content'
import { LandingChrome } from '../LandingChrome'
import { SceneBridge } from '../SceneBridge'
import { Section2GameplayProof } from '../Section2GameplayProof'
import { SectionAubergeCta } from '../SectionAubergeCta'
import { SectionHero } from '../SectionHero'

export function LandingExperience() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useLenis()

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap.set('[data-motion="reveal"]', { autoAlpha: 0, y: 26, filter: 'blur(10px)' })
      gsap.set('[data-motion="hero-actions"]', { autoAlpha: 0, y: 18, filter: 'blur(8px)' })
      gsap.utils.toArray<HTMLElement>('[data-motion="title"]').forEach((title) => {
        const lines = title.querySelectorAll('span')

        if (lines.length > 0) {
          gsap.set(title, { autoAlpha: 1, y: 0, filter: 'none' })
          gsap.set(lines, { autoAlpha: 0, y: 34, filter: 'blur(12px)' })
          return
        }

        gsap.set(title, { autoAlpha: 0, y: 34, filter: 'blur(12px)' })
      })

      if (reduceMotion) {
        gsap.set(
          '[data-motion="reveal"], [data-motion="hero-actions"], [data-motion="title"] span, [data-motion="title"]',
          {
            autoAlpha: 1,
            y: 0,
            filter: 'none',
          }
        )
        return
      }

      gsap.to('[data-motion="chrome"]', {
        autoAlpha: 1,
        y: 0,
        duration: 1.25,
        ease: 'expo.out',
      })

      gsap.to('[data-motion="hero-actions"]', {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        delay: 0.62,
        ease: 'expo.out',
      })

      gsap.utils
        .toArray<HTMLElement>(
          '[data-motion="hero"], [data-motion="gameplay"], [data-motion="auberge"]'
        )
        .forEach((section, index) => {
          ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveIndex(index),
            onEnterBack: () => setActiveIndex(index),
          })
        })

      gsap.utils.toArray<HTMLElement>('[data-motion="reveal"]').forEach((element) => {
        gsap.to(element, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.15,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 82%',
            once: true,
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-motion="title"]').forEach((title) => {
        const targets =
          title.querySelectorAll('span').length > 0 ? title.querySelectorAll('span') : title

        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.25,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: title,
            start: 'top 84%',
            once: true,
          },
        })
      })

      const gameplayTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-motion="gameplay"]',
          start: 'top top',
          end: '+=185%',
          pin: true,
          scrub: 0.85,
        },
      })

      gameplayTimeline
        .fromTo(
          '[data-motion="gameplay-card"]',
          { autoAlpha: 0, y: 42, rotate: -9, filter: 'blur(12px)' },
          {
            autoAlpha: 1,
            y: 0,
            rotate: (index) => [-4, -2, -5][index] ?? -4,
            filter: 'blur(0px)',
            stagger: 0.16,
            duration: 0.45,
            ease: 'power3.out',
          },
          0.14
        )
        .fromTo(
          '.gameplay-section__copy',
          { autoAlpha: 0, x: 36, filter: 'blur(12px)' },
          { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 0.42, ease: 'power3.out' },
          0.5
        )
        .fromTo(
          '[data-motion="stats"]',
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.32, ease: 'power3.out' },
          0.72
        )
        .to(
          '[data-motion="gameplay-card"]',
          { autoAlpha: 0, y: -34, filter: 'blur(10px)', duration: 0.16, ease: 'power2.in' },
          0.84
        )
        .to(
          '.gameplay-section__copy',
          { autoAlpha: 0, x: 24, filter: 'blur(10px)', duration: 0.16, ease: 'power2.in' },
          0.87
        )
        .to(
          '[data-motion="stats"]',
          { autoAlpha: 0, y: 26, filter: 'blur(8px)', duration: 0.14, ease: 'power2.in' },
          0.9
        )

      gsap.utils.toArray<HTMLElement>('[data-motion="bridge"]').forEach((bridge) => {
        const bridgeLength = Number(bridge.dataset.bridgeLength) || 145
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bridge,
            start: 'top top',
            end: `+=${bridgeLength}%`,
            pin: true,
            scrub: 0.7,
          },
        })

        tl.fromTo(
          bridge.querySelector('[data-bridge-glow]'),
          { autoAlpha: 0, scale: 0.72 },
          { autoAlpha: 1, scale: 1.12, duration: 0.28, ease: 'power2.out' },
          0.62
        )
          .fromTo(
            bridge.querySelector('[data-bridge-next]'),
            { autoAlpha: 0, scale: 1.04 },
            { autoAlpha: 1, scale: 1, duration: 0.28, ease: 'none' },
            0.72
          )
          .to(
            bridge.querySelector('.frame-sequence'),
            { autoAlpha: 0, duration: 0.18, ease: 'none' },
            0.84
          )
      })

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className="landing-experience">
      <LandingChrome activeIndex={activeIndex} />
      <SectionHero />
      <SceneBridge
        fallbackSrc={LANDING_MEDIA.grimoireFallback}
        frameCount={LANDING_MEDIA.grimoireFrameCount}
        frameDir={LANDING_MEDIA.grimoireFrames}
        id="memoire"
        label="Transition grimoire vers gameplay"
        nextBackgroundSrc={LANDING_MEDIA.gameplayPlate}
        tone="gold"
      />
      <Section2GameplayProof />
      <SceneBridge
        bridgeLength={115}
        fallbackSrc={LANDING_MEDIA.quillFallback}
        frameCount={LANDING_MEDIA.quillFrameCount}
        frameDir={LANDING_MEDIA.quillFrames}
        id="regles"
        label="Transition carte vers auberge"
        nextBackgroundSrc={LANDING_MEDIA.aubergePlate}
        tone="ember"
      />
      <SectionAubergeCta />
    </div>
  )
}
