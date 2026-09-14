'use client'

import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import { MainNavigation } from '@/components/system/MainNavigation/main-navigation'
import { WORLD_ROUTES } from '@/config/worlds'

import { SectionContract } from '../SectionContract/SectionContract'
import { SectionOutro } from '../SectionOutro/SectionOutro'
import { SectionPlay } from '../SectionPlay/SectionPlay'
import { SectionSurvival } from '../SectionSurvival/SectionSurvival'
import { SectionThreshold } from '../SectionThreshold/SectionThreshold'

import { LandingAtmosphere } from './LandingAtmosphere'
import { useLandingMotion } from './use-landing-motion'

import './landing-experience.css'
import './landing-atmosphere.css'

// Native anchors preserve keyboard navigation, history and reduced-motion preferences.
const useNativeAnchor = () => false

/**
 * The landing shell: chrome, motion runtime and the ordered deck of plans.
 *
 * Each plan owns its own folder and stylesheet; this file owns only what is
 * shared between them — the frame, the progress bar and the reading order. The
 * motion runtime targets classes (`.salt-plan`, `.salt-copy`, `.salt-art`), never
 * the file layout, so moving a plan between files never touches the animation.
 */
export function LandingExperience({ resumeHref }: { resumeHref?: string }) {
  const t = useTranslations('SaltLanding')
  const root = useRef<HTMLDivElement>(null)
  useLandingMotion(root)
  const beginHref = resumeHref ?? WORLD_ROUTES.velkhar.aveugle
  const resuming = Boolean(resumeHref)

  return (
    <div className="salt-landing" ref={root}>
      <a className="salt-skip" href="#landing-content">
        {t('skip')}
      </a>
      <div className="salt-progress" aria-hidden="true" />
      <MainNavigation context="marketing" onAnchorNavigate={useNativeAnchor} />
      <main id="landing-content">
        <SectionThreshold beginHref={beginHref} resuming={resuming} />
        <SectionContract />
        <SectionPlay />
        <SectionSurvival />
        <SectionOutro beginHref={beginHref} resuming={resuming} />
      </main>
      <footer className="salt-footer">
        <span>{t('brand')} © 2026</span>
        <span>{t('created')}</span>
        <a href="https://github.com/AdamDjo/Grimoire-game">GitHub</a>
      </footer>
      <LandingAtmosphere />
    </div>
  )
}
