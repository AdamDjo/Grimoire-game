import Image from 'next/image'

import { cn } from '@/lib/utils'

import './game-brand.css'

export type GameBrandVariant = 'lockup' | 'sigil'
export type GameBrandSize = 'sm' | 'md' | 'lg' | 'xl'

interface GameBrandBaseProps {
  variant?: GameBrandVariant
  size?: GameBrandSize
  className?: string
  priority?: boolean
}

interface AccessibleGameBrandProps {
  decorative?: false
  label?: string
}

interface DecorativeGameBrandProps {
  decorative: true
  label?: never
}

export type GameBrandProps = GameBrandBaseProps &
  (AccessibleGameBrandProps | DecorativeGameBrandProps)

const BRAND_ASSETS: Record<
  GameBrandVariant,
  { src: string; width: number; height: number; defaultLabel: string }
> = {
  lockup: {
    src: '/ui-kit/brand/grimoire-lockup.webp',
    width: 720,
    height: 336,
    defaultLabel: 'GRIMOIRE — Of Ash and Salt',
  },
  sigil: {
    src: '/ui-kit/brand/grimoire-sigil.webp',
    width: 503,
    height: 512,
    defaultLabel: 'Sceau de GRIMOIRE',
  },
}

export function GameBrand({
  className,
  decorative = false,
  label,
  priority = false,
  size = 'md',
  variant = 'lockup',
}: GameBrandProps) {
  const asset = BRAND_ASSETS[variant]

  return (
    <Image
      alt={decorative ? '' : (label ?? asset.defaultLabel)}
      aria-hidden={decorative || undefined}
      className={cn('game-brand', `game-brand--${variant}`, `game-brand--${size}`, className)}
      draggable={false}
      height={asset.height}
      priority={priority}
      sizes="(max-width: 640px) 70vw, 520px"
      src={asset.src}
      unoptimized
      width={asset.width}
    />
  )
}
