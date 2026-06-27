'use client'

import { Button } from '@/components/ui/Button'
import { CompassRose } from '@/components/ui/CompassRose'

/**
 * Section5Footer — manifeste de clôture + double CTA + signature Grimoire.
 *
 * Fin de l'expérience : on rappelle l'invitation (entrer dans l'univers) et
 * on ouvre la porte communauté (Discord), avant la signature.
 */
export function Section5Footer() {
  return (
    <footer
      role="contentinfo"
      aria-label="Pied de page Grimoire"
      data-section-id="footer"
      className="relative z-10 px-6 pb-16 pt-32"
      style={{ backgroundColor: 'var(--bg-2)' }}
    >
      {/* Liseré doré supérieur. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--gold-50) 50%, transparent 100%)',
        }}
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <CompassRose size={42} />

        <p
          className="font-display"
          style={{
            color: 'var(--gold-dark)',
            fontSize: 12,
            letterSpacing: '0.4em',
            margin: '32px 0 18px',
          }}
        >
          L’invitation
        </p>

        <h2
          className="font-display font-bold"
          style={{
            backgroundImage: 'var(--gradient-heading)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 'clamp(28px, 4.5vw, 48px)',
            letterSpacing: '0.06em',
            lineHeight: 1.15,
            marginBottom: 24,
            maxWidth: '22ch',
          }}
        >
          Le seuil est ouvert. Le monde t’attend.
        </h2>

        <p
          className="font-serif italic"
          style={{
            color: 'var(--ink-2)',
            fontSize: 'clamp(16px, 1.2vw, 19px)',
            lineHeight: 1.6,
            maxWidth: '48ch',
            marginBottom: 48,
          }}
        >
          Aux Cendres de Valorain, chaque âme compte. La tienne aussi.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="primary" style={{ fontSize: 13, letterSpacing: '0.22em' }}>
            Entrer dans l’Univers
          </Button>
          <Button variant="ghost" style={{ fontSize: 13, letterSpacing: '0.22em' }}>
            Rejoindre la communauté
          </Button>
        </div>

        <div
          aria-hidden="true"
          className="my-16 h-px w-full max-w-md"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--border) 50%, transparent 100%)',
          }}
        />

        <p
          className="font-serif"
          style={{
            color: 'var(--ink-3)',
            fontSize: 13,
            letterSpacing: '0.04em',
          }}
        >
          © {new Date().getFullYear()} Grimoire — Une œuvre de Valorain.
        </p>
      </div>
    </footer>
  )
}
