'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { useChronicle } from '../hooks/use-chronicle'

import { ChronicleReader } from './ChronicleReader'
import { ChronicleState } from './ChronicleState'

interface ChronicleEndExperienceProps {
  sessionId: string | null
  turnCount: number
}

export function ChronicleEndExperience({ sessionId, turnCount }: ChronicleEndExperienceProps) {
  const t = useTranslations('Session')
  const [transitionComplete, setTransitionComplete] = useState(false)
  const { chronicle, retry, status } = useChronicle({
    kind: 'session',
    reference: sessionId,
    tooShort: turnCount < 5,
  })

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const timeout = window.setTimeout(() => setTransitionComplete(true), reducedMotion ? 0 : 2400)
    return () => window.clearTimeout(timeout)
  }, [])

  if (!transitionComplete) {
    return (
      <section className="chronicle-transition" role="status" aria-live="polite">
        <span aria-hidden="true" />
        <p>{t('chronicleTransition')}</p>
      </section>
    )
  }

  if (status === 'ready' && chronicle) return <ChronicleReader chronicle={chronicle} inline />
  const fallbackStatus = status === 'ready' ? 'loading' : status
  return <ChronicleState status={fallbackStatus} onRetry={retry} />
}
