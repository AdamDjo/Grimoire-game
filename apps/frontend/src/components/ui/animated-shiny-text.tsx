import { cn } from '@/lib/utils'

import type { ComponentPropsWithoutRef, CSSProperties, FC } from 'react'

export type ShinyVariant = 'gold-strong' | 'gold-soft' | 'ink-soft'

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<'span'> {
  shimmerWidth?: number
  variant?: ShinyVariant
}

interface VariantStyle {
  base: string
  shine: string
}

const VARIANTS: Record<ShinyVariant, VariantStyle> = {
  'gold-strong': {
    base: 'linear-gradient(180deg, var(--gold-light) 0%, var(--gold) 100%)',
    shine:
      'linear-gradient(90deg, transparent 0%, transparent 35%, var(--gold-hover) 50%, transparent 65%, transparent 100%)',
  },
  'gold-soft': {
    base: 'linear-gradient(0deg, var(--gold), var(--gold))',
    shine:
      'linear-gradient(90deg, transparent 0%, transparent 40%, var(--gold-hover) 50%, transparent 60%, transparent 100%)',
  },
  'ink-soft': {
    base: 'linear-gradient(0deg, var(--ink-2), var(--ink-2))',
    shine:
      'linear-gradient(90deg, transparent 0%, transparent 40%, var(--ink) 50%, transparent 60%, transparent 100%)',
  },
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 200,
  variant = 'gold-strong',
  ...props
}) => {
  const { base, shine } = VARIANTS[variant]
  return (
    <span
      style={
        {
          '--shiny-width': `${shimmerWidth}px`,
          backgroundImage: `${shine}, ${base}`,
          backgroundSize: `var(--shiny-width) 100%, 100% 100%`,
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundPosition: `calc(-100% - var(--shiny-width)) 0, 0 0`,
        } as CSSProperties
      }
      className={cn('animate-shiny-text-multi bg-clip-text text-transparent', className)}
      {...props}
    >
      {children}
    </span>
  )
}
