import { Button, MediaLayer } from '@/components/ui'

import { HERO_COPY, LANDING_MEDIA } from '../../_data/landing-content'

import './section-hero.css'

export function SectionHero() {
  return (
    <section className="landing-section hero-section" id="velkhar" data-motion="hero">
      <MediaLayer
        fallbackSrc={LANDING_MEDIA.heroPlate}
        poster={LANDING_MEDIA.heroPlate}
        videoSrc={LANDING_MEDIA.heroVideo}
      />

      <div className="hero-section__content">
        <p className="section-eyebrow" data-motion="reveal">
          {HERO_COPY.eyebrow}
        </p>
        <h1 className="hero-title" data-motion="title">
          {HERO_COPY.titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <div className="hero-copy" data-motion="reveal">
          {HERO_COPY.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="hero-actions" data-motion="hero-actions">
          <Button href="#auberge">{HERO_COPY.primaryCta}</Button>
          <Button href="#gameplay" variant="ghost">
            {HERO_COPY.secondaryCta}
          </Button>
        </div>
      </div>
    </section>
  )
}
