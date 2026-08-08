'use client'

import { useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap-init'
import { cn } from '@/lib/utils'

import type { ComponentPropsWithoutRef } from 'react'

import './velkhar-motion-shell.css'

interface VelkharMotionShellProps extends ComponentPropsWithoutRef<'main'> {
  animateEntrance?: boolean
}

export function VelkharMotionShell({
  animateEntrance = false,
  children,
  className,
  ...props
}: VelkharMotionShellProps) {
  const rootRef = useRef<HTMLElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const curtain = curtainRef.current
      if (!root || !curtain) return undefined

      if (!animateEntrance) {
        gsap.set(curtain, { autoAlpha: 0 })
        return undefined
      }

      const scene = root.querySelector<HTMLElement>('[data-velkhar-scene]')
      const frame = root.querySelector<HTMLElement>('[data-velkhar-frame]')
      const entranceItems = gsap.utils.toArray<HTMLElement>('[data-velkhar-enter]', root)
      const media = gsap.matchMedia()

      media.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const reduceMotion = Boolean(context.conditions?.reduceMotion)

          if (reduceMotion) {
            gsap.set(curtain, { autoAlpha: 0 })
            return
          }

          const timeline = gsap.timeline({
            defaults: { ease: 'power3.out' },
          })

          timeline
            .set(curtain, { autoAlpha: 1 })
            .to(curtain, { autoAlpha: 0, duration: 0.48, ease: 'power2.out' }, 0)

          if (scene) {
            timeline.fromTo(
              scene,
              { scale: 1.035 },
              { clearProps: 'transform', duration: 1.05, scale: 1.015 },
              0
            )
          }

          if (frame) {
            timeline.fromTo(
              frame,
              { autoAlpha: 0, y: 12 },
              {
                autoAlpha: 1,
                clearProps: 'transform,opacity,visibility',
                duration: 0.56,
                y: 0,
              },
              0.14
            )
          }

          if (entranceItems.length > 0) {
            timeline.fromTo(
              entranceItems,
              { autoAlpha: 0, y: 10 },
              {
                autoAlpha: 1,
                clearProps: 'transform,opacity,visibility',
                duration: 0.52,
                stagger: 0.07,
                y: 0,
              },
              0.22
            )
          }
        }
      )

      return () => media.revert()
    },
    { dependencies: [animateEntrance], revertOnUpdate: true, scope: rootRef }
  )

  return (
    <main ref={rootRef} className={cn('velkhar-motion-shell', className)} {...props}>
      {children}
      <div ref={curtainRef} className="velkhar-motion-curtain" aria-hidden="true" />
    </main>
  )
}
