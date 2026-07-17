'use client'

import { useMemo, useState } from 'react'

import { GameIcon, type GameIconName } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { InventorySlot } from '@/components/ui/grimoire/InventorySlot/InventorySlot'
import { cn } from '@/lib/utils'

import { buildVelkharInventoryView, VELKHAR_BAG_CAPACITY } from '../_lib/velkhar-inventory-model'

import type { InventoryItemRef } from '@grimoire/shared'

interface VelkharInventoryPanelProps {
  iron: number | null
  items: InventoryItemRef[]
}

function itemIcon(item: InventoryItemRef): GameIconName {
  if (item.category === 'artifact' || item.category === 'heirloom') return 'artifact'
  if (item.category === 'key') return 'key'
  if (item.category === 'equipment') return 'crossed-swords'
  return 'chest'
}

interface ItemSlotProps {
  fallbackIcon: GameIconName
  item: InventoryItemRef | null
  label: string
  onSelect: (item: InventoryItemRef) => void
  selectedId: string | null
}

function ItemSlot({ fallbackIcon, item, label, onSelect, selectedId }: ItemSlotProps) {
  const unavailable = !item || item.state === 'locked' || item.state === 'pending'
  const stateLabel =
    item?.state === 'locked' ? ', locked' : item?.state === 'pending' ? ', pending' : ''
  const equippedLabel = item?.equippedSlot ? ', equipped' : ''

  return (
    <div
      className={cn(
        'velkhar-inventory-slot',
        item?.equippedSlot && 'velkhar-inventory-slot--equipped',
        item?.state === 'locked' && 'velkhar-inventory-slot--locked',
        item?.state === 'pending' && 'velkhar-inventory-slot--pending'
      )}
    >
      <InventorySlot
        disabled={unavailable}
        icon={<GameIcon decorative name={item ? itemIcon(item) : fallbackIcon} size={48} />}
        label={item ? `${label}: ${item.name}${equippedLabel}${stateLabel}` : `${label}, empty`}
        quantity={item && item.quantity > 1 ? item.quantity : undefined}
        selected={item?.id === selectedId}
        onClick={() => item && onSelect(item)}
      />
      <span aria-hidden="true">{item?.name ?? label}</span>
    </div>
  )
}

export function VelkharInventoryPanel({ iron, items }: VelkharInventoryPanelProps) {
  const inventory = useMemo(() => buildVelkharInventoryView(items), [items])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedItem = items.find((item) => item.id === selectedId) ?? null
  const bagSlots = Array.from(
    { length: VELKHAR_BAG_CAPACITY },
    (_, index) => inventory.bagItems[index] ?? null
  )

  return (
    <div className="velkhar-inventory">
      <div className="velkhar-inventory__summary" aria-label="Inventory summary">
        <span>
          <GameIcon decorative name="coin" size={24} /> Iron <strong>{iron ?? '—'}</strong>
        </span>
        <span>
          <GameIcon decorative name="chest" size={24} /> Bag{' '}
          <strong>
            {inventory.bagItems.length}/{VELKHAR_BAG_CAPACITY}
          </strong>
        </span>
      </div>

      <section aria-labelledby="velkhar-equipment-title">
        <div className="velkhar-session-window__section-heading">
          <h3 id="velkhar-equipment-title">Worn equipment</h3>
          <span>8 fixed slots</span>
        </div>
        <div className="velkhar-inventory__grid velkhar-inventory__grid--equipment">
          {inventory.equipment.map((slot) => (
            <ItemSlot
              key={slot.id}
              fallbackIcon={slot.icon}
              item={slot.item}
              label={slot.label}
              selectedId={selectedId}
              onSelect={(item) => setSelectedId(item.id)}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="velkhar-bag-title">
        <div className="velkhar-session-window__section-heading">
          <h3 id="velkhar-bag-title">Bag</h3>
          <span>12 slots</span>
        </div>
        <div className="velkhar-inventory__grid velkhar-inventory__grid--bag">
          {bagSlots.map((item, index) => (
            <ItemSlot
              key={item?.id ?? `bag-slot-${index}`}
              fallbackIcon="chest"
              item={item}
              label={`Bag slot ${index + 1}`}
              selectedId={selectedId}
              onSelect={(nextItem) => setSelectedId(nextItem.id)}
            />
          ))}
        </div>
      </section>

      <div className="velkhar-inventory__specials">
        <section aria-labelledby="velkhar-artifact-title">
          <h3 id="velkhar-artifact-title">Artifact</h3>
          <ItemSlot
            fallbackIcon="artifact"
            item={inventory.artifact}
            label="Dedicated artifact slot"
            selectedId={selectedId}
            onSelect={(item) => setSelectedId(item.id)}
          />
        </section>
        <section aria-labelledby="velkhar-heirloom-title">
          <h3 id="velkhar-heirloom-title">Heirloom</h3>
          <ItemSlot
            fallbackIcon="memory"
            item={inventory.heirloom}
            label="Inherited item slot"
            selectedId={selectedId}
            onSelect={(item) => setSelectedId(item.id)}
          />
        </section>
      </div>

      <aside className="velkhar-inventory__detail" aria-live="polite">
        {selectedItem ? (
          <>
            <p className="velkhar-session-window__eyebrow">Item detail</p>
            <h3>{selectedItem.name}</h3>
            <p>{selectedItem.description ?? 'No description has been revealed yet.'}</p>
            {selectedItem.allowedActions?.length ? (
              <p className="velkhar-inventory__permissions">
                Authorized now: {selectedItem.allowedActions.join(', ')}
              </p>
            ) : (
              <p className="velkhar-session-window__muted">
                No action is authorized in this scene.
              </p>
            )}
          </>
        ) : (
          <div className="velkhar-session-window__empty">
            <GameIcon decorative name="eye" size={48} />
            <p>Select an available item to inspect it.</p>
          </div>
        )}
      </aside>
    </div>
  )
}
