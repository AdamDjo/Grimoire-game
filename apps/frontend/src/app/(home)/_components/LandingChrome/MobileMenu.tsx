'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { getLenis } from '@/hooks/use-lenis'
import { gsap, useGSAP } from '@/lib/gsap-init'

import { scrollToAnchor } from './scroll-to-anchor'

interface NavLink {
  label: string
  href: string
}

interface MobileMenuProps {
  links: readonly NavLink[]
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)

  // L'overlay est porté dans <body> : le header est fixed ET transformé
  // (hide-on-scroll yPercent), or un position:fixed piégé dans un ancêtre
  // transformé se cale sur cet ancêtre au lieu du viewport. Le portal l'en sort.
  useEffect(() => {
    setMounted(true)
  }, [])

  // Timeline construite une fois, jouée/inversée selon `open`. L'overlay est
  // toujours rendu (fermé via visibility:hidden en CSS) → zéro risque hydration.
  useGSAP(
    () => {
      const overlay = overlayRef.current
      if (!overlay) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const items = overlay.querySelectorAll<HTMLElement>('.mobile-menu__link')

      if (reduceMotion) {
        // Pas de chorégraphie : l'ouverture/fermeture se joue en CSS via [data-open].
        return
      }

      const tl = gsap
        .timeline({ paused: true })
        .fromTo(
          overlay,
          { clipPath: 'inset(0 0 100% 0)', autoAlpha: 0 },
          { clipPath: 'inset(0 0 0% 0)', autoAlpha: 1, duration: 0.5, ease: 'expo.out' }
        )
        .fromTo(
          items,
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', stagger: 0.07 },
          '-=0.25'
        )

      timeline.current = tl
    },
    // Reconstruit quand l'overlay est réellement porté dans <body> (mounted),
    // sinon overlayRef est encore vide au premier passage.
    { scope: rootRef, dependencies: [mounted] }
  )

  const setScrollLock = (locked: boolean) => {
    const lenis = getLenis()
    if (locked) {
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.documentElement.style.overflow = ''
    }
  }

  const toggle = () => {
    const next = !open
    setOpen(next)
    setScrollLock(next)

    const tl = timeline.current
    if (tl) {
      if (next) tl.play()
      else tl.reverse()
    }
  }

  const close = () => {
    if (!open) return
    setOpen(false)
    setScrollLock(false)
    timeline.current?.reverse()
  }

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Fermer AVANT de scroller : close() redémarre Lenis (scroll lock), or un
    // scrollTo sur un Lenis encore stoppé serait ignoré.
    if (href.startsWith('#')) {
      event.preventDefault()
      close()
      scrollToAnchor(href)
      return
    }
    close()
  }

  // Escape ferme le menu, où que soit le focus (l'overlay est porté hors du root).
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Restaure le scroll si le composant se démonte alors que le menu est ouvert.
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = ''
      getLenis()?.start()
    }
  }, [])

  const overlay = (
    <div
      ref={overlayRef}
      id="mobile-menu-overlay"
      className="mobile-menu"
      data-open={open}
      aria-hidden={!open}
    >
      <nav className="mobile-menu__nav" aria-label="Navigation mobile">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="mobile-menu__link"
            onClick={(event) => handleLinkClick(event, link.href)}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  )

  return (
    <div ref={rootRef} className="landing-chrome__mobile justify-self-end">
      <button
        type="button"
        className={`landing-menu-button inline-flex flex-col items-center ${open ? 'is-open' : ''}`}
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        aria-controls="mobile-menu-overlay"
        onClick={toggle}
      >
        <span />
        <span />
      </button>

      {mounted ? createPortal(overlay, document.body) : null}
    </div>
  )
}
