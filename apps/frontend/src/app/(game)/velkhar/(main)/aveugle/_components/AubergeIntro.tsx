'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

import './auberge-intro.css'

export const AUBERGE_INTRO_STORAGE_KEY = 'grimoire:auberge-intro:v1'

const SKIP_DELAY_MS = 1_000
const EXIT_DURATION_MS = 500

interface AubergeIntroProps {
  onComplete: () => void
  preview?: boolean
}

export function hasSeenAubergeIntro(): boolean {
  try {
    return window.sessionStorage.getItem(AUBERGE_INTRO_STORAGE_KEY) === 'seen'
  } catch {
    return false
  }
}

function rememberAubergeIntro(): void {
  try {
    window.sessionStorage.setItem(AUBERGE_INTRO_STORAGE_KEY, 'seen')
  } catch {
    // Le stockage peut être indisponible en navigation privée. L’intro reste utilisable.
  }
}

export function AubergeIntro({ onComplete, preview = false }: AubergeIntroProps) {
  const t = useTranslations('Auberge')
  const videoRef = useRef<HTMLVideoElement>(null)
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasFinishedRef = useRef(false)
  const [canSkip, setCanSkip] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaybackBlocked, setIsPlaybackBlocked] = useState(false)

  const finishIntro = useCallback(() => {
    if (hasFinishedRef.current) return

    hasFinishedRef.current = true
    if (!preview) rememberAubergeIntro()
    setIsExiting(true)
    videoRef.current?.pause()
    completionTimerRef.current = setTimeout(onComplete, EXIT_DURATION_MS)
  }, [onComplete, preview])

  useEffect(() => {
    const skipTimer = window.setTimeout(() => setCanSkip(true), SKIP_DELAY_MS)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.clearTimeout(skipTimer)
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    if (!canSkip) return undefined

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finishIntro()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canSkip, finishIntro])

  const startPlayback = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    try {
      await video.play()
      setIsPlaybackBlocked(false)
    } catch {
      setIsPlaybackBlocked(true)
    }
  }, [])

  const toggleSound = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const nextMuted = !video.muted
    video.muted = nextMuted
    setIsMuted(nextMuted)
  }, [])

  return (
    <section
      aria-label={t('introLabel')}
      aria-modal="true"
      className="auberge-intro"
      data-exiting={isExiting}
      role="dialog"
    >
      <video
        ref={videoRef}
        autoPlay
        className="auberge-intro__video"
        muted={isMuted}
        onCanPlay={startPlayback}
        onEnded={finishIntro}
        onError={finishIntro}
        playsInline
        poster="/cinematics/auberge-entry-poster.jpg"
        preload="auto"
      >
        <source src="/cinematics/auberge-entry.mp4" type="video/mp4" />
      </video>

      <div className="auberge-intro__shade" aria-hidden="true" />

      <header className="auberge-intro__location">
        <span>Velkhar</span>
        <strong>{t('innName')}</strong>
      </header>

      <div className="auberge-intro__controls">
        <button
          aria-label={isMuted ? t('enableSound') : t('muteSound')}
          aria-pressed={!isMuted}
          className="auberge-intro__control auberge-intro__sound"
          onClick={toggleSound}
          type="button"
        >
          {isMuted ? t('soundOff') : t('soundOn')}
        </button>
        <button
          className="auberge-intro__control auberge-intro__skip"
          disabled={!canSkip}
          onClick={finishIntro}
          type="button"
        >
          {t('skip')} <span aria-hidden="true">→</span>
        </button>
      </div>

      {isPlaybackBlocked ? (
        <button className="auberge-intro__play" onClick={startPlayback} type="button">
          {t('enterInn')}
        </button>
      ) : null}
    </section>
  )
}
