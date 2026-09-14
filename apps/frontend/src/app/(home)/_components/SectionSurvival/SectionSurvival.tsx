'use client'

import { useTranslations } from 'next-intl'

import { LandingArt } from '../LandingExperience/LandingArt'

import './section-survival.css'

/** The fourth plan: the cost of the crossing. Copy sits right, over bare sand. */
export function SectionSurvival() {
  const t = useTranslations('SaltLanding')

  return (
    <section id="survie" className="salt-plan salt-survie" aria-labelledby="survival-title">
      <LandingArt name="survie" />
      <div className="salt-copy">
        <p className="salt-eyebrow">{t('survivalLabel')}</p>
        <h2 id="survival-title">{t('survivalTitle')}</h2>
        <p>{t('survivalBody')}</p>
      </div>
    </section>
  )
}
