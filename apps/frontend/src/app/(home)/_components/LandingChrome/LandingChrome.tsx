import Link from 'next/link'

import { LANDING_AUTH_LINK, LANDING_NAV_LINKS } from '../../_data/landing-content'

import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'

import './landing-chrome.css'

export function LandingChrome() {
  return (
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

      <NavLinks links={LANDING_NAV_LINKS} />

      <div className="landing-chrome__actions justify-self-end">
        <Link className="landing-auth-link" href={LANDING_AUTH_LINK.href}>
          {LANDING_AUTH_LINK.label}
        </Link>
      </div>

      <MobileMenu authLink={LANDING_AUTH_LINK} links={LANDING_NAV_LINKS} />
    </header>
  )
}
