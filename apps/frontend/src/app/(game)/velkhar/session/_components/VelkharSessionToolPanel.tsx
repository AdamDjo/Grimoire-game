import {
  ATTRIBUTE_LABELS,
  attributeModifier,
  type Character,
  type InventoryItemRef,
} from '@grimoire/shared'
import Link from 'next/link'

import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GameWindow } from '@/components/ui/grimoire/GameWindow/GameWindow'

import { VELKHAR_WORLD } from '../../_config/velkhar-world'

export type VelkharSessionTool = 'character' | 'inventory' | 'menu'

interface VelkharSessionToolPanelProps {
  character: Character
  inventory: InventoryItemRef[]
  openTool: VelkharSessionTool | null
  onClose: () => void
  source?: 'ai' | 'stub'
}

const ATTRIBUTE_ORDER = ['blood', 'breath', 'ash'] as const

export function VelkharSessionToolPanel({
  character,
  inventory,
  onClose,
  openTool,
  source,
}: VelkharSessionToolPanelProps) {
  if (!openTool) return null

  return (
    <GameWindow
      className="velkhar-session-window"
      label={`${openTool} panel`}
      onClose={onClose}
      title={
        openTool === 'inventory'
          ? 'Field kit'
          : openTool === 'character'
            ? character.name
            : 'Session menu'
      }
    >
      {openTool === 'inventory' ? (
        inventory.length > 0 ? (
          <ul className="velkhar-session-window__inventory">
            {inventory.map((item) => (
              <li key={item.id}>
                <GameIcon decorative name="artifact" size={32} />
                <span>{item.name}</span>
                <strong>×{item.quantity}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <div className="velkhar-session-window__empty">
            <GameIcon decorative name="chest" size={64} />
            <p>Your field kit is empty. What you find on the road will appear here.</p>
          </div>
        )
      ) : null}

      {openTool === 'character' ? (
        <>
          <p className="velkhar-session-window__story">{character.backstory}</p>
          <dl className="velkhar-session-window__attributes">
            {ATTRIBUTE_ORDER.map((attribute) => {
              const value = character.stats.attributes[attribute]
              const modifier = attributeModifier(value)
              return (
                <div key={attribute}>
                  <dt>{ATTRIBUTE_LABELS[attribute].en}</dt>
                  <dd>
                    {value} <small>{modifier >= 0 ? `+${modifier}` : modifier}</small>
                  </dd>
                </div>
              )
            })}
          </dl>
        </>
      ) : null}

      {openTool === 'menu' ? (
        <div className="velkhar-session-window__menu">
          <p>
            The Game Master is {source === 'ai' ? 'alive and listening' : 'using its fallback tale'}
            .
          </p>
          <Link href={`${VELKHAR_WORLD.routes.aveugle}?return=run`}>Return to the Blind One</Link>
          <Link href="/dashboard">Leave for the Chronicles</Link>
        </div>
      ) : null}
    </GameWindow>
  )
}
