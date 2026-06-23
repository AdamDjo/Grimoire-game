'use client'

import { SmokeBackground } from './SmokeBackground'

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")"

export function PageShell({
  children,
  scrollSnap = false,
}: {
  children: React.ReactNode
  scrollSnap?: boolean
}) {
  return (
    <div
      style={
        {
          position: 'relative',
          height: '100vh',
          width: '100vw',
          background: 'linear-gradient(180deg, #050506 0%, #0a0806 30%, #0c0c0e 100%)',
          overflowX: 'hidden',
          overflowY: 'scroll',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          ...(scrollSnap && { scrollSnapType: 'y mandatory' }),
        } as React.CSSProperties
      }
    >
      <SmokeBackground />

      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          backgroundImage: GRAIN_SVG,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          opacity: 0.6,
          mixBlendMode: 'overlay',
        }}
      />

      {children}
    </div>
  )
}
