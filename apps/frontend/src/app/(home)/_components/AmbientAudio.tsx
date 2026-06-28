'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'grimoire-audio'
const TARGET_VOLUME = 0.35
const FADE_MS = 600
const FADE_STEPS = 24

interface AmbientAudioProps {
  src?: string
}

/**
 * AmbientAudio — boucle d'ambiance (vent + braises + plume) avec toggle.
 *
 * - Off par défaut (respect autoplay-policy : nécessite user gesture).
 * - Persistance localStorage `grimoire-audio`.
 * - Fade volume (0 ↔ 0.35) plutôt que cut sec.
 * - Pause automatique quand l'onglet perd le focus, reprise au retour.
 * - Bouton fixed top-right, ARIA `aria-pressed` + `aria-label` dynamique.
 *
 * Asset attendu : `public/audio/ambient.mp3` (~30s loop seamless).
 * Si l'asset manque, le composant reste silencieux (état "off" indélogeable).
 */
export function AmbientAudio({ src = '/audio/ambient.mp3' }: AmbientAudioProps) {
  const [isOn, setIsOn] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeTimerRef = useRef<number | null>(null)

  // Mount : restaure préférence + branche listener visibilitychange.
  useEffect(() => {
    setIsMounted(true)
    if (typeof window === 'undefined') return

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'on') setIsOn(true)
    } catch {
      // localStorage indisponible — on reste off.
    }

    const handleVisibility = () => {
      const audio = audioRef.current
      if (!audio) return
      if (document.hidden) {
        audio.pause()
      } else if (isOn) {
        void audio.play().catch(() => undefined)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
    // On ne dépend volontairement pas de isOn ici (handler lit la valeur courante via ref indirecte au moment du callback)
    // — pour simplifier, on s'autorise un re-attach quand isOn change.
  }, [isOn])

  const fadeVolume = useCallback((target: number, onDone?: () => void) => {
    const audio = audioRef.current
    if (!audio) return
    if (fadeTimerRef.current) {
      window.clearInterval(fadeTimerRef.current)
      fadeTimerRef.current = null
    }
    const start = audio.volume
    const step = (target - start) / FADE_STEPS
    let i = 0
    fadeTimerRef.current = window.setInterval(() => {
      i += 1
      audio.volume = Math.max(0, Math.min(1, start + step * i))
      if (i >= FADE_STEPS) {
        if (fadeTimerRef.current) {
          window.clearInterval(fadeTimerRef.current)
          fadeTimerRef.current = null
        }
        audio.volume = target
        onDone?.()
      }
    }, FADE_MS / FADE_STEPS) as unknown as number
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const next = !isOn
    setIsOn(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
    } catch {
      // ignore
    }

    if (next) {
      audio.volume = 0
      void audio
        .play()
        .then(() => fadeVolume(TARGET_VOLUME))
        .catch(() => {
          // Autoplay refusé ou asset manquant — on revient en off.
          setIsOn(false)
          try {
            window.localStorage.setItem(STORAGE_KEY, 'off')
          } catch {
            // ignore
          }
        })
    } else {
      fadeVolume(0, () => audio.pause())
    }
  }, [fadeVolume, isOn])

  if (!isMounted) return null

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" aria-hidden="true" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isOn}
        aria-label={isOn ? 'Couper le son ambiant' : 'Activer le son ambiant'}
        className="fixed right-4 top-4 z-[70] flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-black/30 text-[var(--gold-light)] backdrop-blur-md transition-colors duration-300 hover:bg-black/55 hover:text-[var(--gold-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold)] sm:right-6 sm:top-6"
      >
        {isOn ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
      </button>
    </>
  )
}
