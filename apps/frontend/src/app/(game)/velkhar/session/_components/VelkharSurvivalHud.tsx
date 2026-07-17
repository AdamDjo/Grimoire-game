import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GameSessionHud } from '@/features/game-session/components/GameSessionHud'

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
    <GameSessionHud
      className="velkhar-session__hud"
      label="Character status and field kit"
      resource={{
        icon: <GameIcon decorative name="coin" size={32} />,
        label: 'Iron',
        value: '?',
      }}
      statusBars={[
        {
          id: 'health',
          icon: <GameIcon decorative name="blood-drop" size={24} />,
          label: 'Blood',
          max: survival.maxHp,
          tone: 'danger',
          value: survival.hp,
        },
        {
          id: 'breath',
          icon: <GameIcon decorative name="wind" size={24} />,
          label: 'Breath',
          max: 18,
          tone: 'aqua',
          value: attributes.breath,
        },
        {
          id: 'ash',
          icon: <GameIcon decorative name="fire" size={24} />,
          label: 'Ash',
          max: 18,
          tone: 'ember',
          value: attributes.ash,
        },
      ]}
      statusGauges={[
        {
          id: 'thirst',
          icon: <GameIcon decorative name="water" size={24} />,
          label: 'Thirst',
          max: 100,
          tone: 'aqua',
          value: survival.thirst,
        },
        {
          id: 'hunger',
          icon: <GameIcon decorative name="hunger" size={24} />,
          label: 'Hunger',
          max: 100,
          tone: 'ember',
          value: survival.hunger,
        },
        {
          id: 'fatigue',
          icon: <GameIcon decorative name="moon" size={24} />,
          label: 'Fatigue',
          max: 100,
          value: 100 - survival.energy,
        },
        {
          className: 'velkhar-session__calamine-ring',
          id: 'calamine',
          icon: <GameIcon decorative name="warning" size={24} />,
          label: 'Calamine',
          max: 100,
          value: survival.calamine,
        },
      ]}
      tools={[
        {
          id: 'inventory',
          icon: <GameIcon decorative name="chest" size={48} />,
          label: `Open inventory, ${inventory.length} items`,
          onClick: onOpenInventory,
        },
        {
          id: 'character',
          icon: <GameIcon decorative name="stranger" size={48} />,
          label: 'Open character sheet',
          onClick: onOpenCharacter,
        },
        {
          id: 'menu',
          icon: <GameIcon decorative name="journal" size={48} />,
          label: 'Open session menu',
          onClick: onOpenMenu,
        },
      ]}
    />
  )
}
