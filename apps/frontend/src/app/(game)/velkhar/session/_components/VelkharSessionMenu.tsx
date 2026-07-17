'use client'

import Link from 'next/link'
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
  const [confirmingAbandon, setConfirmingAbandon] = useState(false)

  if (confirmingAbandon) {
    return (
      <div
        className="velkhar-session-menu__confirmation"
        role="alertdialog"
        aria-label="Confirm abandon run"
      >
        <GameIcon decorative name="warning" size={64} />
        <h3>Abandon this run?</h3>
        <p>
          This ends the current character’s journey and starts Chronicle generation. It cannot be
          undone.
        </p>
        <div className="velkhar-session-menu__confirmation-actions">
          <GameButton disabled={ending} onClick={() => setConfirmingAbandon(false)} variant="ghost">
            Keep playing
          </GameButton>
          <GameButton loading={ending} onClick={() => void onAbandon()} tone="danger">
            Confirm abandon
          </GameButton>
        </div>
      </div>
    )
  }

  return (
    <div className="velkhar-session-menu">
      <p className="velkhar-session-menu__status">
        <span aria-hidden="true" data-online={source === 'ai'} />
        The Game Master is {source === 'ai' ? 'alive and listening' : 'using its fallback tale'}.
      </p>

      <GameButton leadingIcon={<GameIcon decorative name="arrow" size={24} />} onClick={onResume}>
        Resume the journey
      </GameButton>

      <GameButton
        disabled
        leadingIcon={<GameIcon decorative name="crafting" size={24} />}
        variant="ghost"
      >
        Settings — coming soon
      </GameButton>

      <Link
        className="velkhar-session-menu__link"
        href={`${VELKHAR_WORLD.routes.aveugle}?return=run`}
      >
        <GameIcon decorative name="hourglass" size={24} />
        Return to the Blind One
      </Link>

      <button
        className="velkhar-session-menu__danger"
        onClick={() => setConfirmingAbandon(true)}
        type="button"
      >
        Abandon this run
      </button>
    </div>
  )
}
