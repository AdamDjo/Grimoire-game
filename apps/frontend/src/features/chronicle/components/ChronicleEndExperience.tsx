'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { useChronicle } from '../hooks/use-chronicle'

import { ChronicleReader } from './ChronicleReader'
import { ChronicleState } from './ChronicleState'

import type { SessionEndReason } from '@grimoire/shared'

interface ChronicleEndExperienceProps {
  endReason?: SessionEndReason | null
  sessionId: string | null
  turnCount: number
}

export function ChronicleEndExperience({
  endReason,
  sessionId,
  turnCount,
}: ChronicleEndExperienceProps) {
  const t = useTranslations('Session')
  const [transitionComplete, setTransitionComplete] = useState(false)
  const { chronicle, retry, status } = useChronicle({
    kind: 'session',
    reference: sessionId,
    tooShort: turnCount < 5,
  })

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const transitionDuration =
      endReason === 'calcined' ? (reducedMotion ? 1200 : 3200) : reducedMotion ? 0 : 2400
    const timeout = window.setTimeout(() => setTransitionComplete(true), transitionDuration)
    return () => window.clearTimeout(timeout)
  }, [endReason])

  if (!transitionComplete) {
    return (
      <section
        className="chronicle-transition"
        data-end-reason={endReason ?? undefined}
        role="status"
        aria-live="polite"
      >
        <span aria-hidden="true" />
        {endReason === 'calcined' ? <strong>{t('calcinedTitle')}</strong> : null}
        <p>{endReason === 'calcined' ? t('calcinedTransition') : t('chronicleTransition')}</p>
      </section>
    )
  }

  if (status === 'ready' && chronicle) return <ChronicleReader chronicle={chronicle} inline />
  const fallbackStatus = status === 'ready' ? 'loading' : status
  return <ChronicleState status={fallbackStatus} onRetry={retry} />
}
