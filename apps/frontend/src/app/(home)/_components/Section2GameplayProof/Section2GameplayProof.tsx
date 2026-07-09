import { Button, Card, MediaLayer } from '@/components/ui'

import { GAMEPLAY_CARDS, GAMEPLAY_COPY, LANDING_MEDIA } from '../../_data/landing-content'

import { GameplayStatsBar } from './GameplayStatsBar'

import './section-gameplay.css'

export function Section2GameplayProof() {
  return (
    <section className="landing-section gameplay-section" id="gameplay" data-motion="gameplay">
      <MediaLayer
        fallbackSrc={LANDING_MEDIA.gameplayPlate}
        fallbackSrcWebp={LANDING_MEDIA.gameplayPlateWebp}
        poster={LANDING_MEDIA.gameplayPlate}
        videoSrc={LANDING_MEDIA.gameplayVideo ?? undefined}
      />
      <div
        className="gameplay-section__veil absolute inset-0 z-[5]"
        data-gameplay-veil
        aria-hidden="true"
      />

      <div className="gameplay-section__cards relative z-[2] grid gap-[18px] self-center">
        {GAMEPLAY_CARDS.map((card) => (
          <Card key={card.index} {...card} />
        ))}
      </div>

      <div className="gameplay-section__copy relative z-[3] self-center opacity-0">
        <p className="gameplay-section__label grid gap-1" data-motion="reveal">
          <span>{GAMEPLAY_COPY.section}</span>
          <strong className="font-medium text-parchment">{GAMEPLAY_COPY.label}</strong>
        </p>
        <h2 className="m-0 font-accent text-h2 font-medium text-parchment" data-motion="title">
          {GAMEPLAY_COPY.titleLines.map((line, index) => (
            <span
              key={line}
              className={`block ${index === GAMEPLAY_COPY.titleLines.length - 1 ? 'text-gold-soft' : ''}`}
            >
              {line}
            </span>
          ))}
        </h2>
        <div
          className="gameplay-section__body text-body-editorial text-[rgba(239,225,194,0.86)]"
          data-motion="reveal"
        >
          {GAMEPLAY_COPY.body.map((line) => (
            <p key={line} className="m-0">
              {line}
            </p>
          ))}
        </div>
        <div data-motion="reveal">
          <Button className="button--gameplay" data-magnetic href="/signup">
            {GAMEPLAY_COPY.cta}
          </Button>
        </div>
      </div>

      <GameplayStatsBar />
    </section>
  )
}
