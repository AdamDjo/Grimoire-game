'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { GameBrand } from './grimoire/GameBrand/GameBrand'
import { GameIcon } from './grimoire/GameIcon/GameIcon'
import { GameTopBar } from './grimoire/GameTopBar/GameTopBar'

import type { ViewerTier } from '@/lib/viewer'

import './main-navigation.css'

interface MainNavigationProps {
  tier: ViewerTier
}

const MAIN_LINKS = [
  { href: '/dashboard', label: 'Chroniques' },
  { href: '/velkhar/campaign/nouvelle-chronique', label: 'Franchir le seuil' },
] as const

function isCurrentPath(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === href
  return (
    pathname === '/velkhar/aveugle' ||
    pathname === '/velkhar/character-create' ||
    pathname.startsWith('/velkhar/campaign/')
  )
}

export function MainNavigation({ tier }: MainNavigationProps) {
  const pathname = usePathname()
  const hasAccount = tier !== 'anonymous'

  return (
    <GameTopBar
      className="main-navigation"
      label="Navigation globale"
      start={
        <Link className="main-navigation__brand" href="/" aria-label="GRIMOIRE, accueil">
          <GameBrand decorative size="sm" variant="lockup" />
        </Link>
      }
      center={
        <nav aria-label="Espaces de Velkhar">
          <ul className="main-navigation__links">
            {MAIN_LINKS.map((link) => {
              const isCurrent = isCurrentPath(pathname, link.href)

              return (
                <li key={link.href}>
                  <Link href={link.href} aria-current={isCurrent ? 'page' : undefined}>
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      }
      end={
        <Link
          className="main-navigation__account"
          href={hasAccount ? '/dashboard' : '/login?next=%2Fdashboard'}
          aria-label={hasAccount ? 'Ouvrir votre espace' : 'Se connecter'}
        >
          <GameIcon decorative name={hasAccount ? 'book' : 'key'} size={24} />
          <span>{hasAccount ? 'Votre espace' : 'Se connecter'}</span>
        </Link>
      }
    />
  )
}
