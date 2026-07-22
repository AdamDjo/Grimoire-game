import { getTranslations } from 'next-intl/server'

import { SystemState } from '@/components/system/SystemState/SystemState'
import { GameLink } from '@/components/ui/game-link'

export default async function MainNotFound() {
  const t = await getTranslations('System')

  return (
    <SystemState
      eyebrow={t('mainNotFoundEyebrow')}
      title={t('mainNotFoundTitle')}
      body={t('mainNotFoundBody')}
      action={
        <GameLink href="/dashboard" size="sm" variant="secondary">
          {t('backChronicles')}
        </GameLink>
      }
    />
  )
}
