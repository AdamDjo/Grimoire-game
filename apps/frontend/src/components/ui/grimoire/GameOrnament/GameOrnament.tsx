import { Eye } from 'lucide-react'

import { cn } from '@/lib/utils'

import './game-ornament.css'

export type GameOrnamentName = 'watcher'
export type GameOrnamentSize = 'sm' | 'md' | 'lg' | 'xl'

interface GameOrnamentBaseProps {
  name: GameOrnamentName
  size?: GameOrnamentSize
  className?: string
  priority?: boolean
}

interface AccessibleGameOrnamentProps {
  decorative?: false
  label: string
}

interface DecorativeGameOrnamentProps {
  decorative: true
  label?: never
}

export type GameOrnamentProps = GameOrnamentBaseProps &
  (AccessibleGameOrnamentProps | DecorativeGameOrnamentProps)

export function GameOrnament({
  className,
  decorative = false,
  label,
  name,
  priority: _priority = false,
  size = 'md',
}: GameOrnamentProps) {
  return (
    <span
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : (label ?? name)}
      className={cn('game-ornament', `game-ornament--${name}`, `game-ornament--${size}`, className)}
      role={decorative ? undefined : 'img'}
    >
      <span aria-hidden="true" />
      <Eye aria-hidden="true" strokeWidth={1.2} />
      <span aria-hidden="true" />
    </span>
  )
}
