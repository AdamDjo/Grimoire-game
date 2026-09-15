'use client'

import { MainNavigation } from '@/components/system/MainNavigation/main-navigation'

function navigateToLandingAnchor(href: string): boolean {
  window.location.assign(`/${href}`)
  return true
}

export function AuthNavigation() {
  return <MainNavigation context="marketing" onAnchorNavigate={navigateToLandingAnchor} />
}
