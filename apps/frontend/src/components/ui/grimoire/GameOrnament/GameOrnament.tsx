import Image from 'next/image'

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

const ORNAMENT_DIMENSIONS: Record<GameOrnamentName, { width: number; height: number }> = {
  watcher: { width: 1200, height: 431 },
}

export function GameOrnament({
  className,
  decorative = false,
  label,
  name,
  priority = false,
  size = 'md',
}: GameOrnamentProps) {
  const dimensions = ORNAMENT_DIMENSIONS[name]

  return (
    <Image
      alt={decorative ? '' : (label ?? name)}
      aria-hidden={decorative || undefined}
      className={cn('game-ornament', `game-ornament--${name}`, `game-ornament--${size}`, className)}
      draggable={false}
      height={dimensions.height}
      priority={priority}
      sizes="(max-width: 640px) 88vw, 720px"
      src={`/ui-kit/ornaments/${name}.webp`}
      unoptimized
      width={dimensions.width}
    />
  )
}
