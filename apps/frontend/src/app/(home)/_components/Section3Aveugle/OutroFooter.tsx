'use client'

import { Instagram, MessageCircle, Twitter } from 'lucide-react'
import { forwardRef, type ComponentType } from 'react'

import { FOOTER_LINKS, SOCIAL_LINKS } from '../../_data/home-data'

const ICON_BY_KEY: Record<
  (typeof SOCIAL_LINKS)[number]['key'],
  ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>
> = {
  discord: MessageCircle,
  twitter: Twitter,
  instagram: Instagram,
}

/**
 * OutroFooter — pied de page cinéma posé sur la vidéo finale de Section3Aveugle.
 *
 * Une seule rangée, alignée bas, sans carte ni fond plein : la vidéo respire
 * derrière. Apparition pilotée par le parent via le ref reçu (signature
 * `power2.out` + `y:24` + `blur(8px)`, harmonisée avec QuoteOverlay et le CTA).
 */
export const OutroFooter = forwardRef<HTMLElement>(function OutroFooter(_, ref) {
  return (
    <footer
      ref={ref}
      role="contentinfo"
      aria-label="Pied de page"
      className="pointer-events-auto absolute inset-x-0 bottom-[1.5%] z-[2] px-6"
      style={{ opacity: 0 }}
    >
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 md:gap-10">
        <div className="flex flex-col gap-1">
          <span
            className="font-display font-bold uppercase text-[12px] tracking-[0.24em]"
            style={{
              color: 'var(--gold-light)',
              textShadow: '0 2px 12px rgba(0,0,0,.85)',
            }}
          >
            Grimoire
          </span>
          <span
            className="font-serif italic text-[11px]"
            style={{
              color: 'var(--ink-3)',
              textShadow: '0 2px 12px rgba(0,0,0,.7)',
            }}
          >
            Valorain · Édition I
          </span>
        </div>

        <nav aria-label="Liens utiles" className="hidden items-center gap-6 md:flex">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-sm font-serif italic text-[13px] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]"
              style={{
                color: 'var(--gold-light)',
                textShadow: '0 2px 12px rgba(0,0,0,.85)',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div role="group" aria-label="Réseaux sociaux" className="flex items-center gap-4">
          {SOCIAL_LINKS.map((social) => {
            const Icon = ICON_BY_KEY[social.key]
            return (
              <a
                key={social.key}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm transition-colors hover:[color:var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)]"
                style={{ color: 'var(--gold-light)' }}
              >
                <Icon size={18} strokeWidth={1.5} aria-hidden />
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
})
