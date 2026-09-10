import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

import { GameLink } from '@/components/ui/game-link'

import { CROSSING_MEDIA } from '../../_data/crossing-content'

import type { CrossingCopy } from '../../_data/crossing-content'

import './section-narrative.css'

interface SectionNarrativeProps {
  beginHref: string
  copy: CrossingCopy
}

export function SectionNarrative({ beginHref, copy }: SectionNarrativeProps) {
  return (
    <section className="cross-narrative" id="apercu" aria-labelledby="cross-proof-title">
      <header className="cross-narrative__intro" data-cross-reveal>
        <h2 id="cross-proof-title">{copy.proof}</h2>
        <p>{copy.proofBody}</p>
      </header>

      <article className="cross-narrative__frame" data-cross-frame>
        <div className="cross-narrative__art" data-cross-frame-art>
          <Image
            src={CROSSING_MEDIA.narrative}
            alt=""
            fill
            sizes="(max-width: 760px) 100vw, 52vw"
          />
          <span aria-hidden="true">
            GRIMOIRE <i>—</i> OF ASH AND SALT
          </span>
        </div>
        <div className="cross-narrative__copy" data-cross-reveal>
          <span className="cross-eyebrow">{copy.previewLabel}</span>
          <h3>{copy.previewTitle}</h3>
          <p>{copy.previewBody}</p>
          <GameLink variant="landing" href={beginHref}>
            {copy.continue}
            <ArrowRight size={18} aria-hidden="true" />
          </GameLink>
        </div>
      </article>
    </section>
  )
}
