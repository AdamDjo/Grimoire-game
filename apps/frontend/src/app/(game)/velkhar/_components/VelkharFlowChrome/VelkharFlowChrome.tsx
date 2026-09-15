'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { GameTopBar } from '@/components/ui/grimoire/GameTopBar/GameTopBar'
import { cn } from '@/lib/utils'

import { VELKHAR_WORLD } from '../../_config/velkhar-world'

import type { ReactNode } from 'react'

import './velkhar-flow-chrome.css'

interface VelkharFlowTopBarProps {
  className?: string
  location: string
  region: string
  startHref?: string
  titleAriaLabel?: string
  tools?: ReactNode
}

export function VelkharFlowTopBar({
  className,
  location,
  region,
  startHref = VELKHAR_WORLD.routes.aveugle,
  titleAriaLabel,
  tools,
}: VelkharFlowTopBarProps) {
  const t = useTranslations('Session')

  return (
    <GameTopBar
      className={cn('velkhar-flow-topbar', className)}
      label={t('mainNavigation')}
      start={
        <div className="game-top-bar__nav velkhar-flow-topbar__nav">
          <Link href={startHref}>{VELKHAR_WORLD.name}</Link>
          <span aria-hidden="true">|</span>
          <span>{region}</span>
        </div>
      }
      center={
        <strong aria-label={titleAriaLabel} className="game-top-bar__title">
          {location}
        </strong>
      }
      end={
        tools ?? (
          <div className="game-top-bar__nav velkhar-flow-topbar__nav velkhar-flow-topbar__nav--muted">
            <span>{t('navMap')}</span>
            <span aria-hidden="true">|</span>
            <span>{t('navJournal')}</span>
            <span aria-hidden="true">|</span>
            <span>{t('navOptions')}</span>
          </div>
        )
      }
    />
  )
}

const DORMANT_STATS = [
  { id: 'blood', icon: '/encre-de-sel/icons/blood.webp', key: 'blood' },
  { id: 'breath', icon: '/encre-de-sel/icons/breath.webp', key: 'breath' },
  { id: 'hunger', icon: '/encre-de-sel/icons/hunger.webp', key: 'hunger' },
  { id: 'thirst', icon: '/encre-de-sel/icons/thirst.webp', key: 'thirst' },
  { id: 'calamine', icon: '/encre-de-sel/icons/calamine.webp', key: 'calamine' },
] as const

/** Conserve la géométrie du HUD avant que ses valeurs existent réellement. */
export function VelkharDormantHud() {
  const t = useTranslations('Session')

  return (
    <aside className="velkhar-flow-hud" aria-label={t('hudLabel')}>
      <div className="velkhar-flow-hud__stats">
        {DORMANT_STATS.map((stat) => (
          <div className="velkhar-flow-hud__stat" data-tone={stat.id} key={stat.id}>
            <span className="velkhar-flow-hud__stat-icon" aria-hidden="true">
              <Image alt="" height={87} src={stat.icon} width={102} />
            </span>
            <span className="velkhar-flow-hud__stat-copy">
              <span className="velkhar-flow-hud__stat-heading">
                <strong>{t(stat.key)}</strong>
                <span aria-hidden="true">?</span>
              </span>
              <span className="velkhar-flow-hud__stat-track" aria-hidden="true" />
            </span>
          </div>
        ))}
      </div>

      <div className="velkhar-flow-hud__tools" aria-label={t('sessionTools')} role="toolbar">
        <button aria-label={t('openInventory', { count: 0 })} disabled type="button">
          <Image alt="" fill sizes="82px" src="/encre-de-sel/icons/inventory-tile.webp" />
        </button>
        <button aria-label={t('openCharacter')} disabled type="button">
          <Image alt="" fill sizes="82px" src="/encre-de-sel/icons/journal-tile.webp" />
        </button>
        <button aria-label={t('openMenu')} disabled type="button">
          <Image alt="" fill sizes="82px" src="/encre-de-sel/icons/character-tile.webp" />
        </button>
      </div>
    </aside>
  )
}
