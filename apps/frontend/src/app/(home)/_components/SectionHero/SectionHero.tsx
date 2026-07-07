import { Button, MediaLayer } from '@/components/ui'

import { HERO_COPY, LANDING_MEDIA } from '../../_data/landing-content'

import './section-hero.css'

export function SectionHero() {
  return (
    <section className="landing-section hero-section" id="velkhar" data-motion="hero">
      <MediaLayer
        fallbackSrc={LANDING_MEDIA.heroPlate}
        fallbackSrcWebp={LANDING_MEDIA.heroPlateWebp}
        poster={LANDING_MEDIA.heroPlate}
        videoSrc={LANDING_MEDIA.heroVideo}
      />

      <div className="hero-section__content relative z-2">
        <p className="section-eyebrow relative m-0 mb-[42px]" data-motion="reveal">
          {HERO_COPY.eyebrow}
        </p>
        <h1 className="hero-title m-0 font-normal normal-case" data-motion="title">
          {HERO_COPY.titleLines.map((line) => (
            <span key={line} className="block whitespace-nowrap text-inherit">
              {line}
            </span>
          ))}
        </h1>
        <div className="hero-copy mt-[30px]" data-motion="reveal">
          {HERO_COPY.body.map((line) => (
            <p key={line} className="m-0">
              {line}
            </p>
          ))}
        </div>
        <div className="hero-actions mt-9 flex" data-motion="hero-actions">
          <Button href="#auberge">{HERO_COPY.primaryCta}</Button>
          <Button href="#gameplay" variant="ghost">
            {HERO_COPY.secondaryCta}
          </Button>
        </div>
      </div>
    </section>
  )
}
