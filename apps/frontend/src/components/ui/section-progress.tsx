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

      // Active marker = the section whose box currently owns the viewport centre.
      // Reading getBoundingClientRect live (rather than caching per-section
      // ScrollTriggers) is immune to pinned + overlapped sections: pin-spacers
      // shift the real on-screen position, and only the live rect reflects that.
      // A small hysteresis toward the top keeps the first dot lit at scroll 0.
      let currentIndex = -1
      const resolveActiveIndex = () => {
        const centre = window.innerHeight / 2
        let active = 0
        sections.forEach((section, index) => {
          if (section.getBoundingClientRect().top - centre <= 0) active = index
        })
        return active
      }

      const paintMarkers = () => {
        const activeIndex = resolveActiveIndex()
        if (activeIndex === currentIndex) return
        currentIndex = activeIndex
        markers.forEach((marker, index) => {
          marker.classList.toggle('is-active', index === activeIndex)
          marker.classList.toggle('is-passed', index < activeIndex)
        })
      }

      if (reduceMotion) {
        gsap.set(fill, { scaleY: 1 })
        paintMarkers()
        return
      }

      gsap.set(fill, { scaleY: 0, transformOrigin: 'top' })

      // Single document-level driver for both the fill and the marker state:
      // 'max' is recomputed on every ScrollTrigger.refresh() (after pin-spacers
      // are laid out), so the fill reaches 1 exactly at the true bottom and the
      // markers resolve against live layout on each scroll tick.
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        scrub: 0.4,
        onUpdate: (self) => {
          gsap.set(fill, { scaleY: self.progress })
          paintMarkers()
        },
        onRefresh: paintMarkers,
      })

      paintMarkers()
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
