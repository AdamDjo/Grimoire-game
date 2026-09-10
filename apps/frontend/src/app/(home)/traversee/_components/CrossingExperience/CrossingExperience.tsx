'use client'

import { ArrowRight, Pause, Play } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'

import { WORLD_ROUTES } from '@/config/worlds'

import { CROSSING_COPY } from '../../_data/crossing-content'
import { CrossingNavigation } from '../CrossingNavigation/CrossingNavigation'
import { SectionInn } from '../SectionInn/SectionInn'
import { SectionJourney } from '../SectionJourney/SectionJourney'
import { SectionNarrative } from '../SectionNarrative/SectionNarrative'

import { useCrossingMotion } from './use-crossing-motion'

import './crossing-experience.css'

interface CrossingExperienceProps {
  english: boolean
  resumeHref?: string
}

export function CrossingExperience({ english, resumeHref }: CrossingExperienceProps) {
  const copy = CROSSING_COPY[english ? 'en' : 'fr']
  const root = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const beginHref = resumeHref ?? WORLD_ROUTES.velkhar.aveugle
  const hasActiveChronicle = Boolean(resumeHref)

  useCrossingMotion(root, paused)

  return (
    <div className="crossing" ref={root} data-paused={paused}>
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
