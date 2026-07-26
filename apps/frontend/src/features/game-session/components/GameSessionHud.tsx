import { GameHudDock } from '@/components/ui/grimoire/GameHudDock/GameHudDock'
import { GameProgressRing } from '@/components/ui/grimoire/GameProgressRing/GameProgressRing'
import { InventoryQuickbar } from '@/components/ui/grimoire/InventoryQuickbar/InventoryQuickbar'
import { InventorySlot } from '@/components/ui/grimoire/InventorySlot/InventorySlot'
import { ResourceCounter } from '@/components/ui/grimoire/ResourceCounter/ResourceCounter'
import { StatBar } from '@/components/ui/grimoire/StatBar/StatBar'

import type { GameProgressRingTone } from '@/components/ui/grimoire/GameProgressRing/GameProgressRing'
import type { StatBarTone } from '@/components/ui/grimoire/StatBar/StatBar'
import type { ReactNode } from 'react'

import './game-session-hud.css'

export interface GameSessionHudStatusBar {
  className?: string
  icon?: ReactNode
  id: string
  label: string
  max: number
  tone: StatBarTone
  value: number
}

export interface GameSessionHudStatusGauge {
  className?: string
  icon?: ReactNode
  id: string
  label: string
  max: number
  tone?: GameProgressRingTone
  value: number
}

export interface GameSessionHudResource {
  icon?: ReactNode
  label: string
  value: number | string
}

export interface GameSessionHudTool {
  disabled?: boolean
  icon?: ReactNode
  id: string
  label: string
  onClick: () => void
  quantity?: number
  selected?: boolean
}

export interface GameSessionHudProps {
  className?: string
  label: string
  resource?: GameSessionHudResource | null
  statusBars: readonly GameSessionHudStatusBar[]
  statusDetail?: ReactNode
  statusGauges: readonly GameSessionHudStatusGauge[]
  toolLabel?: string
  tools: readonly GameSessionHudTool[]
}

/**
 * World-agnostic game-session footer. Each universe injects its own labels,
 * values, icons and tones while the responsive layout stays consistent.
 */
export function GameSessionHud({
  className,
  label,
  resource,
  statusBars,
  statusDetail,
  statusGauges,
  toolLabel = 'Session tools',
  tools,
}: GameSessionHudProps) {
  return (
    <GameHudDock
      className={`game-session-hud ${className ?? ''}`}
      data-has-gauges={statusGauges.length > 0 ? 'true' : 'false'}
      data-has-resource={resource ? 'true' : 'false'}
      label={label}
    >
      <div className="game-session-hud__bars">
        {statusBars.map((status) => (
          <StatBar
            key={status.id}
            className={status.className}
            icon={status.icon}
            label={status.label}
            max={status.max}
            size="sm"
            tone={status.tone}
            value={status.value}
          />
        ))}
        {statusDetail}
      </div>

      {statusGauges.length > 0 ? (
        <div className="game-session-hud__gauges">
          {statusGauges.map((gauge) => (
            <GameProgressRing
              key={gauge.id}
              className={gauge.className}
              icon={gauge.icon}
              label={gauge.label}
              max={gauge.max}
              size="sm"
              tone={gauge.tone}
              value={gauge.value}
            />
          ))}
        </div>
      ) : null}

      {resource ? (
        <ResourceCounter
          compact
          icon={resource.icon}
          label={resource.label}
          value={resource.value}
        />
      ) : null}

      <InventoryQuickbar className="game-session-hud__tools" label={toolLabel}>
        {tools.map((tool) => (
          <InventorySlot
            key={tool.id}
            disabled={tool.disabled}
            icon={tool.icon}
            label={tool.label}
            quantity={tool.quantity}
            selected={tool.selected}
            onClick={tool.onClick}
          />
        ))}
      </InventoryQuickbar>
    </GameHudDock>
  )
}
