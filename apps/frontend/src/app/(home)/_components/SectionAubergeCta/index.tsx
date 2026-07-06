import Link from 'next/link'

import { AUBERGE_COPY, LANDING_MEDIA } from '../../_data/landing-content'
import { LandingButton } from '../LandingButton'

export function SectionAubergeCta() {
  return (
    <section className="landing-section auberge-section" id="auberge" data-motion="auberge">
      <div className="media-layer" aria-hidden="true">
        {LANDING_MEDIA.aubergeVideo ? (
          <video
            className="media-layer__video"
            poster={LANDING_MEDIA.aubergePlate}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={LANDING_MEDIA.aubergeVideo} type="video/mp4" />
          </video>
        ) : null}
        <div
          className="media-layer__fallback"
          style={{ backgroundImage: `url(${LANDING_MEDIA.aubergePlate})` }}
        />
        <div className="media-vignette" />
      </div>

      <blockquote className="auberge-quote" data-motion="reveal">
        {AUBERGE_COPY.quote.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </blockquote>

      <div className="auberge-section__content">
        <p className="auberge-logo" data-motion="reveal">
          GRIMOIRE <span>of ash and salt</span>
        </p>
        <h2 data-motion="title">{AUBERGE_COPY.title}</h2>
        <p data-motion="reveal">{AUBERGE_COPY.body}</p>
        <div data-motion="reveal">
          <LandingButton href="/signup">{AUBERGE_COPY.cta}</LandingButton>
        </div>
      </div>

      <footer className="auberge-footer" data-motion="reveal">
        {AUBERGE_COPY.footerLinks.map((link) => (
          <Link key={link} href="#">
            {link}
          </Link>
        ))}
      </footer>
    </section>
  )
}
