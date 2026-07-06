import { HERO_COPY, LANDING_MEDIA } from '../../_data/landing-content'
import { LandingButton } from '../LandingButton'

export function SectionHero() {
  return (
    <section className="landing-section hero-section" id="velkhar" data-motion="hero">
      <div className="media-layer" aria-hidden="true">
        <video
          className="media-layer__video"
          poster={LANDING_MEDIA.heroPlate}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={LANDING_MEDIA.heroVideo} type="video/mp4" />
        </video>
        <div
          className="media-layer__fallback"
          style={{ backgroundImage: `url(${LANDING_MEDIA.heroPlate})` }}
        />
        <div className="media-vignette" />
      </div>

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
          <LandingButton href="#auberge">{HERO_COPY.primaryCta}</LandingButton>
          <LandingButton href="#gameplay" variant="ghost">
            {HERO_COPY.secondaryCta}
          </LandingButton>
        </div>
      </div>
    </section>
  )
}
