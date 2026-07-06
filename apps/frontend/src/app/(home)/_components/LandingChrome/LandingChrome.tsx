import Link from 'next/link'

import { LANDING_NAV_LINKS } from '../../_data/landing-content'

import './landing-chrome.css'

interface LandingChromeProps {
  activeIndex?: number
}

export function LandingChrome({ activeIndex = 0 }: LandingChromeProps) {
  return (
    <>
      <header className="landing-chrome" data-motion="chrome">
        <Link className="brand-mark" href="/" aria-label="GRIMOIRE accueil">
          <span className="brand-mark__logo" aria-hidden="true" />
        </Link>

        <nav className="landing-chrome__nav" aria-label="Navigation principale">
          {LANDING_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <button className="landing-menu-button" type="button" aria-label="Ouvrir le menu">
          <span />
          <span />
        </button>
      </header>

      <aside className="landing-pagination" aria-label="Progression landing">
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
