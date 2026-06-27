'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import type React from 'react'

interface UseMaskRevealOptions {
  /** Conteneur dont le scroll pilote l'animation. */
  containerRef: React.RefObject<HTMLElement | null>
  /** Sélecteur (scopé au container) des cibles à révéler. */
  targets: string
  /** Stagger entre chaque cible (en fraction du scroll, 0..1). Default 0.15. */
  stagger?: number
  /** Plage de scroll utilisée. Default 'top 80%' → 'center center'. */
  start?: string
  end?: string
}

/**
 * useMaskReveal — révèle des éléments via `clip-path` (gauche → droite) au
 * fil du scroll. Effet "lever de rideau" doré, façon Rockstar VI.
 *
 * Les cibles doivent partir cachées (`clip-path: inset(0 100% 0 0)` posé en CSS).
 */
export function useMaskReveal({
  containerRef,
  targets,
  stagger = 0.15,
  start = 'top 80%',
  end = 'center center',
}: UseMaskRevealOptions): void {
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      gsap.to(targets, {
        clipPath: 'inset(0 0% 0 0)',
        ease: 'power2.out',
        stagger,
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          end,
          scrub: true,
        },
      })
    },
    { scope: containerRef }
  )
}

interface UseClipRevealOptions {
  containerRef: React.RefObject<HTMLElement | null>
  /** Sélecteur scopé sur l'élément à révéler (typiquement la 2e image du diptyque). */
  target: string
  start?: string
  end?: string
}

/**
 * useClipReveal — révèle un seul élément (image overlay) via un clip-path
 * inset qui passe de 100% à 0% sur la droite. Utilisé pour le diptyque
 * "l'aveugle" → "l'aveugle-cendres".
 */
export function useClipReveal({
  containerRef,
  target,
  start = 'top top',
  end = 'bottom bottom',
}: UseClipRevealOptions): void {
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      gsap.fromTo(
        target,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            end,
            scrub: true,
          },
        }
      )
    },
    { scope: containerRef }
  )
}
