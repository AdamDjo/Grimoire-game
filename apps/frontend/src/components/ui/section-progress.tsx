'use client'

import { useRef } from 'react'

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap-init'

import './section-progress.css'

interface SectionProgressProps {
  sectionSelector: string
  sectionCount: number
  className?: string
}

export function SectionProgress({
  sectionSelector,
  sectionCount,
  className = '',
}: SectionProgressProps) {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>(sectionSelector, document)
      const fill = rootRef.current?.querySelector<HTMLElement>('.section-progress__fill')
      const markers = gsap.utils.toArray<HTMLElement>('.section-progress__marker', rootRef.current)

      if (sections.length === 0 || !fill || markers.length === 0) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const first = sections[0]
      const last = sections[sections.length - 1]

      const setActive = (marker: HTMLElement) => {
        markers.forEach((otherMarker) => otherMarker.classList.remove('is-active'))
        marker.classList.remove('is-passed')
        marker.classList.add('is-active')
      }

      markers.forEach((marker, index) => {
        const trigger = ScrollTrigger.create({
          trigger: sections[index],
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActive(marker),
          onEnterBack: () => setActive(marker),
          onLeave: () => {
            marker.classList.remove('is-active')
            marker.classList.add('is-passed')
          },
          onLeaveBack: () => {
            marker.classList.remove('is-active')
            marker.classList.remove('is-passed')
          },
        })

        if (trigger.isActive) {
          setActive(marker)
        } else if (trigger.progress >= 1) {
          marker.classList.add('is-passed')
        }
      })

      if (reduceMotion) {
        gsap.set(fill, { scaleY: 1 })
        return
      }

      gsap.set(fill, { scaleY: 0, transformOrigin: 'top' })

      ScrollTrigger.create({
        trigger: first,
        start: 'top center',
        endTrigger: last,
        end: 'bottom center',
        scrub: 0.4,
        onUpdate: (self) => {
          gsap.set(fill, { scaleY: self.progress })
        },
      })
    },
    { scope: rootRef, dependencies: [sectionSelector] }
  )

  return (
    <aside
      ref={rootRef}
      className={`section-progress fixed z-[36] flex flex-col items-center ${className}`}
      aria-label="Progression de la page"
    >
      <span className="section-progress__rail" aria-hidden="true">
        <span className="section-progress__fill" aria-hidden="true" />
      </span>

      <ol className="section-progress__list">
        {Array.from({ length: sectionCount }, (_, index) => (
          <li className="section-progress__marker" key={index}>
            <span
              className="section-progress__diamond [.is-active_&]:animate-gold-pulse"
              aria-hidden="true"
            />
            <span className="section-progress__label">{String(index + 1).padStart(2, '0')}</span>
          </li>
        ))}
      </ol>
    </aside>
  )
}
