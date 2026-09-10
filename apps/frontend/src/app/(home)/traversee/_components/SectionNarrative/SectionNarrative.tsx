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
          <ol className="cross-proof-flow" aria-label={copy.proofFlowLabel} data-cross-proof-flow>
            {copy.proofFlow.map((step, index) => (
              <li key={step.label} data-cross-proof-step>
                <span className="cross-proof-flow__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="cross-proof-flow__content">
                  <span className="cross-proof-flow__label">{step.label}</span>
                  <span className="cross-proof-flow__text">{step.text}</span>
                </span>
                {'outcome' in step ? (
                  <strong className="cross-proof-flow__outcome" data-cross-proof-outcome>
                    {step.outcome}
                  </strong>
                ) : null}
              </li>
            ))}
          </ol>
          <GameLink variant="landing" href={beginHref}>
            {copy.continue}
            <ArrowRight size={18} aria-hidden="true" />
          </GameLink>
        </div>
      </article>

      <ul className="cross-proof-points" aria-label={copy.proofPointsLabel} data-cross-reveal>
        {copy.proofPoints.map((point, index) => (
          <li key={point}>
            <span aria-hidden="true">0{index + 1}</span>
            {point}
          </li>
        ))}
      </ul>
    </section>
  )
}
