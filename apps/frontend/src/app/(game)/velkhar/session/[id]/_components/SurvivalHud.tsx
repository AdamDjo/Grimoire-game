import {
  GameHudDock,
  GameIcon,
  GameProgressRing,
  InventoryQuickbar,
  InventorySlot,
  ResourceCounter,
  StatBar,
} from '@/components/ui/grimoire'

import type { Attributes, InventoryItemRef, SurvivalStats } from '@grimoire/shared'

interface SurvivalHudProps {
  attributes: Attributes
  inventory: InventoryItemRef[]
  onOpenCharacter: () => void
  onOpenInventory: () => void
  onOpenMenu: () => void
  survival: SurvivalStats
}

/** Persistent combat and survival readout, tuned for glanceability during play. */
export function SurvivalHud({
  attributes,
  inventory,
  onOpenCharacter,
  onOpenInventory,
  onOpenMenu,
  survival,
}: SurvivalHudProps) {
  return (
    <GameHudDock className="gs-hud" label="Character status and field kit">
      <div className="gs-stats">
        <StatBar
          icon={<GameIcon decorative name="blood-drop" size={24} />}
          label="Blood"
          max={survival.maxHp}
          size="sm"
          tone="sang"
          value={survival.hp}
        />
        <StatBar
          icon={<GameIcon decorative name="wind" size={24} />}
          label="Breath"
          max={18}
          size="sm"
          tone="souffle"
          value={attributes.breath}
        />
        <StatBar
          icon={<GameIcon decorative name="fire" size={24} />}
          label="Ash"
          max={18}
          size="sm"
          tone="cendre"
          value={attributes.ash}
        />
      </div>

      <div className="gs-rings">
        <GameProgressRing
          icon={<GameIcon decorative name="water" size={24} />}
          label="Thirst"
          max={100}
          size="sm"
          tone="souffle"
          value={survival.thirst}
        />
        <GameProgressRing
          icon={<GameIcon decorative name="hunger" size={24} />}
          label="Hunger"
          max={100}
          size="sm"
          tone="cendre"
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
          className="gs-calamine-ring"
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

      <InventoryQuickbar className="gs-quickbar" label="Session tools">
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
