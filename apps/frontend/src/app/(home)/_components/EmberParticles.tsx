'use client'

import { useEffect, useState, type CSSProperties } from 'react'

type EmberVariant = 'gold' | 'ember'

interface Particle {
  id: number
  left: number
  bottom: number
  size: number
  duration: number
  delay: number
  drift: number
  opacity: number
  hueShift: number
}

interface EmberParticlesProps {
  /** `gold` = lentes braises dorées (Hero). `ember` = étincelles d'auberge orangées (Section3). */
  variant?: EmberVariant
  count?: number
  /** `fixed` couvre tout le viewport, `absolute` se cale sur le parent positionné. */
  position?: 'fixed' | 'absolute'
  /** z-index — défaut posé entre les overlays existants et les éléments interactifs. */
  zIndex?: number
  className?: string
}

const VARIANT_CONFIG: Record<
  EmberVariant,
  {
    color: string
    glow: string
    sizeMin: number
    sizeMax: number
    durMin: number
    durMax: number
    driftMax: number
    opacityMin: number
    opacityMax: number
  }
> = {
  gold: {
    color: 'rgba(228, 198, 136, 1)',
    glow: 'rgba(196, 164, 104, 0.55)',
    sizeMin: 1.2,
    sizeMax: 3,
    durMin: 9,
    durMax: 16,
    driftMax: 24,
    opacityMin: 0.35,
    opacityMax: 0.7,
  },
  ember: {
    color: 'rgba(248, 168, 88, 1)',
    glow: 'rgba(212, 100, 40, 0.55)',
    sizeMin: 1,
    sizeMax: 2.4,
    durMin: 5,
    durMax: 10,
    driftMax: 48,
    opacityMin: 0.45,
    opacityMax: 0.85,
  },
}

function generate(count: number, variant: EmberVariant): Particle[] {
  const cfg = VARIANT_CONFIG[variant]
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    bottom: Math.random() * 30, // démarre dans le bas de l'écran
    size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
    duration: cfg.durMin + Math.random() * (cfg.durMax - cfg.durMin),
    delay: -Math.random() * cfg.durMax, // négatif → animation pré-amorcée (pas de "vide" au mount)
    drift: (Math.random() - 0.5) * 2 * cfg.driftMax,
    opacity: cfg.opacityMin + Math.random() * (cfg.opacityMax - cfg.opacityMin),
    hueShift: variant === 'ember' ? Math.random() * 12 - 6 : 0,
  }))
}

/**
 * EmberParticles — couche atmosphérique de particules CSS pures.
 *
 * Performance : zéro JS animation loop (uniquement keyframes CSS).
 * SSR safe : génération uniquement dans useEffect (`generateParticles`
 * utilise Math.random — pattern documenté dans MEMORY.md).
 * Accessibilité : `aria-hidden`, désactivé si `prefers-reduced-motion`.
 */
export function EmberParticles({
  variant = 'gold',
  count = 40,
  position = 'absolute',
  zIndex = 4,
  className,
}: EmberParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mql.matches)
    if (mql.matches) return

    // Mobile : on coupe quasiment tout pour préserver la perf.
    const isCoarse = window.matchMedia('(hover: none)').matches
    const adjusted = isCoarse ? Math.max(8, Math.floor(count * 0.35)) : count
    setParticles(generate(adjusted, variant))
  }, [count, variant])

  if (reducedMotion) return null

  const cfg = VARIANT_CONFIG[variant]

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${position === 'fixed' ? 'fixed' : 'absolute'} inset-0 overflow-hidden ${className ?? ''}`}
      style={{ zIndex }}
    >
      {particles.map((p) => {
        const style = {
          left: `${p.left}%`,
          bottom: `${p.bottom}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          background: cfg.color,
          boxShadow: `0 0 ${p.size * 4}px ${p.size * 0.6}px ${cfg.glow}`,
          filter: p.hueShift ? `hue-rotate(${p.hueShift}deg)` : undefined,
          '--ember-dur': `${p.duration}s`,
          '--ember-delay': `${p.delay}s`,
          '--ember-drift': `${p.drift}px`,
          '--ember-opacity': p.opacity,
        } as CSSProperties

        return (
          <span
            key={p.id}
            className="absolute rounded-full animate-ember-rise will-change-transform"
            style={style}
          />
        )
      })}
    </div>
  )
}
