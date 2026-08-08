'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { ChronicleReader } from '@/features/chronicle/components/ChronicleReader'
import { ChronicleState } from '@/features/chronicle/components/ChronicleState'
import { useChronicle } from '@/features/chronicle/hooks/use-chronicle'

interface ChroniclePublicPageProps {
  slug: string
}

export function ChroniclePublicPage({ slug }: ChroniclePublicPageProps) {
  const t = useTranslations('Chronicle')
  const { chronicle, retry, status } = useChronicle({ kind: 'public', reference: slug })
  const fallbackStatus = status === 'ready' ? 'loading' : status

  return (
    <main className="chronicle-page">
      <nav className="chronicle-page__nav" aria-label={t('mainNavigation')}>
        <Link href="/" aria-label={t('home')}>
          GRIMOIRE
        </Link>
        <div className="chronicle-page__nav-actions">
          <span>{t('velkharTrace')}</span>
          <LanguageSwitcher variant="standalone" />
        </div>
      </nav>
      {status === 'ready' && chronicle ? (
        <ChronicleReader chronicle={chronicle} />
      ) : (
        <ChronicleState status={fallbackStatus} onRetry={retry} />
      )}
    </main>
  )
}
