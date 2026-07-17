import { cn } from '@/lib/utils'

import type { ReactNode } from 'react'

import './stat-bar.css'

export type StatBarTone = 'danger' | 'aqua' | 'ember'
export type StatBarSize = 'sm' | 'md' | 'lg'

export interface StatBarProps {
  label: string
  value: number
  max: number
  tone: StatBarTone
  size?: StatBarSize
  showValue?: boolean
  animated?: boolean
  icon?: ReactNode
  className?: string
}

export function StatBar({
  animated = true,
  className,
  icon,
  label,
  max,
  showValue = true,
  size = 'md',
  tone,
  value,
}: StatBarProps) {
  const safeMax = Math.max(0, max)
  const safeValue = Math.min(Math.max(0, value), safeMax)
  const percentage = safeMax === 0 ? 0 : (safeValue / safeMax) * 100

  return (
    <div
      className={cn(
        'stat-bar',
        `stat-bar--${tone}`,
        `stat-bar--${size}`,
        animated && 'stat-bar--animated',
        className
      )}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
      aria-valuetext={`${safeValue} sur ${safeMax}`}
    >
      <div className="stat-bar__heading">
        <span className="stat-bar__label">
          {icon ? (
            <span className="stat-bar__icon" aria-hidden="true">
              {icon}
            </span>
          ) : null}
          {label}
        </span>
        {showValue ? (
          <span className="stat-bar__value">
            {safeValue} / {safeMax}
          </span>
        ) : null}
      </div>
      <div className="stat-bar__track" aria-hidden="true">
        <span className="stat-bar__fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
