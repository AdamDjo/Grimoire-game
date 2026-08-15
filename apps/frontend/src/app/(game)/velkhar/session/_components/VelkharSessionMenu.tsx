'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { GameLink } from '@/components/ui/game-link'
import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

import { VELKHAR_WORLD } from '../../_config/velkhar-world'

interface VelkharSessionMenuProps {
  ending: boolean
  onAbandon: () => Promise<void>
  onResume: () => void
}

export function VelkharSessionMenu({ ending, onAbandon, onResume }: VelkharSessionMenuProps) {
  const t = useTranslations('Session')
  const [confirmingAbandon, setConfirmingAbandon] = useState(false)

  if (confirmingAbandon) {
    return (
      <div
        className="velkhar-session-menu__confirmation"
        role="alertdialog"
        aria-label={t('confirmAbandonLabel')}
      >
        <GameIcon decorative name="warning" size={64} />
        <h3>{t('abandonTitle')}</h3>
        <p>{t('abandonBody')}</p>
        <div className="velkhar-session-menu__confirmation-actions">
          <GameButton disabled={ending} onClick={() => setConfirmingAbandon(false)} variant="ghost">
            {t('keepPlaying')}
          </GameButton>
          <GameButton loading={ending} onClick={() => void onAbandon()} tone="danger">
            {t('confirmAbandon')}
          </GameButton>
        </div>
      </div>
    )
  }

  return (
    <div className="velkhar-session-menu">
      <LanguageSwitcher variant="menu" />

      <GameButton
        leadingIcon={<GameIcon decorative name="arrow" size={24} />}
        onClick={onResume}
        variant="secondary"
      >
        {t('resumeJourney')}
      </GameButton>

      <GameButton
        disabled
        leadingIcon={<GameIcon decorative name="crafting" size={24} />}
        variant="ghost"
      >
        {t('settingsSoon')}
      </GameButton>

      <GameLink
        href={`${VELKHAR_WORLD.routes.aveugle}?return=run`}
        leadingIcon={<GameIcon decorative name="hourglass" size={24} />}
        variant="secondary"
      >
        {t('returnBlindOne')}
      </GameLink>

      <GameButton onClick={() => setConfirmingAbandon(true)} tone="danger" variant="secondary">
        {t('abandonRun')}
      </GameButton>
    </div>
  )
}
