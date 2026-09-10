'use client'

import { ArrowRight, Pause, Play } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { WORLD_ROUTES } from '@/config/worlds'

import { CROSSING_COPY } from '../../_data/crossing-content'
import { CrossingNavigation } from '../CrossingNavigation/CrossingNavigation'
import { SectionInn } from '../SectionInn/SectionInn'
import { SectionJourney } from '../SectionJourney/SectionJourney'
import { SectionNarrative } from '../SectionNarrative/SectionNarrative'

import './crossing-experience.css'

const CrossingMotionRuntime = dynamic(
  () => import('./CrossingMotionRuntime').then((module) => module.CrossingMotionRuntime),
  { ssr: false }
)

interface CrossingExperienceProps {
  english: boolean
  resumeHref?: string
}

export function CrossingExperience({ english, resumeHref }: CrossingExperienceProps) {
  const copy = CROSSING_COPY[english ? 'en' : 'fr']
  const root = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [motionReady, setMotionReady] = useState(false)
  const beginHref = resumeHref ?? WORLD_ROUTES.velkhar.aveugle
  const hasActiveChronicle = Boolean(resumeHref)

  useEffect(() => {
    let idleId: number | undefined
    let fallbackId: ReturnType<typeof setTimeout> | undefined

    const enableMotion = () => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(() => setMotionReady(true), { timeout: 1200 })
        return
      }

      fallbackId = setTimeout(() => setMotionReady(true), 200)
    }

    if (document.readyState === 'complete') enableMotion()
    else window.addEventListener('load', enableMotion, { once: true })

    return () => {
      window.removeEventListener('load', enableMotion)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (fallbackId !== undefined) clearTimeout(fallbackId)
    }
  }, [])

  return (
    <div className="crossing" ref={root} data-paused={paused}>
      {motionReady ? <CrossingMotionRuntime root={root} paused={paused} /> : null}
      <a className="cross-skip" href="#traversee-content">
        {copy.skip}
      </a>
      <div className="cross-progress" aria-hidden="true" />
      <CrossingNavigation
        beginHref={beginHref}
        copy={copy}
        hasActiveChronicle={hasActiveChronicle}
      />

      <main id="traversee-content">
        <SectionJourney beginHref={beginHref} copy={copy} hasActiveChronicle={hasActiveChronicle} />
        <SectionNarrative beginHref={beginHref} copy={copy} />
        <SectionInn beginHref={beginHref} copy={copy} hasActiveChronicle={hasActiveChronicle} />
      </main>

      <footer className="cross-footer">
        <Link href="/">GRIMOIRE © 2026</Link>
        <span>{copy.created}</span>
        <a href="https://github.com/AdamDjo/Grimoire-game">
          GitHub <ArrowRight size={14} aria-hidden="true" />
        </a>
      </footer>

      <button
        className="cross-pause"
        type="button"
        aria-label={paused ? copy.unpause : copy.pause}
        aria-pressed={paused}
        onClick={() => setPaused((isPaused) => !isPaused)}
      >
        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>
    </div>
  )
}
