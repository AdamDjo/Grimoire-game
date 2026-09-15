import Image from 'next/image'

import { cn } from '@/lib/utils'

import './vocation-emblem.css'

export const VOCATION_EMBLEM_NAMES = [
  'marcheur-du-sel',
  'lame-ombre',
  'veilleur',
  'tisse-verbe',
] as const

export type VocationEmblemName = (typeof VOCATION_EMBLEM_NAMES)[number]
export type VocationEmblemSize = 'sm' | 'md' | 'lg'

const VOCATION_LABELS: Record<VocationEmblemName, string> = {
  'marcheur-du-sel': 'Symbole du Marcheur-du-Sel',
  'lame-ombre': 'Symbole de la Lame-Ombre',
  veilleur: 'Symbole du Veilleur',
  'tisse-verbe': 'Symbole du Tisse-Verbe',
}

export interface VocationEmblemProps {
  name: VocationEmblemName
  size?: VocationEmblemSize
  className?: string
  decorative?: boolean
}

export function VocationEmblem({
  className,
  decorative = false,
  name,
  size = 'md',
}: VocationEmblemProps) {
  return (
    <Image
      alt={decorative ? '' : VOCATION_LABELS[name]}
      aria-hidden={decorative || undefined}
      className={cn('vocation-emblem', `vocation-emblem--${size}`, className)}
      draggable={false}
      height={320}
      sizes="(max-width: 640px) 72px, 96px"
      src={`/encre-de-sel/icons/vocations/${name}.webp`}
      unoptimized
      width={320}
    />
  )
}
