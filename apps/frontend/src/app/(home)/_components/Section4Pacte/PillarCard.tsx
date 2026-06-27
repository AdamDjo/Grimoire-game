'use client'

interface PillarCardProps {
  eyebrow: string
  title: string
  description: string
}

/**
 * PillarCard — carte d'un pilier (gold-glow au hover).
 * Verre fumé + bordure or, typo Cinzel pour le titre.
 */
export function PillarCard({ eyebrow, title, description }: PillarCardProps) {
  return (
    <article
      className="group relative flex flex-col p-8 transition-all duration-500 hover:-translate-y-1"
      style={{
        background:
          'linear-gradient(180deg, rgba(20, 16, 10, 0.6) 0%, rgba(20, 16, 10, 0.85) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Halo doré au hover. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          borderRadius: 'var(--radius)',
          boxShadow:
            '0 0 60px -10px rgba(196, 164, 104, 0.45) inset, 0 0 30px -5px rgba(196, 164, 104, 0.3)',
        }}
      />

      <span
        className="font-display"
        style={{
          color: 'var(--gold-dark)',
          fontSize: 12,
          letterSpacing: '0.4em',
          marginBottom: 18,
        }}
      >
        {eyebrow}
      </span>

      <h3
        className="font-display font-bold"
        style={{
          backgroundImage: 'var(--gradient-heading)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontSize: 'clamp(22px, 2.4vw, 30px)',
          letterSpacing: '0.05em',
          lineHeight: 1.15,
          marginBottom: 14,
        }}
      >
        {title}
      </h3>

      <p
        className="font-serif"
        style={{
          color: 'var(--ink-2)',
          fontSize: 'clamp(15px, 1.05vw, 17px)',
          lineHeight: 1.65,
        }}
      >
        {description}
      </p>
    </article>
  )
}
