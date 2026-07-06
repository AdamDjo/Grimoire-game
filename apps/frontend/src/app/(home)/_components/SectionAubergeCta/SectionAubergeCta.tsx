import Link from 'next/link'

import { Button, MediaLayer } from '@/components/ui'

import { AUBERGE_COPY, LANDING_MEDIA } from '../../_data/landing-content'

import './section-auberge.css'

export function SectionAubergeCta() {
  return (
    <section className="landing-section auberge-section" id="auberge" data-motion="auberge">
      <MediaLayer
        fallbackSrc={LANDING_MEDIA.aubergePlate}
        poster={LANDING_MEDIA.aubergePlate}
        videoSrc={LANDING_MEDIA.aubergeVideo ?? undefined}
      />

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
          <Button href="/signup">{AUBERGE_COPY.cta}</Button>
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
