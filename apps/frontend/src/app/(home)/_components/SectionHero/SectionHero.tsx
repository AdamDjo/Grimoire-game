import { Button } from '@/components/ui'

import { HERO_COPY, LANDING_MEDIA } from '../../_data/landing-content'
import { FrameSequenceCanvas } from '../FrameSequenceCanvas/FrameSequenceCanvas'

import './section-hero.css'

export function SectionHero() {
  return (
    <section
      className="landing-section hero-section"
      id="velkhar"
      data-motion="hero"
      data-frames-length={LANDING_MEDIA.heroScrubLength}
    >
      <div className="hero-section__media absolute inset-0" aria-hidden="true">
        <FrameSequenceCanvas
          className="absolute inset-0 h-full w-full"
          fallbackSrc={LANDING_MEDIA.heroPlate}
          fallbackSrcWebp={LANDING_MEDIA.heroPlateWebp}
          frameCount={LANDING_MEDIA.heroFrameCount}
          frameDir={LANDING_MEDIA.heroFrames}
          reportPreload
        />
        <video
          className="hero-section__idle absolute inset-0 h-full w-full"
          data-hero-idle
          poster={LANDING_MEDIA.heroPlate}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={LANDING_MEDIA.heroIdleVideo} type="video/mp4" />
        </video>
        <div className="media-vignette absolute inset-0" data-hero-vignette />
        <div className="hero-section__veil absolute inset-0" data-hero-veil />
      </div>

      <div className="hero-section__content relative z-2">
        <p
          className="section-eyebrow relative m-0 mb-[42px] font-accent text-accroche font-medium"
          data-motion="reveal"
        >
          {HERO_COPY.eyebrow}
        </p>
        <h1
          className="hero-title m-0 font-display text-h1 font-medium normal-case"
          data-motion="title"
        >
          {HERO_COPY.titleLines.map((line) => (
            <span key={line} className="block whitespace-nowrap text-inherit">
              {line}
            </span>
          ))}
        </h1>
        <div className="hero-copy mt-[30px] font-ui text-ui" data-motion="reveal">
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

      <div className="hero-scroll-hint" data-hero-scroll-hint aria-hidden="true">
        <span className="hero-scroll-hint__label">{HERO_COPY.scrollHint}</span>
        <span className="hero-scroll-hint__rail">
          <span className="hero-scroll-hint__ember" />
        </span>
      </div>
    </section>
  )
}
