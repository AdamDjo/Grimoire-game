import { useTranslations } from 'next-intl'

import { MediaLayer } from '@/components/ui'
import { GameLink } from '@/components/ui/game-link'
import { WORLD_ROUTES } from '@/config/worlds'

import {
  LANDING_FOOTER_LINKS,
  LANDING_MEDIA,
  LANDING_SUPPORT_LINK,
} from '../../_data/landing-content'

import './section-outro.css'

export function SectionOutro() {
  const t = useTranslations('Landing')
  const quote = [t('outroQuote1'), t('outroQuote2'), t('outroQuote3')]

  return (
    <section
      className="landing-section outro-section"
      id="outro"
      aria-labelledby="outro-title"
      data-motion="outro"
    >
      <MediaLayer
        className="outro-plate"
        fallbackSrc={LANDING_MEDIA.outroPlate}
        fallbackSrcWebp={LANDING_MEDIA.outroPlateWebp}
        poster={LANDING_MEDIA.outroPlate}
        videoSrc={LANDING_MEDIA.outroVideo ?? undefined}
      />

      <div
        className="outro-section__veil absolute inset-0 z-[5]"
        data-outro-veil
        aria-hidden="true"
      />

      <blockquote className="outro-quote z-3 m-0 text-center" data-motion="reveal">
        {quote.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </blockquote>

      <p
        className="outro-logo z-3 grid text-center uppercase tracking-[0.18em] leading-none"
        data-motion="reveal"
      >
        GRIMOIRE <span className="mt-2 inline-block">of ash and salt</span>
      </p>

      <div className="outro-section__content relative z-3 grid justify-items-center text-center">
        <h2
          id="outro-title"
          className="m-0 font-medium tracking-normal leading-none normal-case"
          data-motion="title"
        >
          {t('outroTitle')}
        </h2>
        <p className="m-0" data-motion="reveal">
          {t('outroBody')}
        </p>
        <div data-motion="reveal">
          <GameLink
            data-magnetic
            href={`${WORLD_ROUTES.velkhar.aveugle}?transition=home`}
            prefetch={false}
            variant="landing"
          >
            {t('outroCta')}
          </GameLink>
        </div>
      </div>

      <footer className="outro-footer absolute z-4 border-t-0" data-motion="reveal">
        <div className="outro-footer__made">
          <span>
            {t('madeBy')}{' '}
            <span className="outro-footer__heart" aria-hidden="true">
              ♥
            </span>{' '}
            {t('by')}
          </span>
          <span className="outro-footer__copyright">© 2026 Grimoire</span>
        </div>

        <a
          className="outro-footer__support"
          href={LANDING_SUPPORT_LINK}
          target="_blank"
          rel="noreferrer"
        >
          <span aria-hidden="true">✦</span>
          {t('support')}
        </a>

        <nav className="outro-footer__links" aria-label={t('footerNavigation')}>
          {LANDING_FOOTER_LINKS.map((link) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
              >
                {link.label}
              </a>
            ) : (
              <span
                key={link.label}
                className="outro-footer__link-disabled"
                aria-label={t('comingSoon', { label: link.label })}
                aria-disabled="true"
              >
                {link.label}
              </span>
            )
          )}
        </nav>
      </footer>
    </section>
  )
}
