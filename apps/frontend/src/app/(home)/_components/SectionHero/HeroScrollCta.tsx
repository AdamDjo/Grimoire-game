'use client'

import { GameLink } from '@/components/ui/game-link'

import { scrollToAnchor } from '../LandingChrome/scroll-to-anchor'

import type { MouseEvent, ReactNode } from 'react'

interface HeroScrollCtaProps {
  children: ReactNode
  href: `#${string}`
}

export function HeroScrollCta({ children, href }: HeroScrollCtaProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!scrollToAnchor(href)) return

    event.preventDefault()
  }

  return (
    <GameLink data-magnetic href={href} onClick={handleClick} variant="landing">
      {children}
    </GameLink>
  )
}
