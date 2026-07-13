import Image from 'next/image'

import { cn } from '@/lib/utils'

import type { CSSProperties } from 'react'

import './game-avatar.css'

export type GameAvatarSize = 'sm' | 'md' | 'lg' | 'xl'
export type GameAvatarState = 'normal' | 'active' | 'selected' | 'prestige'

export interface GameAvatarProps {
  src: string
  alt: string
  size?: GameAvatarSize
  state?: GameAvatarState
  statusLabel?: string
  interactive?: boolean
  priority?: boolean
  className?: string
}

const AVATAR_SIZE_PX: Record<GameAvatarSize, number> = {
  sm: 48,
  md: 64,
  lg: 96,
  xl: 160,
}

interface GameAvatarStyle extends CSSProperties {
  '--game-avatar-size': string
}

export function GameAvatar({
  alt,
  className,
  interactive = false,
  priority = false,
  size = 'md',
  src,
  state = 'normal',
  statusLabel,
}: GameAvatarProps) {
  const pixelSize = AVATAR_SIZE_PX[size]
  const style: GameAvatarStyle = { '--game-avatar-size': `${pixelSize}px` }

  return (
    <span
      className={cn(
        'game-avatar',
        `game-avatar--${size}`,
        `game-avatar--${state}`,
        interactive && 'game-avatar--interactive',
        className
      )}
      style={style}
    >
      <span className="game-avatar__portrait">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${pixelSize}px`}
          priority={priority}
          draggable={false}
          unoptimized
        />
      </span>
      {statusLabel ? <span className="game-avatar__status-label">{statusLabel}</span> : null}
    </span>
  )
}
