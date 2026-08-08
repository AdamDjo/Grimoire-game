interface SourceBadgeProps {
  source: 'ai' | 'stub'
}

/** Quiet diagnostic signal that never competes with the fiction. */
export function SourceBadge({ source }: SourceBadgeProps) {
  const t = useTranslations('Session')

  return (
    <span className="game-session-source" data-source={source} title={t('sceneSource')}>
      {source === 'ai' ? t('livingGameMaster') : t('fallbackTale')}
    </span>
  )
}
import { useTranslations } from 'next-intl'
