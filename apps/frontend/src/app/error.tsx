'use client'

import { useTranslations } from 'next-intl'

import { SystemState } from '@/components/system/SystemState/SystemState'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  const t = useTranslations('System')

  return (
    <SystemState
      eyebrow={t('errorEyebrow')}
      title={t('errorTitle')}
      body={t('errorBody')}
      action={
        <button className="system-state__action" type="button" onClick={reset}>
          {t('resume')}
        </button>
      }
    />
  )
}
