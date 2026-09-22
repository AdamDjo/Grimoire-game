'use client'

import { useTranslations } from 'next-intl'

import { WORLD_ROUTES } from '@/config/worlds'
import { GameScene, type GameSceneTurn } from '@/features/game-session/velkhar'

import { COMPOSER_MAX_LENGTH, LANDING_SURVIVAL } from '../../_data/landing-scene'
import { LandingArt } from '../LandingExperience/LandingArt'

import './section-play.css'

/**
 * The proof plan: a playable slice rather than a screenshot. The intro reads as
 * one band and the scene takes the row underneath it, so the plan ends with the
 * viewport instead of past it.
 */
export function SectionPlay() {
  const t = useTranslations('SaltLanding')
  const turn = useLandingTurn()

  return (
    <section id="gameplay" className="salt-plan salt-partie" aria-labelledby="play-title">
      <header className="salt-copy">
        <p className="salt-eyebrow">{t('playLabel')}</p>
        <h2 id="play-title">{t('playTitle')}</h2>
      </header>
      <GameScene
        className="salt-demo"
        hudClassName="salt-hud"
        gaugeClassNames={{ thirst: 'salt-hud__thirst' }}
        background={<LandingArt name="partie" />}
        turn={turn}
      />
    </section>
  )
}

/**
 * The landing's scripted turn, resolved against `SaltLanding`.
 *
 * `GameScene` takes strings rather than message keys, so the namespace stays
 * here — where it belongs — instead of inside a shared component.
 */
function useLandingTurn(): GameSceneTurn {
  const t = useTranslations('SaltLanding')

  return {
    location: t('scene'),
    label: t('demo'),
    heading: t('toll'),
    narrative: t('passage'),
    choices: [t('choice1'), t('choice2'), t('choice3')],
    response: t('demoResponse'),
    continueLabel: t('enter'),
    continueHref: WORLD_ROUTES.velkhar.landingEntry,
    composer: {
      label: t('free'),
      placeholder: t('placeholder'),
      actionLabel: t('submit'),
      maxLength: COMPOSER_MAX_LENGTH,
    },
    survival: LANDING_SURVIVAL,
    hudLabels: {
      region: t('hud'),
      gauges: {
        blood: t('blood'),
        breath: t('breath'),
        hunger: t('hunger'),
        thirst: t('thirst'),
        calamine: t('calamine'),
      },
    },
  }
}
