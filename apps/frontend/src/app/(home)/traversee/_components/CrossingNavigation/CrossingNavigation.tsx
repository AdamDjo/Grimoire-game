import Link from 'next/link'

import { GameLink } from '@/components/ui/game-link'

import type { CrossingCopy } from '../../_data/crossing-content'

import './crossing-navigation.css'

interface CrossingNavigationProps {
  beginHref: string
  copy: CrossingCopy
  hasActiveChronicle: boolean
}

export function CrossingNavigation({
  beginHref,
  copy,
  hasActiveChronicle,
}: CrossingNavigationProps) {
  return (
    <header className="cross-nav" data-cross-nav>
      <Link className="cross-brand" href="/" aria-label="Grimoire — Of Ash and Salt">
        GRIMOIRE<span>OF ASH AND SALT</span>
      </Link>
      <nav
        aria-label={copy.skip === 'Skip to content' ? 'Main navigation' : 'Navigation principale'}
      >
        <a className="cross-nav__section-link" href="#apercu">
          {copy.game}
        </a>
        <a className="cross-nav__section-link" href="#auberge">
          {copy.world}
        </a>
        <Link className="cross-nav__account" href="/login">
          {copy.login}
        </Link>
        <GameLink variant="landing" href={beginHref}>
          {hasActiveChronicle ? copy.resumeShort : copy.playShort}
        </GameLink>
      </nav>
    </header>
  )
}
