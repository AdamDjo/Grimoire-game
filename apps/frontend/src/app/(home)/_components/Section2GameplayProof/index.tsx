import { GAMEPLAY_CARDS, GAMEPLAY_COPY, LANDING_MEDIA } from '../../_data/landing-content'
import { LandingButton } from '../LandingButton'

import { GameplayCard } from './GameplayCard'
import { GameplayStatsBar } from './GameplayStatsBar'

export function Section2GameplayProof() {
  return (
    <section className="landing-section gameplay-section" id="gameplay" data-motion="gameplay">
      <div className="media-layer" aria-hidden="true">
        {LANDING_MEDIA.gameplayVideo ? (
          <video
            className="media-layer__video"
            poster={LANDING_MEDIA.gameplayPlate}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={LANDING_MEDIA.gameplayVideo} type="video/mp4" />
          </video>
        ) : null}
        <div
          className="media-layer__fallback"
          style={{ backgroundImage: `url(${LANDING_MEDIA.gameplayPlate})` }}
        />
        <div className="media-vignette" />
      </div>

      <div className="gameplay-section__cards">
        {GAMEPLAY_CARDS.map((card) => (
          <GameplayCard key={card.index} card={card} />
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
          <LandingButton className="landing-button--gameplay" href="/signup">
            {GAMEPLAY_COPY.cta}
          </LandingButton>
        </div>
      </div>

      <GameplayStatsBar />
    </section>
  )
}
