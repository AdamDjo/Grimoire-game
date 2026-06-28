'use client'

/**
 * FilmGrain — overlay grain de film animé (effet "argentique" cinéma).
 *
 * SVG noise inline (zéro request), `mix-blend-overlay` + opacity faible pour
 * rester subtil. Animation CSS `grain-shift` (steps) qui simule le défilement
 * des frames. `pointer-events-none` + `aria-hidden`. Respecte
 * prefers-reduced-motion (le grain reste figé mais ne disparait pas).
 */
interface FilmGrainProps {
  opacity?: number
  zIndex?: number
}

export function FilmGrain({ opacity = 0.06, zIndex = 60 }: FilmGrainProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 mix-blend-overlay motion-safe:animate-grain-shift"
      style={{
        opacity,
        zIndex,
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.86 0 0 0 0 0.78 0 0 0 0 0.6 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundSize: '240px 240px',
        // léger sur-dimensionnement pour cacher les bords pendant le translate
        width: '110%',
        height: '110%',
        top: '-5%',
        left: '-5%',
      }}
    />
  )
}
