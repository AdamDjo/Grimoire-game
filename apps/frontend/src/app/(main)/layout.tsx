import { cookies } from 'next/headers'

import { MainNavigation } from '@/components/ui/main-navigation'
import {
  ACTIVE_GAME_SESSION_COOKIE,
  ACTIVE_GAME_SESSION_HREF,
  hasActiveGameSession,
} from '@/lib/active-game-session'
import { getViewerSummary } from '@/lib/viewer'

import type { ReactNode } from 'react'

import './main-layout.css'

export default async function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [viewer, cookieStore] = await Promise.all([getViewerSummary(), cookies()])
  const resumeHref = hasActiveGameSession(cookieStore.get(ACTIVE_GAME_SESSION_COOKIE)?.value)
    ? ACTIVE_GAME_SESSION_HREF
    : undefined

  return (
    <div className="main-shell">
      <MainNavigation context="game" resumeHref={resumeHref} tier={viewer.tier} />
      <div className="main-shell__grain" aria-hidden="true" />
      {children}
    </div>
  )
}
