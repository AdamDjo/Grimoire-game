import { MediaLayer } from '@/components/ui'

import { LANDING_MEDIA, WORLD_COPY } from '../../_data/landing-content'

import './section-world.css'

export function SectionWorld() {
  const lastLine = WORLD_COPY.titleLines.length - 1

  return (
    <section className="landing-section world-section" id="world" data-motion="world">
      <MediaLayer
        className="world-plate"
        fallbackSrc={LANDING_MEDIA.castlePlate}
        poster={LANDING_MEDIA.castlePlate}
      />

      <div
        className="world-section__veil absolute inset-0 z-[5]"
        data-world-veil
        aria-hidden="true"
      />

      <div className="world-section__content relative z-[3] self-center">
        <p className="world-section__label" data-motion="reveal">
          {WORLD_COPY.label}
        </p>

        <h2
          className="world-section__title m-0 font-display font-medium text-h2 text-parchment"
          data-motion="title"
        >
          {WORLD_COPY.titleLines.map((line, index) => (
            <span key={line} className={`block ${index === lastLine ? 'text-gold-soft' : ''}`}>
              {line}
            </span>
          ))}
        </h2>

        <p className="world-section__body font-serif text-accroche" data-motion="reveal">
          {WORLD_COPY.body}
        </p>

        <div className="world-section__pillars">
          {WORLD_COPY.pillars.map((pillar) => (
            <div key={pillar.label} className="world-pillar" data-motion="reveal">
              <p className="world-pillar__label">{pillar.label}</p>
              <p className="world-pillar__body font-serif text-body-editorial">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
