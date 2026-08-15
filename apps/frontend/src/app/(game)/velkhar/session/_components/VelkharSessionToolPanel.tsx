import { useTranslations } from 'next-intl'

import { GameWindow } from '@/components/ui/grimoire/GameWindow/GameWindow'
import { cn } from '@/lib/utils'

import { VelkharCharacterSheet } from './VelkharCharacterSheet'
import { VelkharInventoryPanel } from './VelkharInventoryPanel'
import { VelkharSessionMenu } from './VelkharSessionMenu'

import type { ActiveCondition, Character, InventoryItemRef, SurvivalStats } from '@grimoire/shared'

export type VelkharSessionTool = 'character' | 'inventory' | 'menu'

interface VelkharSessionToolPanelProps {
  character: Character
  conditions: ActiveCondition[]
  ending: boolean
  gold: number | null
  inventory: InventoryItemRef[]
  openTool: VelkharSessionTool | null
  onAbandon: () => Promise<void>
  onClose: () => void
  onInventoryAction: (item: InventoryItemRef, action: 'use' | 'equip' | 'unequip') => void
  survival: SurvivalStats
}

export function VelkharSessionToolPanel({
  character,
  conditions,
  ending,
  gold,
  inventory,
  onAbandon,
  onClose,
  onInventoryAction,
  openTool,
  survival,
}: VelkharSessionToolPanelProps) {
  const t = useTranslations('Session')
  if (!openTool) return null

  return (
    <GameWindow
      className={cn(
        'velkhar-session-window',
        openTool === 'inventory' && 'velkhar-session-window--inventory'
      )}
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
        <VelkharInventoryPanel gold={gold} items={inventory} onAction={onInventoryAction} />
      ) : null}

      {openTool === 'character' ? (
        <VelkharCharacterSheet character={character} conditions={conditions} survival={survival} />
      ) : null}

      {openTool === 'menu' ? (
        <VelkharSessionMenu ending={ending} onAbandon={onAbandon} onResume={onClose} />
      ) : null}
    </GameWindow>
  )
}
