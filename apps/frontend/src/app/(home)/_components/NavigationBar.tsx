'use client'

import { CompassRose } from '@/components/ui/CompassRose'
import { NavBar } from '@/components/ui/NavBar'
import { NAV_LINKS } from '@/lib/home-data'

const logo = (
  <>
    <CompassRose size={28} />
    <span className="text-gradient-gold font-display font-bold uppercase text-[18px] tracking-[0.22em]">
      Grimoire
    </span>
  </>
)

const links = NAV_LINKS.map((label, i) => ({ label, href: '#', active: i === 0 }))

export function NavigationBar() {
  return <NavBar logo={logo} links={links} />
}
