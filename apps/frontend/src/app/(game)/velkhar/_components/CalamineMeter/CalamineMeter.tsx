import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { StatBar } from '@/components/ui/grimoire/StatBar/StatBar'

import type { StatBarSize } from '@/components/ui/grimoire/StatBar/StatBar'

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
      tone="ember"
      size={size}
      showValue={showValue}
      icon={<GameIcon name="warning" size={24} decorative />}
    />
  )
}
