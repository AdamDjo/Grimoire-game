'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { getAuthHref } from '@/lib/internal-navigation'
import { getAnonymousRequestsRemaining, useSessionStore } from '@/stores/session-store'

export function SoftSignupPrompt() {
  const pathname = usePathname()
  const anonymousRequestCount = useSessionStore((state) => state.anonymousRequestCount)
  const showSoftPrompt = useSessionStore((state) => state.showSoftPrompt)
  const dismissSoftPrompt = useSessionStore((state) => state.dismissSoftPrompt)
  const remaining = getAnonymousRequestsRemaining(anonymousRequestCount)

  if (!showSoftPrompt) {
    return null
  }

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-50 flex flex-wrap items-center justify-center gap-4 border-t border-gold-dark bg-ash/95 px-6 py-4 text-center"
    >
      <p className="m-0 font-manuscript text-parchment">
        {remaining > 0
          ? `${remaining} actions anonymes restantes sur cet appareil. Conserve cette aventure gratuitement.`
          : 'La limite anonyme est atteinte. Conserve cette aventure pour continuer.'}
      </p>
      <Link
        href={getAuthHref('/signup', pathname)}
        className="font-accent text-gold-soft underline"
      >
        Conserver ma trace
      </Link>
      <button
        type="button"
        onClick={dismissSoftPrompt}
        className="font-accent text-parchment/70 underline"
      >
        Plus tard
      </button>
    </div>
  )
}
