'use client'

import { MANIFESTO_LINES } from '../../_data/home-data'

/**
 * ManifestoReveal — bloc texte du manifeste.
 *
 * Le mouvement (translateY, opacity, blur) est piloté par le parent
 * (Section2Seuil) qui anime la card entière comme un seul bloc — façon
 * Rockstar VI, pas de stagger ligne par ligne.
 */
export function ManifestoReveal() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ gap: 'clamp(8px, 1.5vw, 18px)' }}
    >
      {MANIFESTO_LINES.map((line) => (
        <p
          key={line}
          className="font-display font-bold text-gradient-gold"
          style={{
            fontSize: 'clamp(28px, 5vw, 56px)',
            letterSpacing: '0.06em',
            lineHeight: 1.15,
            backgroundImage: 'var(--gradient-heading)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {line}
        </p>
      ))}
    </div>
  )
}
