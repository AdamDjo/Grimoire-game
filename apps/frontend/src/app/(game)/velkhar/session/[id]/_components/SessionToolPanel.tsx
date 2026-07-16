import {
  ATTRIBUTE_LABELS,
  attributeModifier,
  type Character,
  type InventoryItemRef,
} from '@grimoire/shared'
import Link from 'next/link'

import { GameButton, GameIcon } from '@/components/ui/grimoire'

export type SessionTool = 'character' | 'inventory' | 'menu'

interface SessionToolPanelProps {
  character: Character
  inventory: InventoryItemRef[]
  openTool: SessionTool | null
  onClose: () => void
  source?: 'ai' | 'stub'
}

const ATTRIBUTE_ORDER = ['blood', 'breath', 'ash'] as const

export function SessionToolPanel({
  character,
  inventory,
  onClose,
  openTool,
  source,
}: SessionToolPanelProps) {
  if (!openTool) return null

  return (
    <div className="gs-tool-layer">
      <button
        aria-label="Dismiss panel"
        className="gs-tool-layer__backdrop"
        onClick={onClose}
        type="button"
      />
      <section
        aria-label={`${openTool} panel`}
        aria-modal="true"
        className="gs-tool-panel"
        role="dialog"
      >
        <div className="gs-tool-panel__header">
          <h2>
            {openTool === 'inventory'
              ? 'Field kit'
              : openTool === 'character'
                ? character.name
                : 'Session menu'}
          </h2>
          <GameButton aria-label="Close panel" onClick={onClose} size="sm" variant="icon">
            ×
          </GameButton>
        </div>

        {openTool === 'inventory' ? (
          inventory.length > 0 ? (
            <ul className="gs-tool-panel__inventory">
              {inventory.map((item) => (
                <li key={item.id}>
                  <GameIcon decorative name="artifact" size={32} />
                  <span>{item.name}</span>
                  <strong>×{item.quantity}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <div className="gs-tool-panel__empty">
              <GameIcon decorative name="chest" size={64} />
              <p>Your field kit is empty. What you find on the road will appear here.</p>
            </div>
          )
        ) : null}

        {openTool === 'character' ? (
          <>
            <p className="gs-tool-panel__story">{character.backstory}</p>
            <dl className="gs-tool-panel__attributes">
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
          <div className="gs-tool-panel__menu">
            <p>
              The Game Master is{' '}
              {source === 'ai' ? 'alive and listening' : 'using its fallback tale'}.
            </p>
            <Link href="/velkhar/aveugle?return=run">Return to the Blind One</Link>
            <Link href="/dashboard">Leave for the Chronicles</Link>
          </div>
        ) : null}
      </section>
    </div>
  )
}
