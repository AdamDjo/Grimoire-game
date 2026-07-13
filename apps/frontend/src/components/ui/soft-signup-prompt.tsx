'use client'

import Link from 'next/link'

import { useSessionStore } from '@/stores/session-store'

export function SoftSignupPrompt() {
  const showSoftPrompt = useSessionStore((state) => state.showSoftPrompt)
  const dismissSoftPrompt = useSessionStore((state) => state.dismissSoftPrompt)

  if (!showSoftPrompt) {
    return null
  }

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-50 flex flex-wrap items-center justify-center gap-4 border-t border-gold-dark bg-ash/95 px-6 py-4 text-center"
    >
      <p className="m-0 font-manuscript text-parchment">
        Crée un compte pour continuer ton aventure sans limite.
      </p>
      <Link href="/signup" className="font-accent text-gold-soft underline">
        Créer un compte
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
