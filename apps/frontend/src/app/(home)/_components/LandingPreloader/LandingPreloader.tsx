'use client'

import { useEffect, useRef, useState } from 'react'

import { getLenis } from '@/hooks/use-lenis'
import { gsap, useGSAP } from '@/lib/gsap-init'

import { getPreloadState, subscribePreload } from './preload-progress'

import './landing-preloader.css'

interface LandingPreloaderProps {
  // Appelé quand le voile a fini de se lever : LandingExperience enchaîne alors
  // l'entrée du chrome et des CTA (déplacée derrière ce callback).
  onDone: () => void
}

// Le voile se lève dès qu'assez de contexte est prêt, sans attendre les 96 frames :
// premier de {ces frames décodées, fonts prêtes} borné par [MIN, CAP].
const FRAMES_ENOUGH = 28
const MIN_VISIBLE_MS = 600
const CAP_MS = 2500

export function LandingPreloader({ onDone }: LandingPreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const sigilRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const [hidden, setHidden] = useState(false)

  // Verrouille le scroll ET maintient la page en haut tant que le voile est là,
  // puis relâche quand le voile s'est levé (hidden). Piloté par `hidden` et non
  // par le démontage : `if (hidden) return null` garde le composant monté, donc
  // un cleanup au démontage ne s'exécuterait jamais et laisserait overflow:hidden
  // collé sur <html> (casse le scroll natif : reduced-motion, fallback sans Lenis).
  useEffect(() => {
    if (hidden) {
      getLenis()?.start()
      document.documentElement.style.overflow = ''
      history.scrollRestoration = 'auto'
      return undefined
    }

    // Neutralise la restauration native de scroll pour ce chargement.
    history.scrollRestoration = 'manual'
    document.documentElement.style.overflow = 'hidden'

    // Au refresh après un scroll, le navigateur restaure la position APRÈS cet
    // effet, et Lenis (monté dans un autre effet, peut-être plus tard) peut se
    // resynchroniser sur window.scrollY au premier tick. Un reset one-shot ne
    // suffit donc pas : on ré-ancre à 0 à chaque frame tant que le voile est là,
    // sur window ET Lenis dès qu'il existe. Garantit qu'on atterrit sur le hero.
    let rafId = 0
    const pinTop = () => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0)
      }
      const lenis = getLenis()
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true })
        lenis.stop()
      }
      rafId = requestAnimationFrame(pinTop)
    }
    rafId = requestAnimationFrame(pinTop)

    return () => {
      cancelAnimationFrame(rafId)
      getLenis()?.start()
      document.documentElement.style.overflow = ''
      history.scrollRestoration = 'auto'
    }
  }, [hidden])

  // Jauge : % affiché piloté par le bus de progression du canvas hero.
  useEffect(() => {
    const format = (loaded: number, total: number) => {
      const ratio = total > 0 ? Math.min(loaded / total, 1) : 0
      // On plafonne l'affichage à 99 % : le 100 % coïncide avec la levée du voile.
      return Math.min(Math.round(ratio * 100), 99)
    }

    return subscribePreload(({ loaded, total }) => {
      const node = countRef.current
      if (node) {
        node.textContent = `${format(loaded, total)}`
      }
    })
  }, [])

  useGSAP(
    () => {
      const veil = veilRef.current
      const sigil = sigilRef.current
      const count = countRef.current
      if (!veil) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const startedAt = performance.now()
      let released = false

      // Sortie : même vocabulaire que la section 2 (fondus autoAlpha + blur +
      // courbes expo/power). Pas de wipe rideau (clip-path) : le voile s'estompe
      // en profondeur (léger scale) pendant que le sigil s'élève et se dissout,
      // révélant le hero derrière en douceur. Retire le voile du DOM à la fin.
      const release = () => {
        if (released) return
        released = true

        if (count) {
          count.textContent = '100'
        }

        const core = veil.querySelector('.landing-preloader__core')

        if (reduceMotion) {
          gsap.to(veil, {
            autoAlpha: 0,
            duration: 0.4,
            ease: 'power1.out',
            onComplete: () => {
              setHidden(true)
              onDone()
            },
          })
          return
        }

        // onDone() (entrée du hero) est déclenché AU DÉBUT du fondu du voile, pas
        // à la fin : le contenu du hero se révèle pendant que le voile s'estompe,
        // les deux mouvements se chevauchent → enchaînement fluide, pas un hero
        // vide qui attendrait la disparition complète du voile. setHidden retire
        // le voile du DOM une fois l'animation vraiment terminée.
        const tl = gsap.timeline({
          onComplete: () => {
            setHidden(true)
          },
        })

        // Le sigil culmine (halo doré) puis s'élève et se dissout dans le flou —
        // le compteur et le sigil partent ensemble, en fondu net→flou.
        if (sigil) {
          tl.to(
            sigil,
            {
              scale: 1.08,
              filter: 'brightness(1.35) drop-shadow(0 0 34px rgba(240, 212, 138, 0.6))',
              duration: 0.5,
              ease: 'power2.out',
            },
            0
          ).to(
            sigil,
            { autoAlpha: 0, y: -18, filter: 'blur(6px)', duration: 0.65, ease: 'power2.in' },
            0.34
          )
        }

        if (core) {
          tl.to(
            core,
            { autoAlpha: 0, y: -14, filter: 'blur(8px)', duration: 0.6, ease: 'power2.in' },
            0.36
          )
        }

        // Le voile s'estompe en fondu avec un très léger scale (profondeur), pas
        // un rideau. Chevauche la dissolution du sigil pour un enchaînement fluide.
        tl.to(
          veil,
          {
            autoAlpha: 0,
            scale: 1.045,
            duration: 1.1,
            ease: 'power2.inOut',
          },
          0.42
        )

        // Révèle le hero pile au moment où le voile commence à s'effacer.
        tl.add(onDone, 0.42)
      }

      // Boucle d'attente : lève au premier de {frames suffisantes, fonts prêtes},
      // borné par le minimum d'affichage et le cap. rAF plutôt qu'un abonnement :
      // simple, et on veut de toute façon vérifier le cap en continu.
      let fontsReady = false
      void document.fonts?.ready.then(() => {
        fontsReady = true
      })

      let rafId = 0
      const tick = () => {
        const elapsed = performance.now() - startedAt
        const { loaded, total } = getPreloadState()
        const framesEnough = total > 0 && loaded >= Math.min(FRAMES_ENOUGH, total)
        const ready = framesEnough || fontsReady

        if (elapsed >= CAP_MS || (ready && elapsed >= MIN_VISIBLE_MS)) {
          release()
          return
        }
        rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)

      return () => cancelAnimationFrame(rafId)
    },
    { scope: rootRef }
  )

  if (hidden) return null

  return (
    <div ref={rootRef} className="landing-preloader" role="status" aria-live="polite">
      <div ref={veilRef} className="landing-preloader__veil">
        <div className="landing-preloader__core">
          <div ref={sigilRef} className="landing-preloader__sigil" aria-hidden="true" />
          <p className="landing-preloader__count">
            <span ref={countRef}>0</span>
            <span className="landing-preloader__percent" aria-hidden="true">
              %
            </span>
          </p>
          <span className="sr-only">Chargement de l’expérience</span>
        </div>
      </div>
    </div>
  )
}
