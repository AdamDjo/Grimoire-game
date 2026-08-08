'use client'

import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import { GameIcon, type GameIconName } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { InventorySlot } from '@/components/ui/grimoire/InventorySlot/InventorySlot'
import { cn } from '@/lib/utils'

import { buildVelkharInventoryView, VELKHAR_BAG_CAPACITY } from '../_lib/velkhar-inventory-model'

import type { InventoryItemRef } from '@grimoire/shared'

interface VelkharInventoryPanelProps {
  iron: number | null
  items: InventoryItemRef[]
  onAction: (item: InventoryItemRef, action: 'use' | 'equip' | 'unequip') => void
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
  const t = useTranslations('Session')
  const unavailable = !item || item.state === 'locked' || item.state === 'pending'
  const stateLabel =
    item?.state === 'locked' ? t('itemLocked') : item?.state === 'pending' ? t('itemPending') : ''
  const equippedLabel = item?.equippedSlot ? t('itemEquipped') : ''

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
        label={
          item ? `${label}: ${item.name}${equippedLabel}${stateLabel}` : t('itemEmpty', { label })
        }
        quantity={item && item.quantity > 1 ? item.quantity : undefined}
        selected={item?.id === selectedId}
        onClick={() => item && onSelect(item)}
      />
      <span aria-hidden="true">{item?.name ?? label}</span>
    </div>
  )
}

export function VelkharInventoryPanel({ iron, items, onAction }: VelkharInventoryPanelProps) {
  const t = useTranslations('Session')
  const inventory = useMemo(() => buildVelkharInventoryView(items), [items])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedItem = items.find((item) => item.id === selectedId) ?? null
  const bagSlots = Array.from(
    { length: VELKHAR_BAG_CAPACITY },
    (_, index) => inventory.bagItems[index] ?? null
  )
  const equipmentLabels: Record<string, string> = {
    'main-hand': t('mainHand'),
    'off-hand': t('offHand'),
    armor: t('armor'),
    cloak: t('cloak'),
    head: t('head'),
    accessory: t('accessory'),
    belt: t('belt'),
    feet: t('feet'),
  }
  const actionLabels = {
    use: t('actionUse'),
    equip: t('actionEquip'),
    unequip: t('actionUnequip'),
    inspect: t('actionInspect'),
  }

  return (
    <div className="velkhar-inventory">
      <div className="velkhar-inventory__summary" aria-label={t('inventorySummary')}>
        <span>
          <GameIcon decorative name="coin" size={24} /> {t('iron')} <strong>{iron ?? '—'}</strong>
        </span>
        <span>
          <GameIcon decorative name="chest" size={24} /> {t('bag')}{' '}
          <strong>
            {inventory.bagItems.length}/{VELKHAR_BAG_CAPACITY}
          </strong>
        </span>
      </div>

      <div className="velkhar-inventory__workspace">
        <div className="velkhar-inventory__categories">
          <section aria-labelledby="velkhar-equipment-title">
            <div className="velkhar-session-window__section-heading">
              <h3 id="velkhar-equipment-title">{t('wornEquipment')}</h3>
              <span>{t('fixedSlots')}</span>
            </div>
            <div className="velkhar-inventory__grid velkhar-inventory__grid--equipment">
              {inventory.equipment.map((slot) => (
                <ItemSlot
                  key={slot.id}
                  fallbackIcon={slot.icon}
                  item={slot.item}
                  label={equipmentLabels[slot.id] ?? slot.label}
                  selectedId={selectedId}
                  onSelect={(item) => setSelectedId(item.id)}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="velkhar-bag-title">
            <div className="velkhar-session-window__section-heading">
              <h3 id="velkhar-bag-title">{t('bag')}</h3>
              <span>{t('bagSlots')}</span>
            </div>
            <div className="velkhar-inventory__grid velkhar-inventory__grid--bag">
              {bagSlots.map((item, index) => (
                <ItemSlot
                  key={item?.id ?? `bag-slot-${index}`}
                  fallbackIcon="chest"
                  item={item}
                  label={t('bagSlot', { number: index + 1 })}
                  selectedId={selectedId}
                  onSelect={(nextItem) => setSelectedId(nextItem.id)}
                />
              ))}
            </div>
          </section>

          <div className="velkhar-inventory__specials">
            <section aria-labelledby="velkhar-artifact-title">
              <div>
                <h3 id="velkhar-artifact-title">{t('artifact')}</h3>
                <p>{t('artifactHint')}</p>
              </div>
              <ItemSlot
                fallbackIcon="artifact"
                item={inventory.artifact}
                label={t('artifactSlot')}
                selectedId={selectedId}
                onSelect={(item) => setSelectedId(item.id)}
              />
            </section>
            <section aria-labelledby="velkhar-keyring-title">
              <div>
                <h3 id="velkhar-keyring-title">{t('keyring')}</h3>
                <p>{t('keyringHint')}</p>
              </div>
              {inventory.keyItems.length > 0 ? (
                <div className="velkhar-inventory__key-items">
                  {inventory.keyItems.map((item) => (
                    <ItemSlot
                      key={item.id}
                      fallbackIcon="key"
                      item={item}
                      label={item.name}
                      selectedId={selectedId}
                      onSelect={(nextItem) => setSelectedId(nextItem.id)}
                    />
                  ))}
                </div>
              ) : (
                <span className="velkhar-inventory__empty-keyring">{t('keyringEmpty')}</span>
              )}
            </section>
          </div>
        </div>

        <aside className="velkhar-inventory__detail" aria-live="polite">
          {selectedItem ? (
            <>
              <p className="velkhar-session-window__eyebrow">{t('itemDetail')}</p>
              <h3>{selectedItem.name}</h3>
              <p>{selectedItem.description ?? t('noDescription')}</p>
              {selectedItem.allowedActions?.length ? (
                <div
                  className="velkhar-inventory__actions"
                  role="group"
                  aria-label={t('authorizedActionsLabel')}
                >
                  {selectedItem.allowedActions
                    .filter((action) => action !== 'inspect')
                    .map((action) => (
                      <button
                        key={action}
                        type="button"
                        className="velkhar-inventory__action-button"
                        onClick={() => onAction(selectedItem, action)}
                      >
                        {actionLabels[action]}
                      </button>
                    ))}
                </div>
              ) : (
                <p className="velkhar-session-window__muted">{t('noAuthorizedAction')}</p>
              )}
            </>
          ) : (
            <div className="velkhar-session-window__empty">
              <GameIcon decorative name="eye" size={48} />
              <p>{t('selectItem')}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
