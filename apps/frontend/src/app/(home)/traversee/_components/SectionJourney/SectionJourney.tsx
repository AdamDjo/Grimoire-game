import { ArrowDown, ArrowRight } from 'lucide-react'
import Image from 'next/image'

import { GameLink } from '@/components/ui/game-link'

import { CROSSING_MEDIA } from '../../_data/crossing-content'

import type { CrossingCopy } from '../../_data/crossing-content'
import type { CSSProperties } from 'react'

import './section-journey.css'

interface SectionJourneyProps {
  beginHref: string
  copy: CrossingCopy
  hasActiveChronicle: boolean
}

export function SectionJourney({ beginHref, copy, hasActiveChronicle }: SectionJourneyProps) {
  return (
    <div className="cross-journey" data-cross-journey>
      <link
        rel="preload"
        as="image"
        href={CROSSING_MEDIA.journeyMobile}
        media="(max-width: 760px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={CROSSING_MEDIA.journey}
        media="(min-width: 761px)"
        fetchPriority="high"
      />
      <picture className="cross-journey__art" aria-hidden="true" data-cross-journey-art>
        <source media="(max-width: 760px)" srcSet={CROSSING_MEDIA.journeyMobile} />
        <Image
          src={CROSSING_MEDIA.journey}
          alt=""
          width={1800}
          height={2400}
          loading="eager"
          fetchPriority="high"
          unoptimized
        />
      </picture>
      <div className="cross-journey__vignette" aria-hidden="true" />
      <div className="cross-journey__glow" aria-hidden="true" data-cross-portal-glow />
      <div className="cross-embers" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <i key={index} style={{ '--particle': index } as CSSProperties} />
        ))}
      </div>

      <section className="cross-hero" aria-labelledby="cross-title">
        <div className="cross-hero__copy" data-cross-hero-copy>
          <h1 id="cross-title">
            {copy.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p>{copy.intro}</p>
          <GameLink variant="landing" size="lg" href={beginHref}>
            {hasActiveChronicle ? copy.resume : copy.play}
            <ArrowRight size={20} aria-hidden="true" />
          </GameLink>
          <a className="cross-text-link" href="#passage">
            {copy.discover}
            <ArrowDown size={16} aria-hidden="true" />
          </a>
          <span className="cross-meta">{copy.meta}</span>
        </div>
      </section>

      <section className="cross-passage" id="passage" aria-labelledby="cross-passage-title">
        <div className="cross-passage__copy" data-cross-reveal>
          <h2 id="cross-passage-title">
            {copy.passage.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p>{copy.situation}</p>
          <span className="cross-gold-rule" aria-hidden="true" />
        </div>
      </section>
    </div>
  )
}
