import Image from 'next/image'
import { useTranslations } from 'next-intl'

import type { InventoryItemRef, SurvivalStats } from '@grimoire/shared'
import type { CSSProperties } from 'react'

interface HudStatStyle extends CSSProperties {
  '--hud-stat-value': string
}

interface VelkharSurvivalHudProps {
  inventory: InventoryItemRef[]
  onOpenCharacter: () => void
  onOpenInventory: () => void
  onOpenMenu: () => void
  survival: SurvivalStats
}

/** Persistent combat and survival readout, tuned for glanceability during play. */
export function VelkharSurvivalHud({
  inventory,
  onOpenCharacter,
  onOpenInventory,
  onOpenMenu,
  survival,
}: VelkharSurvivalHudProps) {
  const t = useTranslations('Session')
  const stats = [
    {
      id: 'blood',
      icon: '/encre-de-sel/icons/blood.webp',
      label: t('blood'),
      max: survival.maxHp,
      tone: 'blood',
      value: survival.hp,
    },
    {
      id: 'breath',
      icon: '/encre-de-sel/icons/breath.webp',
      label: t('breath'),
      max: 100,
      tone: 'breath',
      value: survival.energy,
    },
    {
      id: 'hunger',
      icon: '/encre-de-sel/icons/hunger.webp',
      label: t('hunger'),
      max: 100,
      tone: 'hunger',
      value: survival.hunger,
    },
    {
      id: 'thirst',
      icon: '/encre-de-sel/icons/thirst.webp',
      label: t('thirst'),
      max: 100,
      tone: 'thirst',
      value: survival.thirst,
    },
    {
      id: 'calamine',
      icon: '/encre-de-sel/icons/calamine.webp',
      label: t('calamine'),
      max: 100,
      tone: 'calamine',
      value: survival.calamine,
    },
  ]

  return (
    <aside className="velkhar-survival-hud" aria-label={t('hudLabel')}>
      <div className="velkhar-survival-hud__stats">
        {stats.map((stat) => {
          const safeMax = Math.max(1, stat.max)
          const safeValue = Math.min(Math.max(0, stat.value), safeMax)
          const style: HudStatStyle = {
            '--hud-stat-value': `${Math.round((safeValue / safeMax) * 100)}%`,
          }

          return (
            <div
              key={stat.id}
              aria-label={stat.label}
              aria-valuemax={safeMax}
              aria-valuemin={0}
              aria-valuenow={safeValue}
              className="velkhar-survival-hud__stat"
              data-tone={stat.tone}
              role="progressbar"
              style={style}
            >
              <span className="velkhar-survival-hud__stat-icon" aria-hidden="true">
                <Image alt="" height={87} src={stat.icon} width={102} />
              </span>
              <span className="velkhar-survival-hud__stat-copy">
                <span className="velkhar-survival-hud__stat-heading">
                  <strong>{stat.label}</strong>
                  <span>
                    {safeValue}/{safeMax}
                  </span>
                </span>
                <span className="velkhar-survival-hud__stat-track" aria-hidden="true" />
              </span>
            </div>
          )
        })}
      </div>

      <div className="velkhar-survival-hud__tools" aria-label={t('sessionTools')} role="toolbar">
        <button
          type="button"
          aria-label={t('openInventory', { count: inventory.length })}
          onClick={onOpenInventory}
        >
          <Image alt="" fill sizes="82px" src="/encre-de-sel/icons/inventory-tile.webp" />
        </button>
        <button type="button" aria-label={t('openCharacter')} onClick={onOpenCharacter}>
          <Image alt="" fill sizes="82px" src="/encre-de-sel/icons/journal-tile.webp" />
        </button>
        <button type="button" aria-label={t('openMenu')} onClick={onOpenMenu}>
          <Image alt="" fill sizes="82px" src="/encre-de-sel/icons/character-tile.webp" />
        </button>
      </div>
    </aside>
  )
}
