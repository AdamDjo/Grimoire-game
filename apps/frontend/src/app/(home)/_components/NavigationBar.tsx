'use client'

import { CompassRose } from '@/components/ui/CompassRose'
import { NavBar } from '@/components/ui/NavBar'
import { NAV_LINKS } from '@/lib/home-data'

const LOGO_TITLE_STYLE = {
  fontFamily: 'var(--font-disp)',
  fontSize: 16,
  letterSpacing: '0.22em',
  fontWeight: 700,
  background: 'linear-gradient(180deg, #e8d4a0 0%, #c4a468 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textTransform: 'uppercase' as const,
}

const logo = (
  <>
    <CompassRose size={28} />
    <span style={LOGO_TITLE_STYLE}>Grimoire</span>
  </>
)

const links = NAV_LINKS.map((label, i) => ({ label, href: '#', active: i === 0 }))

export function NavigationBar() {
  return <NavBar logo={logo} links={links} />
}
