import { Button, Card, MediaLayer } from '@/components/ui'

import { GAMEPLAY_CARDS, GAMEPLAY_COPY, LANDING_MEDIA } from '../../_data/landing-content'

import { GameplayStatsBar } from './GameplayStatsBar'

import './section-gameplay.css'

export function Section2GameplayProof() {
  return (
    <section className="landing-section gameplay-section" id="gameplay" data-motion="gameplay">
      <MediaLayer
        fallbackSrc={LANDING_MEDIA.gameplayPlate}
        poster={LANDING_MEDIA.gameplayPlate}
        videoSrc={LANDING_MEDIA.gameplayVideo ?? undefined}
      />

      <div className="gameplay-section__cards">
        {GAMEPLAY_CARDS.map((card) => (
          <Card key={card.index} {...card} />
        ))}
      </div>

      <div className="gameplay-section__copy">
        <p className="gameplay-section__label" data-motion="reveal">
          <span>{GAMEPLAY_COPY.section}</span>
          <strong>{GAMEPLAY_COPY.label}</strong>
        </p>
        <h2 data-motion="title">
          {GAMEPLAY_COPY.titleLines.map((line, index) => (
            <span
              key={line}
              className={index === GAMEPLAY_COPY.titleLines.length - 1 ? 'is-gold' : undefined}
            >
              {line}
            </span>
          ))}
        </h2>
        <div className="gameplay-section__body" data-motion="reveal">
          {GAMEPLAY_COPY.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div data-motion="reveal">
          <Button className="button--gameplay" href="/signup">
            {GAMEPLAY_COPY.cta}
          </Button>
        </div>
      </div>

      <GameplayStatsBar />
    </section>
  )
}
