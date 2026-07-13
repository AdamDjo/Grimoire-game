import { GameIcon } from '../GameIcon/GameIcon'
import { StatBar } from '../StatBar/StatBar'

import type { StatBarSize } from '../StatBar/StatBar'

export interface CalamineMeterProps {
  value: number
  max: number
  size?: StatBarSize
  showValue?: boolean
  className?: string
}

export function CalamineMeter({
  className,
  max,
  showValue = true,
  size = 'md',
  value,
}: CalamineMeterProps) {
  return (
    <StatBar
      className={className}
      label="Calamine"
      value={value}
      max={max}
      tone="cendre"
      size={size}
      showValue={showValue}
      icon={<GameIcon name="warning" size={24} decorative />}
    />
  )
}
