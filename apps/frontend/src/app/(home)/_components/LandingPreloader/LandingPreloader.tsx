'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import { getLenis } from '@/hooks/use-lenis'
import { gsap, useGSAP } from '@/lib/gsap-init'

import { getPreloadState } from './preload-progress'

import './landing-preloader.css'

interface LandingPreloaderProps {
  // Appelé quand le voile a fini de se lever : LandingExperience enchaîne alors
  // l'entrée du chrome et des CTA (déplacée derrière ce callback).
  onDone: () => void
}

// Le voile se lève dès qu'assez de contexte est prêt, sans attendre les 96 frames :
// premier de {ces frames décodées, fonts prêtes} borné par [MIN, CAP].
const FRAMES_ENOUGH = 28
const MIN_VISIBLE_MS = 1100
const CAP_MS = 2500

export function LandingPreloader({ onDone }: LandingPreloaderProps) {
  const t = useTranslations('Landing')
  const rootRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
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
    let lockedLenis: ReturnType<typeof getLenis> = null
    const pinTop = () => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0)
      }
      const lenis = getLenis()
      if (lenis && lenis !== lockedLenis) {
        lockedLenis = lenis
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

  useGSAP(
    () => {
      const veil = veilRef.current
      const stage = stageRef.current
      const logo = logoRef.current
      if (!veil) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const startedAt = performance.now()
      let released = false

      if (reduceMotion) {
        gsap.set([stage, logo], { autoAlpha: 1, clearProps: 'transform' })
      } else {
        gsap.set(stage, { autoAlpha: 0 })
        gsap.set(logo, { autoAlpha: 0, scale: 0.985 })

        // Entrée volontairement simple : opacité + transform uniquement. Aucun
        // calque de reflet ni blur animé, pour éviter les textures rectangulaires
        // et les saccades de composition GPU autour de l'image transparente.
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
        intro
          .to(stage, { autoAlpha: 1, duration: 0.18 }, 0)
          .to(logo, { autoAlpha: 1, scale: 1, duration: 0.68, ease: 'power2.out' }, 0.04)
      }

      // Sortie : même vocabulaire que la section 2 (fondus autoAlpha + blur +
      // courbes expo/power). Pas de wipe rideau (clip-path) : le voile s'estompe
      // en profondeur (léger scale) pendant que la marque s'élève et se dissout,
      // révélant le hero derrière en douceur. Retire le voile du DOM à la fin.
      const release = () => {
        if (released) return
        released = true

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

        // La marque se retire sans blur ni variation de filtre : ces effets
        // forçaient le navigateur à recalculer un grand calque rectangulaire.
        if (logo) {
          tl.to(logo, { autoAlpha: 0, scale: 1.015, duration: 0.48, ease: 'power2.in' }, 0)
        }

        if (stage) {
          tl.to(stage, { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, 0.14)
        }

        // Le voile s'estompe sans scale plein écran, plus stable sur les GPU
        // intégrés et les écrans haute densité.
        tl.to(
          veil,
          {
            autoAlpha: 0,
            duration: 0.72,
            ease: 'power1.inOut',
          },
          0.16
        )

        // Révèle le hero pile au moment où le voile commence à s'effacer.
        tl.add(onDone, 0.16)
      }

      // Lève au premier de {frames suffisantes, fonts prêtes}, borné par le
      // minimum d'affichage et le cap. Une cadence de 20 Hz suffit pour ce statut
      // et laisse le thread principal disponible pour décoder les images.
      let fontsReady = false
      void document.fonts?.ready.then(() => {
        fontsReady = true
      })

      let pollId = 0
      const tick = () => {
        const elapsed = performance.now() - startedAt
        const { loaded, total } = getPreloadState()
        const framesEnough = total > 0 && loaded >= Math.min(FRAMES_ENOUGH, total)
        const ready = framesEnough || fontsReady

        if (elapsed >= CAP_MS || (ready && elapsed >= MIN_VISIBLE_MS)) {
          release()
          return
        }
        pollId = window.setTimeout(tick, 50)
      }
      pollId = window.setTimeout(tick, 50)

      return () => window.clearTimeout(pollId)
    },
    { scope: rootRef }
  )

  if (hidden) return null

  return (
    <div ref={rootRef} className="landing-preloader" role="status" aria-live="polite">
      <div ref={veilRef} className="landing-preloader__veil">
        <div ref={stageRef} className="landing-preloader__stage" aria-hidden="true">
          <span className="landing-preloader__rule landing-preloader__rule--left" />
          <span className="landing-preloader__rule landing-preloader__rule--right" />
          <div ref={logoRef} className="landing-preloader__logo">
            <Image
              className="landing-preloader__logo-image"
              src="/landing/ui/brand-lockup-grimoire.webp"
              alt=""
              width={720}
              height={336}
              priority
              sizes="(max-width: 640px) 220px, 360px"
            />
          </div>
          <div className="landing-preloader__status">
            <span className="landing-preloader__status-label">{t('loading')}</span>
            <span className="landing-preloader__status-marks">
              <span />
              <span />
              <span />
            </span>
          </div>
        </div>
        <span className="sr-only">{t('loadingExperience')}</span>
      </div>
    </div>
  )
}
