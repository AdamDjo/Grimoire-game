'use client'

import { useLenis } from '@/hooks/use-lenis'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap-init'

import { attachCursor, attachReadingBeam } from './landing-atmosphere'
import {
  animateLivingAsh,
  attachMagneticButtons,
  attachPlateParallax,
  attachPointerParallax,
  attachScrollProgress,
  PLATE_SCALE,
  playHeroEntrance,
  revealPlanCopy,
} from './landing-motion-effects'
import {
  attachHeadingResolve,
  attachPlanCounter,
  attachPlanTransition,
  attachSeams,
} from './landing-transitions'
import { createSectionDeck } from './section-deck'

import type { RefObject } from 'react'

const DESKTOP = '(min-width: 1121px) and (min-height: 700px)'
const FLOW = '(max-width: 1120px), (max-height: 699px)'
const REDUCE = '(prefers-reduced-motion: reduce)'
const MOTION = '(prefers-reduced-motion: no-preference)'

/** The camera moves; essential text never fades out or waits for scrub progress. */
export function useLandingMotion(root: RefObject<HTMLDivElement | null>) {
  useLenis()
  useGSAP(
    () => {
      const element = root.current
      if (!element) return
      ScrollTrigger.config({ ignoreMobileResize: true })
      const media = gsap.matchMedia()
      let mounted = true
      let refreshFrame = 0
      const requestRefresh = () => {
        if (!mounted || refreshFrame) return
        refreshFrame = requestAnimationFrame(() => {
          refreshFrame = 0
          if (mounted) ScrollTrigger.refresh()
        })
      }

      const counter = element.querySelector<HTMLElement>('.salt-counter')

      // Every screen: the opening, plates breathing with scroll, copy arriving in reading order.
      media.add(MOTION, () => {
        const plans = gsap.utils.toArray<HTMLElement>('.salt-plan', element)
        const cleanups = [
          playHeroEntrance(element),
          attachScrollProgress(element),
          ...plans.slice(1).map(revealPlanCopy),
          // One shared move at every border: the plate settles, the copy lifts,
          // the heading resolves word by word, a seam is drawn under it.
          attachPlanTransition(element),
          attachSeams(element),
          ...plans.map(attachHeadingResolve),
          counter ? attachPlanCounter(element, counter) : () => undefined,
        ]
        gsap.set('.salt-plan:not(.salt-seuil) .salt-art img', { scale: PLATE_SCALE })
        attachPlateParallax(element, 4)
        // Compositing hints only while a plate is on screen.
        plans.forEach((plan) => {
          const layers = plan.querySelectorAll<HTMLElement>('.salt-art, .salt-art img')
          ScrollTrigger.create({
            trigger: plan,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: ({ isActive }) => {
              layers.forEach((layer) => {
                layer.style.willChange = isActive ? 'transform' : 'auto'
              })
            },
          })
        })
        return () => {
          cleanups.forEach((cleanup) => cleanup())
          element.querySelectorAll<HTMLElement>('.salt-art, .salt-art img').forEach((layer) => {
            layer.style.willChange = ''
          })
        }
      })
      media.add(`${MOTION} and (min-width: 768px)`, () => animateLivingAsh(element))
      media.add(`${MOTION} and (hover: hover) and (pointer: fine)`, () => {
        const beam = element.querySelector<HTMLElement>('.salt-atmosphere__beam')
        const cursor = element.querySelector<HTMLElement>('.salt-cursor')
        const cleanups = [
          attachMagneticButtons(element),
          attachPointerParallax(element),
          beam ? attachReadingBeam(beam) : () => undefined,
          cursor ? attachCursor(cursor) : () => undefined,
        ]
        return () => cleanups.forEach((cleanup) => cleanup())
      })

      media.add({ desktop: DESKTOP, flow: FLOW, reduce: REDUCE }, (context) => {
        if (context.conditions?.reduce) return
        // Below the desktop breakpoint the page scrolls freely; the shared plan
        // transition already carries every section, so nothing extra is staged.
        if (context.conditions?.flow) return

        // The threshold sets the grammar of the whole page: the plate settles,
        // the depth opens, the copy lifts. Every plan then repeats it, so one
        // scroll always reads as the same move.
        gsap
          .timeline({
            scrollTrigger: {
              id: 'salt-threshold',
              trigger: '#velkhar',
              start: 'top top',
              end: '+=22%',
              pin: true,
              scrub: 0.45,
              invalidateOnRefresh: true,
            },
          })
          .to('.salt-seuil .salt-art', { scale: 1.045, yPercent: -1.5, ease: 'none' }, 0)
          .to('.salt-depth', { scaleX: 1.12, yPercent: -3, ease: 'none' }, 0)
          .to('.salt-seuil .salt-copy', { y: -12, ease: 'none' }, 0)

        // One wheel gesture, one plan.
        const deck = createSectionDeck(element)
        return () => deck()
      })

      const decode = async (image: HTMLImageElement) => {
        try {
          await image.decode()
        } catch {
          /* Missing art never blocks reading. */
        }
        requestRefresh()
      }
      const images = Array.from(element.querySelectorAll('img'))
      const onLoad = (event: Event) => {
        void decode(event.currentTarget as HTMLImageElement)
      }
      images.forEach((image) => {
        if (image.complete) void decode(image)
        else image.addEventListener('load', onLoad)
      })
      const fonts = async () => {
        await document.fonts.ready
        requestRefresh()
      }
      void fonts()
      // Demo explanations and translated copy can change height after initial measurement.
      const resize = new ResizeObserver(requestRefresh)
      element.querySelectorAll('.salt-demo, .salt-copy').forEach((node) => resize.observe(node))
      return () => {
        mounted = false
        cancelAnimationFrame(refreshFrame)
        resize.disconnect()
        images.forEach((image) => image.removeEventListener('load', onLoad))
        media.revert()
      }
    },
    { scope: root }
  )
}
