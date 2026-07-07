import Link from 'next/link'

import { LANDING_NAV_LINKS } from '../../_data/landing-content'

import './landing-chrome.css'

interface LandingChromeProps {
  activeIndex?: number
}

export function LandingChrome({ activeIndex = 0 }: LandingChromeProps) {
  return (
    <>
      <header
        className="landing-chrome fixed inset-x-0 top-0 z-40 grid translate-y-[-16px] items-center opacity-0"
        data-motion="chrome"
      >
        <Link
          className="brand-mark relative inline-flex items-center gap-5 justify-self-start"
          href="/"
          aria-label="GRIMOIRE accueil"
        >
          <span className="brand-mark__logo" aria-hidden="true" />
        </Link>

        <nav
          className="landing-chrome__nav flex items-center justify-self-center"
          aria-label="Navigation principale"
        >
          {LANDING_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="landing-menu-button inline-flex flex-col items-center justify-self-end"
          type="button"
          aria-label="Ouvrir le menu"
        >
          <span />
          <span />
        </button>
      </header>

      <aside className="landing-pagination fixed z-[36] grid" aria-label="Progression landing">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={index === activeIndex ? 'is-active' : undefined}
            aria-current={index === activeIndex ? 'step' : undefined}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        ))}
      </aside>
    </>
  )
}
