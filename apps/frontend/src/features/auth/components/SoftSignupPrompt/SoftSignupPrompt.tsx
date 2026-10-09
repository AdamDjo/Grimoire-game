'use client'

import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { GameLink } from '@/components/ui/game-link'
import { GameButton } from '@/components/ui/velkhar/GameButton/GameButton'
import { getAuthHref } from '@/lib/internal-navigation'
import { getAnonymousRequestsRemaining, useSessionStore } from '@/stores/session-store'

import './soft-signup-prompt.css'

export function SoftSignupPrompt() {
  const t = useTranslations('Session')
  const pathname = usePathname()
  const anonymousRequestCount = useSessionStore((state) => state.anonymousRequestCount)
  const showSoftPrompt = useSessionStore((state) => state.showSoftPrompt)
  const dismissSoftPrompt = useSessionStore((state) => state.dismissSoftPrompt)
  const remaining = getAnonymousRequestsRemaining(anonymousRequestCount)

  if (!showSoftPrompt) {
    return null
  }

  return (
    <aside className="soft-signup-prompt" aria-label={t('keepTrace')}>
      <p className="soft-signup-prompt__copy" aria-live="polite">
        {remaining > 0 ? t('softPromptRemaining', { count: remaining }) : t('softPromptLimit')}
      </p>
      <div className="soft-signup-prompt__actions">
        <GameLink
          className="soft-signup-prompt__save"
          href={getAuthHref('/signup', pathname)}
          size="sm"
          variant="primary"
        >
          {t('keepTrace')}
        </GameLink>
        <GameButton onClick={dismissSoftPrompt} size="sm" type="button" variant="ghost">
          {t('later')}
        </GameButton>
      </div>
    </aside>
  )
}
