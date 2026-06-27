'use client'

import { PILLARS } from '../../_data/home-data'

import { PillarCard } from './PillarCard'

/**
 * Section4Pacte — "Le Pacte"
 *
 * Première rupture UI après le cinématique : heading + 3 cartes des piliers.
 * Fond sombre + grain, plus de cosmique : on revient sur "terre" pour
 * présenter ce qu'est concrètement le jeu.
 */
export function Section4Pacte() {
  return (
    <section
      data-section-id="pacte"
      aria-label="Le Pacte — piliers du jeu"
      className="relative z-10 flex min-h-screen items-center justify-center px-6 py-32"
      style={{ backgroundColor: 'var(--bg-2)' }}
    >
      {/* Halo doré subtil en haut. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[40vh]"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(196, 164, 104, 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center">
        <span className="text-disp-sm" style={{ marginBottom: 18 }}>
          Le Pacte
        </span>
        <h2
          className="font-display font-bold text-center"
          style={{
            backgroundImage: 'var(--gradient-heading)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 'clamp(32px, 5vw, 56px)',
            letterSpacing: '0.06em',
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: '20ch',
          }}
        >
          Trois serments pour entrer dans Valorain
        </h2>
        <p
          className="font-serif text-center"
          style={{
            color: 'var(--ink-2)',
            fontSize: 'clamp(16px, 1.2vw, 19px)',
            lineHeight: 1.6,
            maxWidth: '52ch',
            marginBottom: 64,
          }}
        >
          Grimoire n’est pas un jeu de hasard. C’est un pacte que tu signes avec un monde qui te
          répondra, longtemps après.
        </p>

        <div className="grid w-full gap-6 md:grid-cols-3">
          {PILLARS.map((p) => (
            <PillarCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  )
}
