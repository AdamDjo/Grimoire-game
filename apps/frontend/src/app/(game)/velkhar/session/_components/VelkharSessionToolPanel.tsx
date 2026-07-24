import { useTranslations } from 'next-intl'

import { GameWindow } from '@/components/ui/grimoire/GameWindow/GameWindow'

import { VelkharCharacterSheet } from './VelkharCharacterSheet'
import { VelkharInventoryPanel } from './VelkharInventoryPanel'
import { VelkharSessionMenu } from './VelkharSessionMenu'

import type { Character, InventoryItemRef, SurvivalStats } from '@grimoire/shared'

export type VelkharSessionTool = 'character' | 'inventory' | 'menu'

interface VelkharSessionToolPanelProps {
  character: Character
  ending: boolean
  iron: number | null
  inventory: InventoryItemRef[]
  openTool: VelkharSessionTool | null
  onAbandon: () => Promise<void>
  onClose: () => void
  onInventoryAction: (item: InventoryItemRef, action: 'use' | 'equip' | 'unequip') => void
  source?: 'ai' | 'stub'
  survival: SurvivalStats
}

export function VelkharSessionToolPanel({
  character,
  ending,
  iron,
  inventory,
  onAbandon,
  onClose,
  onInventoryAction,
  openTool,
  source,
  survival,
}: VelkharSessionToolPanelProps) {
  const t = useTranslations('Session')
  if (!openTool) return null

  return (
    <GameWindow
      className="velkhar-session-window"
      closeLabel={t('closePanel')}
      dismissLabel={t('closePanel')}
      label={
        openTool === 'inventory'
          ? t('inventoryPanel')
          : openTool === 'character'
            ? t('characterPanel')
            : t('sessionMenu')
      }
      onClose={onClose}
      title={
        openTool === 'inventory'
          ? t('fieldKit')
          : openTool === 'character'
            ? character.name
            : t('sessionMenu')
      }
    >
      {openTool === 'inventory' ? (
        <VelkharInventoryPanel iron={iron} items={inventory} onAction={onInventoryAction} />
      ) : null}

      {openTool === 'character' ? (
        <VelkharCharacterSheet character={character} survival={survival} />
      ) : null}

      {openTool === 'menu' ? (
        <VelkharSessionMenu
          ending={ending}
          onAbandon={onAbandon}
          onResume={onClose}
          source={source}
        />
      ) : null}
    </GameWindow>
  )
}
