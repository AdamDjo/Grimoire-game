import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { StatBar } from '@/components/ui/grimoire/StatBar/StatBar'

import type { StatBarSize } from '@/components/ui/grimoire/StatBar/StatBar'

import './survie-gauge.css'

export interface SurvieGaugeValue {
  value: number
  max: number
}

export interface SurvieGaugeProps {
  faim: SurvieGaugeValue
  soif: SurvieGaugeValue
  fatigue: SurvieGaugeValue
  size?: StatBarSize
  className?: string
}

export function SurvieGauge({
  className = '',
  faim,
  fatigue,
  size = 'sm',
  soif,
}: SurvieGaugeProps) {
  return (
    <section className={`survie-gauge ${className}`} aria-label="Survie">
      <StatBar
        label="Soif"
        value={soif.value}
        max={soif.max}
        tone="aqua"
        size={size}
        icon={<GameIcon name="water" size={24} decorative />}
      />
      <StatBar
        label="Faim"
        value={faim.value}
        max={faim.max}
        tone="ember"
        size={size}
        icon={<GameIcon name="coin-pouch" size={24} decorative />}
      />
      <StatBar
        label="Fatigue"
        value={fatigue.value}
        max={fatigue.max}
        tone="ember"
        size={size}
        icon={<GameIcon name="moon" size={24} decorative />}
      />
    </section>
  )
}
