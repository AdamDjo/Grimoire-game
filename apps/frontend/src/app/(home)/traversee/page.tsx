import { cookies } from 'next/headers'
import { getLocale } from 'next-intl/server'

import { ACTIVE_GAME_SESSION_COOKIE, getActiveGameSessionHref } from '@/lib/active-game-session'

import { CrossingExperience } from './_components/CrossingExperience/CrossingExperience'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Traversée — GRIMOIRE',
  robots: { index: false, follow: false },
}

export default async function CrossingPage() {
  const cookieStore = await cookies()
  const locale = await getLocale()
  return (
    <CrossingExperience
      english={locale === 'en'}
      resumeHref={getActiveGameSessionHref(cookieStore.get(ACTIVE_GAME_SESSION_COOKIE)?.value)}
    />
  )
}
