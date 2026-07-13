import type { CSSProperties, ReactNode } from 'react'

import './game-progress-ring.css'

export type GameProgressRingTone = 'gold' | 'sang' | 'souffle' | 'cendre'
export type GameProgressRingSize = 'sm' | 'md' | 'lg'

export interface GameProgressRingProps {
  label: string
  value: number
  max: number
  tone?: GameProgressRingTone
  size?: GameProgressRingSize
  icon?: ReactNode
  showValue?: boolean
  className?: string
}

interface RingStyle extends CSSProperties {
  '--game-ring-progress': string
}

export function GameProgressRing({
  className = '',
  icon,
  label,
  max,
  showValue = true,
  size = 'md',
  tone = 'gold',
  value,
}: GameProgressRingProps) {
  const safeMax = Math.max(1, max)
  const safeValue = Math.min(Math.max(0, value), safeMax)
  const percent = Math.round((safeValue / safeMax) * 100)
  const style: RingStyle = { '--game-ring-progress': `${percent * 3.6}deg` }

  return (
    <div
      aria-label={label}
      aria-valuemax={safeMax}
      aria-valuemin={0}
      aria-valuenow={safeValue}
      className={`game-progress-ring game-progress-ring--${tone} game-progress-ring--${size} ${className}`}
      role="progressbar"
      style={style}
    >
      <span className="game-progress-ring__dial" aria-hidden="true">
        <span className="game-progress-ring__center">
          {icon ? <span className="game-progress-ring__icon">{icon}</span> : null}
          {showValue ? <span className="game-progress-ring__value">{percent}%</span> : null}
        </span>
      </span>
      <span className="game-progress-ring__label">{label}</span>
    </div>
  )
}
