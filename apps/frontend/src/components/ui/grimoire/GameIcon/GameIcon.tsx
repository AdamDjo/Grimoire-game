import Image from 'next/image'

import { cn } from '@/lib/utils'

import './game-icon.css'

export const GAME_ICON_NAMES = [
  'arrow',
  'artifact',
  'blood-drop',
  'book',
  'chest',
  'coin-pouch',
  'coins',
  'coin',
  'compass',
  'crafting',
  'crossed-swords',
  'crown',
  'crystals',
  'dice',
  'diamond',
  'dialogue',
  'elements',
  'envelope',
  'eye',
  'fire',
  'footprint',
  'helmet',
  'hourglass',
  'hunger',
  'journal',
  'key',
  'lock',
  'mage',
  'memory',
  'moon',
  'potion',
  'quill',
  'scroll',
  'shield',
  'stranger',
  'trophy',
  'unlock',
  'warning',
  'water',
  'wind',
] as const

export type GameIconName = (typeof GAME_ICON_NAMES)[number]
export type GameIconSize = 24 | 32 | 48 | 64 | 96

interface GameIconBaseProps {
  name: GameIconName
  size?: GameIconSize
  className?: string
}

interface AccessibleGameIconProps {
  decorative?: false
  label: string
}

interface DecorativeGameIconProps {
  decorative: true
  label?: never
}

export type GameIconProps = GameIconBaseProps & (AccessibleGameIconProps | DecorativeGameIconProps)

export function GameIcon({ className, decorative = false, label, name, size = 48 }: GameIconProps) {
  return (
    <Image
      className={cn('game-icon', className)}
      src={`/encre-de-sel/icons/glyphs/${name}.webp`}
      width={size}
      height={size}
      sizes={`${size}px`}
      alt={decorative ? '' : (label ?? name)}
      aria-hidden={decorative || undefined}
      draggable={false}
      unoptimized
    />
  )
}
