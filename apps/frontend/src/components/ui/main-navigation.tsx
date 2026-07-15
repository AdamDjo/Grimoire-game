'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const hasAccount = tier !== 'anonymous'
  const isAveugleThreshold = pathname === '/velkhar/aveugle'
  const accountHref = hasAccount ? '/dashboard' : '/login?next=%2Fdashboard'
  const accountLabel = hasAccount ? 'Votre espace' : 'Se connecter'

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isMobileMenuOpen])

  return (
    <GameTopBar
      className="main-navigation"
      label="Navigation globale"
      variant={isAveugleThreshold ? 'velkhar' : 'default'}
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
        <div className="main-navigation__actions">
          <Link
            className="main-navigation__account main-navigation__account--desktop"
            href={accountHref}
            aria-label={hasAccount ? 'Ouvrir votre espace' : accountLabel}
          >
            <GameIcon decorative name={hasAccount ? 'book' : 'key'} size={24} />
            <span>{accountLabel}</span>
          </Link>

          <button
            aria-controls="main-navigation-mobile-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="main-navigation__menu-trigger"
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            <span />
            <span />
          </button>

          {isMobileMenuOpen ? (
            <nav
              aria-label="Navigation mobile"
              className="main-navigation__mobile-menu"
              id="main-navigation-mobile-menu"
            >
              <ul>
                {MAIN_LINKS.map((link) => {
                  const isCurrent = isCurrentPath(pathname, link.href)

                  return (
                    <li key={link.href}>
                      <Link
                        aria-current={isCurrent ? 'page' : undefined}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
                <li>
                  <Link
                    className="main-navigation__mobile-account"
                    href={accountHref}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <GameIcon decorative name={hasAccount ? 'book' : 'key'} size={24} />
                    <span>{accountLabel}</span>
                  </Link>
                </li>
              </ul>
            </nav>
          ) : null}
        </div>
      }
    />
  )
}
