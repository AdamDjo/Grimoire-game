'use client'

import Link from 'next/link'

import { ChronicleReader } from '@/features/chronicle/components/ChronicleReader'
import { ChronicleState } from '@/features/chronicle/components/ChronicleState'
import { useChronicle } from '@/features/chronicle/hooks/use-chronicle'

interface ChroniclePublicPageProps {
  slug: string
}

export function ChroniclePublicPage({ slug }: ChroniclePublicPageProps) {
  const { chronicle, retry, status } = useChronicle({ kind: 'public', reference: slug })
  const fallbackStatus = status === 'ready' ? 'loading' : status

  return (
    <main className="chronicle-page">
      <nav className="chronicle-page__nav" aria-label="Navigation principale">
        <Link href="/" aria-label="Accueil de Grimoire">
          GRIMOIRE
        </Link>
        <span>Une trace de Velkhar</span>
      </nav>
      {status === 'ready' && chronicle ? (
        <ChronicleReader chronicle={chronicle} />
      ) : (
        <ChronicleState status={fallbackStatus} onRetry={retry} />
      )}
    </main>
  )
}
