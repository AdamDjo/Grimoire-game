import { cn } from '@/lib/utils'

import type { HTMLAttributes } from 'react'

import './hud-frame.css'

export type HudFrameVariant = 'horizontal' | 'circular' | 'portrait' | 'diamond'

export interface HudFrameProps extends HTMLAttributes<HTMLDivElement> {
  variant?: HudFrameVariant
  active?: boolean
}

export function HudFrame({
  active = false,
  children,
  className,
  variant = 'horizontal',
  ...props
}: HudFrameProps) {
  return (
    <div
      className={cn('hud-frame', `hud-frame--${variant}`, active && 'hud-frame--active', className)}
      {...props}
    >
      <div className="hud-frame__content">{children}</div>
    </div>
  )
}
