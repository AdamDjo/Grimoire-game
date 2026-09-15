'use client'

import { useTranslations } from 'next-intl'

import { GameLink } from '@/components/ui/game-link'

import { LandingArt } from '../LandingExperience/LandingArt'

import './section-outro.css'

/** The closing plan — the inn. Copy is centred at the foot of the plate. */
export function SectionOutro({ beginHref, resuming }: { beginHref: string; resuming: boolean }) {
  const t = useTranslations('SaltLanding')

  return (
    <section id="outro" className="salt-plan salt-auberge" aria-labelledby="outro-title">
      <LandingArt name="auberge" />
      <div className="salt-copy">
        <p className="salt-eyebrow">{t('outroLabel')}</p>
        <h2 id="outro-title">{t('outroTitle')}</h2>
        <p>{t('outroBody')}</p>
        <div className="salt-actions">
          <GameLink variant="landing" href={beginHref} size="lg">
            {t(resuming ? 'resume' : 'enter')}
          </GameLink>
          <a href="/dashboard">{t('chronicle')}</a>
        </div>
        <p className="salt-meta">{t('meta')}</p>
      </div>
    </section>
  )
}
