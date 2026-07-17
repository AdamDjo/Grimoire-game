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
  openTool,
  source,
  survival,
}: VelkharSessionToolPanelProps) {
  if (!openTool) return null

  return (
    <GameWindow
      className="velkhar-session-window"
      label={
        openTool === 'inventory'
          ? 'Inventory panel'
          : openTool === 'character'
            ? 'Character panel'
            : 'Session menu'
      }
      onClose={onClose}
      title={
        openTool === 'inventory'
          ? 'Field kit'
          : openTool === 'character'
            ? character.name
            : 'Session menu'
      }
    >
      {openTool === 'inventory' ? <VelkharInventoryPanel iron={iron} items={inventory} /> : null}

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
