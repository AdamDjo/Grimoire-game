'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

import { GameBrand } from './grimoire/GameBrand/GameBrand'
import { GameIcon } from './grimoire/GameIcon/GameIcon'
import { GameTopBar } from './grimoire/GameTopBar/GameTopBar'

import type { ViewerTier } from '@/lib/viewer'
import type { MouseEvent } from 'react'

import './main-navigation.css'

type MainNavigationProps =
  | {
      context: 'marketing'
      onAnchorNavigate: (href: string) => boolean
      onMenuOpenChange?: (isOpen: boolean) => void
      tier?: never
    }
  | { context: 'game'; tier: ViewerTier }

interface NavigationLink {
  href: string
  label: string
}

const MARKETING_LINKS: readonly NavigationLink[] = [
  { href: '#velkhar', label: 'Découvrir' },
  { href: '/dashboard', label: 'Chroniques' },
  { href: '/velkhar/aveugle?transition=home', label: 'L’Auberge' },
]

const GAME_LINKS: readonly NavigationLink[] = [
  { href: '/velkhar/aveugle', label: 'L’Auberge' },
  { href: '/dashboard', label: 'Chroniques' },
]

function isCurrentPath(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === href
  if (href.startsWith('/velkhar/aveugle')) {
    return (
      pathname === '/velkhar/aveugle' ||
      pathname === '/velkhar/character-create' ||
      pathname.startsWith('/velkhar/campaign/') ||
      pathname.startsWith('/velkhar/session/')
    )
  }
  return false
}

export function MainNavigation(props: MainNavigationProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const isMarketing = props.context === 'marketing'
  const onMenuOpenChange = props.context === 'marketing' ? props.onMenuOpenChange : undefined
  const hasAccount = props.context === 'game' && props.tier !== 'anonymous'
  const links = isMarketing ? MARKETING_LINKS : GAME_LINKS
  const brandHref = isMarketing ? '/' : hasAccount ? '/dashboard' : '/velkhar/aveugle'
  const accountHref = isMarketing
    ? '/login'
    : hasAccount
      ? '/dashboard'
      : '/login?next=%2Fdashboard'
  const accountLabel = isMarketing ? 'Se connecter' : hasAccount ? 'Votre espace' : 'Se connecter'

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
    onMenuOpenChange?.(true)

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
      onMenuOpenChange?.(false)
      document.removeEventListener('keydown', handleMenuKeyDown)
    }
  }, [isMobileMenuOpen, onMenuOpenChange])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    menuTriggerRef.current?.focus()
  }

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (props.context === 'marketing' && href.startsWith('#')) {
      if (isMobileMenuOpen) props.onMenuOpenChange?.(false)
      if (props.onAnchorNavigate(href)) event.preventDefault()
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <GameTopBar
      className={cn('main-navigation', `main-navigation--${props.context}`)}
      data-motion={isMarketing ? 'chrome' : undefined}
      label={isMarketing ? 'Navigation du site' : 'Navigation du jeu'}
      variant="velkhar"
      start={
        <Link
          className={cn(
            'main-navigation__brand',
            isMarketing && 'main-navigation__brand--marketing'
          )}
          href={brandHref}
          aria-label={isMarketing ? 'GRIMOIRE, accueil du site' : 'GRIMOIRE, accueil du jeu'}
        >
          {isMarketing ? (
            <span className="main-navigation__marketing-logo" aria-hidden="true" />
          ) : (
            <GameBrand decorative size="sm" variant="lockup" />
          )}
        </Link>
      }
      center={
        <nav aria-label={isMarketing ? 'Découvrir GRIMOIRE' : 'Espaces du jeu'}>
          <ul className="main-navigation__links">
            {links.map((link) => {
              const isCurrent = !isMarketing && isCurrentPath(pathname, link.href)

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isCurrent ? 'page' : undefined}
                    onClick={(event) => handleLinkClick(event, link.href)}
                  >
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
            aria-label={!isMarketing && hasAccount ? 'Ouvrir votre espace' : accountLabel}
          >
            {!isMarketing ? (
              <GameIcon decorative name={hasAccount ? 'book' : 'key'} size={24} />
            ) : null}
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
                  aria-label={isMarketing ? 'Menu du site' : 'Menu du jeu'}
                  aria-modal="true"
                  className="main-navigation__mobile-menu"
                  id="main-navigation-mobile-menu"
                  role="dialog"
                >
                  <button
                    aria-label="Fermer la navigation"
                    className="main-navigation__mobile-menu-close"
                    onClick={closeMobileMenu}
                    type="button"
                  >
                    <span />
                    <span />
                  </button>
                  <nav aria-label="Navigation mobile">
                    <ul>
                      {links.map((link) => {
                        const isCurrent = !isMarketing && isCurrentPath(pathname, link.href)

                        return (
                          <li key={link.href}>
                            <Link
                              aria-current={isCurrent ? 'page' : undefined}
                              href={link.href}
                              onClick={(event) => handleLinkClick(event, link.href)}
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
                          {!isMarketing ? (
                            <GameIcon decorative name={hasAccount ? 'book' : 'key'} size={24} />
                          ) : null}
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
