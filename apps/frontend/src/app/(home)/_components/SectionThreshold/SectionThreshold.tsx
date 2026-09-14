'use client'

import { useTranslations } from 'next-intl'

import { GameLink } from '@/components/ui/game-link'

import { LandingArt } from '../LandingExperience/LandingArt'

import './section-threshold.css'

/** Grains carried by the gate draught. Count is cosmetic; the CSS staggers them. */
const ASH_COUNT = 7

/**
 * The opening plan. It sets the grammar every later plan repeats: the plate
 * settles, the depth opens, the copy lifts.
 */
export function SectionThreshold({
  beginHref,
  resuming,
}: {
  beginHref: string
  resuming: boolean
}) {
  const t = useTranslations('SaltLanding')

  return (
    <section id="velkhar" className="salt-plan salt-seuil" aria-labelledby="salt-title">
      <LandingArt name="seuil" priority />
      <div className="salt-ash salt-ash--gate" aria-hidden="true">
        {Array.from({ length: ASH_COUNT }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <div className="salt-depth salt-depth--near" aria-hidden="true" />
      <div className="salt-copy">
        <p className="salt-eyebrow">{t('genre')}</p>
        <h1 id="salt-title">{t('heroTitle')}</h1>
        <p>{t('heroBody')}</p>
        <div className="salt-actions">
          <GameLink variant="landing" href={beginHref} size="lg">
            {t(resuming ? 'resume' : 'start')}
          </GameLink>
          <a href="#gameplay">{t('watch')}</a>
        </div>
      </div>
      <a className="salt-scroll" href="#contrat">
        <i aria-hidden="true">↓</i> <span>{t('threshold')}</span>
      </a>
    </section>
  )
}
