'use client'

import { scrollToAnchor } from './scroll-to-anchor'

import type { MouseEvent } from 'react'

interface NavLink {
  label: string
  href: string
}

interface NavLinksProps {
  links: readonly NavLink[]
}

export function NavLinks({ links }: NavLinksProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return
    if (scrollToAnchor(href)) {
      event.preventDefault()
    }
  }

  return (
    <nav
      className="landing-chrome__nav flex items-center justify-self-center"
      aria-label="Navigation principale"
    >
      {links.map((link) => (
        <a key={link.href} href={link.href} onClick={(event) => handleClick(event, link.href)}>
          {link.label}
        </a>
      ))}
    </nav>
  )
}
