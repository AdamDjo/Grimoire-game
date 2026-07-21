'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'

import { VELKHAR_WORLD } from '../../_config/velkhar-world'

interface VelkharSessionMenuProps {
  ending: boolean
  onAbandon: () => Promise<void>
  onResume: () => void
  source?: 'ai' | 'stub'
}

export function VelkharSessionMenu({
  ending,
  onAbandon,
  onResume,
  source,
}: VelkharSessionMenuProps) {
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
      <p className="velkhar-session-menu__status">
        <span aria-hidden="true" data-online={source === 'ai'} />
        {t('gameMasterStatus', {
          status: source === 'ai' ? t('gameMasterAlive') : t('gameMasterFallback'),
        })}
      </p>

      <GameButton leadingIcon={<GameIcon decorative name="arrow" size={24} />} onClick={onResume}>
        {t('resumeJourney')}
      </GameButton>

      <GameButton
        disabled
        leadingIcon={<GameIcon decorative name="crafting" size={24} />}
        variant="ghost"
      >
        {t('settingsSoon')}
      </GameButton>

      <Link
        className="velkhar-session-menu__link"
        href={`${VELKHAR_WORLD.routes.aveugle}?return=run`}
      >
        <GameIcon decorative name="hourglass" size={24} />
        {t('returnBlindOne')}
      </Link>

      <button
        className="velkhar-session-menu__danger"
        onClick={() => setConfirmingAbandon(true)}
        type="button"
      >
        {t('abandonRun')}
      </button>
    </div>
  )
}
