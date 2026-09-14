'use client'

import { useTranslations } from 'next-intl'

import { LandingArt } from '../LandingExperience/LandingArt'

import './section-contract.css'

/** The terms of the crossing, as a `<dl>`: label on the left, answer on the right. */
const TERMS = [
  ['destination', 'fingers'],
  ['danger', 'hard'],
  ['duration', 'long'],
] as const

/** The second plan: what the player signs up for, stated plainly. */
export function SectionContract() {
  const t = useTranslations('SaltLanding')

  return (
    <section id="contrat" className="salt-plan salt-contrat" aria-labelledby="contract-title">
      <LandingArt name="contrat" />
      <div className="salt-copy">
        <p className="salt-eyebrow">{t('contractLabel')}</p>
        <h2 id="contract-title">{t('contractTitle')}</h2>
        <p>{t('contractBody')}</p>
        <a className="salt-text-link" href="#gameplay">
          {t('contractLink')} →
        </a>
      </div>
      <div className="salt-contract-details">
        <dl>
          {TERMS.map(([key, value]) => (
            <div key={key}>
              <dt>{t(key)}</dt>
              <dd>{t(value)}</dd>
            </div>
          ))}
        </dl>
        <p>{t('contractNote')}</p>
      </div>
    </section>
  )
}
