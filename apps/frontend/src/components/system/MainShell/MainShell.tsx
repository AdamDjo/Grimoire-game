import { cookies } from 'next/headers'

import { MainNavigation } from '@/components/system/MainNavigation/main-navigation'
import { ACTIVE_GAME_SESSION_COOKIE, getActiveGameSessionHref } from '@/lib/active-game-session'
import { getViewerSummary } from '@/lib/viewer'

import type { ReactNode } from 'react'

import './main-shell.css'

interface MainShellProps {
  children: ReactNode
}

/** Shared authenticated shell used by platform pages and non-immersive world routes. */
export async function MainShell({ children }: MainShellProps) {
  const [viewer, cookieStore] = await Promise.all([getViewerSummary(), cookies()])
  const resumeHref = getActiveGameSessionHref(cookieStore.get(ACTIVE_GAME_SESSION_COOKIE)?.value)

  return (
    <div className="main-shell">
      <MainNavigation context="game" resumeHref={resumeHref} tier={viewer.tier} />
      <div className="main-shell__grain" aria-hidden="true" />
      {children}
    </div>
  )
}
