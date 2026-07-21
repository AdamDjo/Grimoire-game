import Link from 'next/link'
import { useTranslations } from 'next-intl'

import type { ChronicleAvailability } from '../model/chronicle.types'

interface ChronicleStateProps {
  onRetry: () => void
  status: Exclude<ChronicleAvailability, 'ready'>
}

export function ChronicleState({ onRetry, status }: ChronicleStateProps) {
  const t = useTranslations('Chronicle')
  const copy = {
    error: { title: t('errorTitle'), body: t('errorBody') },
    loading: { title: t('loadingTitle'), body: t('loadingBody') },
    'too-short': { title: t('tooShortTitle'), body: t('tooShortBody') },
    unavailable: { title: t('unavailableTitle'), body: t('unavailableBody') },
  }[status]
  return (
    <section
      className="chronicle-state"
      aria-live="polite"
      role={status === 'error' ? 'alert' : 'status'}
    >
      <span className="chronicle-state__mark" aria-hidden="true">
        V
      </span>
      <h1>{copy.title}</h1>
      <p>{copy.body}</p>
      {status === 'loading' ? (
        <div className="chronicle-state__progress" aria-hidden="true" />
      ) : null}
      {status === 'error' || status === 'unavailable' ? (
        <button type="button" onClick={onRetry}>
          {t('retry')}
        </button>
      ) : null}
      {status !== 'loading' ? (
        <Link href="/velkhar/aveugle?return=chronicle">{t('returnBlindOne')}</Link>
      ) : null}
    </section>
  )
}
