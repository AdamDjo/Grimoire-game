import { useTranslations } from 'next-intl'

import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GameSessionHud } from '@/features/game-session/components/GameSessionHud'

import { VelkharActiveConditions } from './VelkharActiveConditions'

import type { ActiveCondition, InventoryItemRef, SurvivalStats } from '@grimoire/shared'

interface VelkharSurvivalHudProps {
  conditions: ActiveCondition[]
  gold: number
  inventory: InventoryItemRef[]
  onOpenCharacter: () => void
  onOpenInventory: () => void
  onOpenMenu: () => void
  survival: SurvivalStats
}

/** Persistent combat and survival readout, tuned for glanceability during play. */
export function VelkharSurvivalHud({
  conditions,
  gold,
  inventory,
  onOpenCharacter,
  onOpenInventory,
  onOpenMenu,
  survival,
}: VelkharSurvivalHudProps) {
  const t = useTranslations('Session')

  return (
    <GameSessionHud
      className="velkhar-session__hud"
      label={t('hudLabel')}
      resource={{
        icon: <GameIcon decorative name="coin" size={32} />,
        label: t('gold'),
        value: gold,
      }}
      statusBars={[
        {
          id: 'health',
          icon: <GameIcon decorative name="blood-drop" size={32} />,
          label: t('healthPoints'),
          max: survival.maxHp,
          tone: 'danger',
          value: survival.hp,
        },
      ]}
      statusDetail={
        <VelkharActiveConditions
          conditions={conditions}
          isDying={survival.isDying}
          neglectStreak={survival.neglectStreak}
          variant="hud"
        />
      }
      statusGauges={[
        {
          id: 'thirst',
          icon: <GameIcon decorative name="water" size={32} />,
          label: t('thirst'),
          max: 100,
          tone: 'aqua',
          value: survival.thirst,
        },
        {
          id: 'hunger',
          icon: <GameIcon decorative name="hunger" size={32} />,
          label: t('hunger'),
          max: 100,
          tone: 'ember',
          value: survival.hunger,
        },
        {
          id: 'fatigue',
          icon: <GameIcon decorative name="moon" size={32} />,
          label: t('fatigue'),
          max: 100,
          value: 100 - survival.energy,
        },
        {
          className: 'velkhar-session__calamine-ring',
          id: 'calamine',
          icon: <GameIcon decorative name="warning" size={32} />,
          label: t('calamine'),
          max: 100,
          tone: 'danger',
          value: survival.calamine,
        },
      ]}
      toolLabel={t('sessionTools')}
      tools={[
        {
          id: 'inventory',
          icon: <GameIcon decorative name="chest" size={48} />,
          label: t('openInventory', { count: inventory.length }),
          onClick: onOpenInventory,
        },
        {
          id: 'character',
          icon: <GameIcon decorative name="stranger" size={48} />,
          label: t('openCharacter'),
          onClick: onOpenCharacter,
        },
        {
          id: 'menu',
          icon: <GameIcon decorative name="journal" size={48} />,
          label: t('openMenu'),
          onClick: onOpenMenu,
        },
      ]}
    />
  )
}
