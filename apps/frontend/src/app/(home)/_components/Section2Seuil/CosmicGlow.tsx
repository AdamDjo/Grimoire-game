'use client'

/**
 * CosmicGlow — halo doré radial qui pulse lentement derrière le manifeste.
 * Fait "respirer" le fond cosmique sans introduire de motion JS.
 */
export function CosmicGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-[1]"
      style={{
        background:
          'radial-gradient(ellipse 45% 38% at 50% 50%, rgba(196, 164, 104, 0.22) 0%, rgba(196, 164, 104, 0.08) 35%, transparent 70%)',
        animation: 'cosmic-pulse 8s ease-in-out infinite',
      }}
    />
  )
}
