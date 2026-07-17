import { GameHudDock } from '@/components/ui/grimoire/GameHudDock/GameHudDock'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GameProgressRing } from '@/components/ui/grimoire/GameProgressRing/GameProgressRing'
import { InventoryQuickbar } from '@/components/ui/grimoire/InventoryQuickbar/InventoryQuickbar'
import { InventorySlot } from '@/components/ui/grimoire/InventorySlot/InventorySlot'
import { ResourceCounter } from '@/components/ui/grimoire/ResourceCounter/ResourceCounter'
import { StatBar } from '@/components/ui/grimoire/StatBar/StatBar'

import type { Attributes, InventoryItemRef, SurvivalStats } from '@grimoire/shared'

interface VelkharSurvivalHudProps {
  attributes: Attributes
  inventory: InventoryItemRef[]
  onOpenCharacter: () => void
  onOpenInventory: () => void
  onOpenMenu: () => void
  survival: SurvivalStats
}

/** Persistent combat and survival readout, tuned for glanceability during play. */
export function VelkharSurvivalHud({
  attributes,
  inventory,
  onOpenCharacter,
  onOpenInventory,
  onOpenMenu,
  survival,
}: VelkharSurvivalHudProps) {
  return (
    <GameHudDock className="velkhar-session__hud" label="Character status and field kit">
      <div className="velkhar-session__stats">
        <StatBar
          icon={<GameIcon decorative name="blood-drop" size={24} />}
          label="Blood"
          max={survival.maxHp}
          size="sm"
          tone="danger"
          value={survival.hp}
        />
        <StatBar
          icon={<GameIcon decorative name="wind" size={24} />}
          label="Breath"
          max={18}
          size="sm"
          tone="aqua"
          value={attributes.breath}
        />
        <StatBar
          icon={<GameIcon decorative name="fire" size={24} />}
          label="Ash"
          max={18}
          size="sm"
          tone="ember"
          value={attributes.ash}
        />
      </div>

      <div className="velkhar-session__rings">
        <GameProgressRing
          icon={<GameIcon decorative name="water" size={24} />}
          label="Thirst"
          max={100}
          size="sm"
          tone="aqua"
          value={survival.thirst}
        />
        <GameProgressRing
          icon={<GameIcon decorative name="hunger" size={24} />}
          label="Hunger"
          max={100}
          size="sm"
          tone="ember"
          value={survival.hunger}
        />
        <GameProgressRing
          icon={<GameIcon decorative name="moon" size={24} />}
          label="Fatigue"
          max={100}
          size="sm"
          value={100 - survival.energy}
        />
        <GameProgressRing
          className="velkhar-session__calamine-ring"
          icon={<GameIcon decorative name="warning" size={24} />}
          label="Calamine"
          max={100}
          size="sm"
          value={survival.calamine}
        />
      </div>

      <ResourceCounter
        compact
        icon={<GameIcon decorative name="coin" size={32} />}
        label="Iron"
        value="?"
      />

      <InventoryQuickbar className="velkhar-session__quickbar" label="Session tools">
        <InventorySlot
          icon={<GameIcon decorative name="chest" size={48} />}
          label={`Open inventory, ${inventory.length} items`}
          onClick={onOpenInventory}
        />
        <InventorySlot
          icon={<GameIcon decorative name="stranger" size={48} />}
          label="Open character sheet"
          onClick={onOpenCharacter}
        />
        <InventorySlot
          icon={<GameIcon decorative name="journal" size={48} />}
          label="Open session menu"
          onClick={onOpenMenu}
        />
      </InventoryQuickbar>
    </GameHudDock>
  )
}
