import { BookOpen } from 'lucide-react'

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

export function GameBrand({
  className,
  decorative = false,
  label,
  priority: _priority = false,
  size = 'md',
  variant = 'lockup',
}: GameBrandProps) {
  const accessibleLabel =
    label ?? (variant === 'lockup' ? 'GRIMOIRE — Of Ash and Salt' : 'Sceau de GRIMOIRE')

  return (
    <span
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : accessibleLabel}
      className={cn('game-brand', `game-brand--${variant}`, `game-brand--${size}`, className)}
      role={decorative ? undefined : 'img'}
    >
      {variant === 'sigil' ? (
        <BookOpen aria-hidden="true" strokeWidth={1.25} />
      ) : (
        <>
          <span className="game-brand__name">Grimoire</span>
          <span className="game-brand__subtitle">Of Ash and Salt</span>
        </>
      )}
    </span>
  )
}
