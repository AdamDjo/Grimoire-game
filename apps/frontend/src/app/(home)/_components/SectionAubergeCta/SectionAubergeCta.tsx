import Link from 'next/link'

import { Button, MediaLayer } from '@/components/ui'

import { AUBERGE_COPY, LANDING_MEDIA } from '../../_data/landing-content'

import './section-auberge.css'

export function SectionAubergeCta() {
  return (
    <section className="landing-section auberge-section" id="auberge" data-motion="auberge">
      <MediaLayer
        fallbackSrc={LANDING_MEDIA.aubergePlate}
        fallbackSrcWebp={LANDING_MEDIA.aubergePlateWebp}
        poster={LANDING_MEDIA.aubergePlate}
        videoSrc={LANDING_MEDIA.aubergeVideo ?? undefined}
      />

      <blockquote className="auberge-quote z-3 m-0 text-center" data-motion="reveal">
        {AUBERGE_COPY.quote.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </blockquote>

      <div className="auberge-section__content relative z-3 grid justify-items-center text-center">
        <p
          className="auberge-logo grid uppercase tracking-[0.18em] leading-none"
          data-motion="reveal"
        >
          GRIMOIRE <span className="mt-2 inline-block">of ash and salt</span>
        </p>
        <h2
          className="m-0 font-medium tracking-normal leading-none normal-case"
          data-motion="title"
        >
          {AUBERGE_COPY.title}
        </h2>
        <p className="m-0" data-motion="reveal">
          {AUBERGE_COPY.body}
        </p>
        <div data-motion="reveal">
          <Button href="/signup">{AUBERGE_COPY.cta}</Button>
        </div>
      </div>

      <footer
        className="auberge-footer absolute z-4 flex justify-center border-t-0 pt-5"
        data-motion="reveal"
      >
        {AUBERGE_COPY.footerLinks.map((link) => (
          <Link key={link} href="#">
            {link}
          </Link>
        ))}
      </footer>
    </section>
  )
}
