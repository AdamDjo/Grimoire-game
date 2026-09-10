import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { GameLink } from '@/components/ui/game-link'

import { CROSSING_MEDIA } from '../../_data/crossing-content'

import type { CrossingCopy } from '../../_data/crossing-content'

import './section-inn.css'

interface SectionInnProps {
  beginHref: string
  copy: CrossingCopy
  hasActiveChronicle: boolean
}

export function SectionInn({ beginHref, copy, hasActiveChronicle }: SectionInnProps) {
  return (
    <section className="cross-inn" id="auberge" aria-labelledby="cross-inn-title">
      <Image
        className="cross-inn__art"
        src={CROSSING_MEDIA.inn}
        alt=""
        fill
        sizes="100vw"
        data-cross-inn-art
      />
      <div className="cross-inn__light" aria-hidden="true" />
      <div className="cross-inn__copy" data-cross-reveal>
        <span className="cross-eyebrow">{copy.innLabel}</span>
        <h2 id="cross-inn-title">{copy.innTitle}</h2>
        <p>{copy.innBody}</p>
        <GameLink variant="landing" size="lg" href={beginHref}>
          {hasActiveChronicle ? copy.resume : copy.enter}
          <ArrowRight size={20} aria-hidden="true" />
        </GameLink>
        <Link className="cross-text-link" href="/dashboard">
          {copy.chronicle}
        </Link>
      </div>
    </section>
  )
}
