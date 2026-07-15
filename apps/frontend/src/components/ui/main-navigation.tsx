'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { GameBrand } from './grimoire/GameBrand/GameBrand'
import { GameIcon } from './grimoire/GameIcon/GameIcon'
import { GameTopBar } from './grimoire/GameTopBar/GameTopBar'

import type { ViewerTier } from '@/lib/viewer'

import './main-navigation.css'

interface MainNavigationProps {
  tier: ViewerTier
}

const MAIN_LINKS = [
  { href: '/#velkhar', label: 'Découvrir' },
  { href: '/dashboard', label: 'Chroniques' },
  { href: '/velkhar/aveugle', label: 'L’Auberge' },
] as const

function isCurrentPath(pathname: string, href: string): boolean {
  if (href === '/#velkhar') return pathname === '/'
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
  const [isMounted, setIsMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const hasAccount = tier !== 'anonymous'
  const accountHref = hasAccount ? '/dashboard' : '/login?next=%2Fdashboard'
  const accountLabel = hasAccount ? 'Votre espace' : 'Se connecter'

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined

    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    const focusableElements = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)') ?? []
    )
    menuRef.current?.querySelector<HTMLAnchorElement>('a[href]')?.focus()

    const handleMenuKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        menuTriggerRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleMenuKeyDown)
    return () => {
      document.documentElement.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleMenuKeyDown)
    }
  }, [isMobileMenuOpen])

  return (
    <GameTopBar
      className="main-navigation"
      label="Navigation globale"
      variant="velkhar"
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
            ref={menuTriggerRef}
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

          {isMounted && isMobileMenuOpen
            ? createPortal(
                <div
                  ref={menuRef}
                  aria-label="Menu principal"
                  aria-modal="true"
                  className="main-navigation__mobile-menu"
                  id="main-navigation-mobile-menu"
                  role="dialog"
                >
                  <button
                    aria-label="Fermer la navigation"
                    className="main-navigation__mobile-menu-close"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      menuTriggerRef.current?.focus()
                    }}
                    type="button"
                  >
                    <span />
                    <span />
                  </button>
                  <nav aria-label="Navigation mobile">
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
                </div>,
                document.body
              )
            : null}
        </div>
      }
    />
  )
}
