import { cookies } from 'next/headers'
import { getLocale } from 'next-intl/server'

import { ACTIVE_GAME_SESSION_COOKIE, getActiveGameSessionHref } from '@/lib/active-game-session'

import { CrossingExperience } from './_components/CrossingExperience/CrossingExperience'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Traversée — GRIMOIRE',
  description:
    'Tente l’impossible dans un roguelike narratif solo où tes mots ouvrent la voie et chaque décision laisse une trace.',
  alternates: { canonical: '/traversee' },
  openGraph: {
    type: 'website',
    title: 'La Traversée — GRIMOIRE',
    description:
      'Tes mots ouvrent la voie. Les règles décident. Entre dans un roguelike narratif où chaque choix transforme la suite.',
    url: '/traversee',
    siteName: 'GRIMOIRE — Of Ash and Salt',
    images: [
      {
        url: '/encre-de-sel/landing/partie.webp',
        width: 1672,
        height: 941,
        alt: 'Les falaises de Sel dans GRIMOIRE — Of Ash and Salt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Traversée — GRIMOIRE',
    description:
      'Tes mots ouvrent la voie. Les règles décident. Entre dans un roguelike narratif où chaque choix transforme la suite.',
    images: ['/encre-de-sel/landing/partie.webp'],
  },
  robots: { index: true, follow: true },
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
