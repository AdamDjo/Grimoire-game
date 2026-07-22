'use client'

import { useTranslations } from 'next-intl'

import { SystemState } from '@/components/system/SystemState/SystemState'
import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'

interface MainErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MainError({ reset }: MainErrorProps) {
  const t = useTranslations('System')

  return (
    <SystemState
      eyebrow={t('mainErrorEyebrow')}
      title={t('mainErrorTitle')}
      body={t('mainErrorBody')}
      action={
        <GameButton onClick={reset} size="sm" variant="secondary">
          {t('retry')}
        </GameButton>
      }
    />
  )
}
