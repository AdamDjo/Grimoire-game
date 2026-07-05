import type { SVGProps } from 'react'

export type TriptychGlyphName = 'memoire' | 'mj' | 'velkhar'

interface TriptychGlyphProps extends SVGProps<SVGSVGElement> {
  name: TriptychGlyphName
}

/**
 * Glyphes du triptyque — tracés au trait (`currentColor`), pensés pour pulser
 * en boucle (couche `animate-glyph-pulse` posée par le parent).
 *
 *  - `memoire` : horloge (le monde n'oublie rien / la mémoire du MJ).
 *  - `mj`      : dé (les règles, les dés, le backend qui tranche).
 *  - `velkhar` : dune sous une étoile (le désert de Cendre).
 *
 * Placeholders en attendant les vrais glyphes canon (sceau de l'Aveugle,
 * glyphe de Cendre, marque de Calamine) — cf. LANDING_SEO_BILINGUAL_PLAN.md.
 */
export function TriptychGlyph({ name, ...props }: TriptychGlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      {name === 'memoire' && (
        <>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.1" />
          <path d="M12 5 v7 l5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </>
      )}
      {name === 'mj' && (
        <>
          <path d="M4 6 h16 v12 h-16 z" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="8.5" cy="12" r="1.3" fill="currentColor" />
          <circle cx="15.5" cy="9" r="1.3" fill="currentColor" />
          <circle cx="15.5" cy="15" r="1.3" fill="currentColor" />
        </>
      )}
      {name === 'velkhar' && (
        <>
          <path
            d="M2 18 q5 -10 10 0 q5 -10 10 0"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M12 3 v5 M9.5 5.5 L12 8 L14.5 5.5"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  )
}
