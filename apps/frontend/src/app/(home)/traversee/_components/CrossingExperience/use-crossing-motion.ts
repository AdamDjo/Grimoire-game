'use client'

import { useLenis } from '@/hooks/use-lenis'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap-init'

import type { RefObject } from 'react'

const MOTION = '(prefers-reduced-motion: no-preference)'
const DESKTOP_MOTION = '(min-width: 900px) and (prefers-reduced-motion: no-preference)'

/** Keeps all continuous motion on compositor-friendly transforms and opacity. */
export function useCrossingMotion(root: RefObject<HTMLDivElement | null>, paused: boolean) {
  useLenis()

  useGSAP(
    () => {
      const page = root.current
      if (!page || paused) return

      ScrollTrigger.config({ ignoreMobileResize: true })
      const media = gsap.matchMedia()

      media.add(MOTION, () => {
        const nav = page.querySelector<HTMLElement>('[data-cross-nav]')
        const progress = page.querySelector<HTMLElement>('.cross-progress')
        const heroLines = page.querySelectorAll<HTMLElement>('.cross-hero__copy h1 span')

        if (progress) {
          gsap.to(progress, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: page,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          })
        }

        if (nav) {
          gsap.to(nav, {
            backgroundColor: 'rgba(8, 9, 8, 0.92)',
            paddingTop: 16,
            paddingBottom: 16,
            ease: 'none',
            scrollTrigger: {
              trigger: page,
              start: 'top top',
              end: '180px top',
              scrub: 0.4,
            },
          })
        }

        gsap.from(heroLines, {
          y: 24,
          autoAlpha: 0,
          duration: 1.15,
          stagger: 0.1,
          ease: 'power3.out',
        })

        page.querySelectorAll<HTMLElement>('[data-cross-reveal]').forEach((element) => {
          gsap.from(element, {
            y: 34,
            autoAlpha: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          })
        })

        const frame = page.querySelector<HTMLElement>('[data-cross-frame]')
        if (frame) {
          gsap.from(frame, {
            y: 44,
            scale: 0.975,
            duration: 1.25,
            ease: 'power3.out',
            scrollTrigger: { trigger: frame, start: 'top 90%', once: true },
          })
        }

        const rule = page.querySelector<HTMLElement>('.cross-gold-rule')
        if (rule) {
          gsap.from(rule, {
            scaleX: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: rule, start: 'top 92%', once: true },
          })
        }
      })

      media.add(DESKTOP_MOTION, () => {
        const journey = page.querySelector<HTMLElement>('[data-cross-journey]')
        const journeyArt = page.querySelector<HTMLElement>('[data-cross-journey-art]')
        const heroCopy = page.querySelector<HTMLElement>('[data-cross-hero-copy]')
        const portalGlow = page.querySelector<HTMLElement>('[data-cross-portal-glow]')
        const narrative = page.querySelector<HTMLElement>('.cross-narrative')
        const narrativeArt = page.querySelector<HTMLElement>('[data-cross-frame-art]')
        const inn = page.querySelector<HTMLElement>('.cross-inn')
        const innArt = page.querySelector<HTMLElement>('[data-cross-inn-art]')

        if (journey && journeyArt) {
          gsap.fromTo(
            journeyArt,
            { y: 0, scale: 1 },
            {
              y: -74,
              scale: 1.045,
              transformOrigin: '50% 38%',
              ease: 'none',
              scrollTrigger: {
                trigger: journey,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.7,
              },
            }
          )
        }

        if (heroCopy) {
          gsap.to(heroCopy, {
            y: -52,
            autoAlpha: 0.18,
            ease: 'none',
            scrollTrigger: {
              trigger: heroCopy,
              start: 'center center',
              end: 'bottom top',
              scrub: 0.55,
            },
          })
        }

        if (portalGlow) {
          gsap.to(portalGlow, {
            y: 120,
            scaleX: 0.72,
            opacity: 0.16,
            ease: 'none',
            scrollTrigger: {
              trigger: journey,
              start: 'top top',
              end: '55% top',
              scrub: 0.6,
            },
          })
        }

        if (narrative && narrativeArt) {
          gsap.fromTo(
            narrativeArt,
            { yPercent: -2.5 },
            {
              yPercent: 2.5,
              ease: 'none',
              scrollTrigger: {
                trigger: narrative,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.65,
              },
            }
          )
        }

        if (inn && innArt) {
          gsap.fromTo(
            innArt,
            { yPercent: -4, scale: 1.06 },
            {
              yPercent: 4,
              scale: 1.02,
              ease: 'none',
              scrollTrigger: {
                trigger: inn,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.7,
              },
            }
          )
        }
      })

      const refresh = () => ScrollTrigger.refresh()
      const images = page.querySelectorAll('img')
      images.forEach((image) => image.addEventListener('load', refresh, { once: true }))
      document.fonts.addEventListener('loadingdone', refresh)

      return () => {
        media.revert()
        images.forEach((image) => image.removeEventListener('load', refresh))
        document.fonts.removeEventListener('loadingdone', refresh)
      }
    },
    { scope: root, dependencies: [paused], revertOnUpdate: true }
  )
}
