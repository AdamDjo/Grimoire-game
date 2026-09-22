'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap-init'
import { easeGsap, seconds } from '@/styles/tokens'

import type { CSSProperties, UIEvent } from 'react'

import './auberge-intro.css'

export const AUBERGE_INTRO_STORAGE_KEY = 'grimoire:auberge-intro:v2'

const PROLOGUE_IMAGES = [
  '/encre-de-sel/prologue/archontes.webp',
  '/scenes/travel/travel-tissan-route-sel-v1.webp',
  '/scenes/dungeon/dungeon-cavern-veine-rebrousse-vent-v1.webp',
  '/encre-de-sel/prologue/route-du-sel.webp',
  '/encre-de-sel/prologue/doigt-casse.webp',
] as const

const LAST_CHAPTER_INDEX = PROLOGUE_IMAGES.length - 1
const EXIT_DURATION_MS = seconds.page * 1_000

interface AubergeIntroProps {
  onComplete: () => void
  preview?: boolean
}

interface PrologueProgressStyle extends CSSProperties {
  '--prologue-progress': number
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
    // Le stockage peut être indisponible en navigation privée. Le prologue reste utilisable.
  }
}

export function AubergeIntro({ onComplete, preview = false }: AubergeIntroProps) {
  const t = useTranslations('Auberge')
  const rootRef = useRef<HTMLElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const chapterRefs = useRef<(HTMLElement | null)[]>([])
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollFrameRef = useRef<number | null>(null)
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wheelLockedRef = useRef(false)
  const hasFinishedRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const chapters = [
    { body: t('prologueBlackBody'), title: t('prologueBlackTitle') },
    { body: t('prologueSaltBody'), title: t('prologueSaltTitle') },
    { body: t('prologueAshBody'), title: t('prologueAshTitle') },
    { body: t('prologueSurvivalBody'), title: t('prologueSurvivalTitle') },
    { body: t('prologueInnBody'), title: t('prologueInnTitle') },
  ]
  const isLastChapter = activeIndex === LAST_CHAPTER_INDEX
  const progressStyle: PrologueProgressStyle = {
    '--prologue-progress': (activeIndex + 1) / PROLOGUE_IMAGES.length,
  }

  const finishIntro = useCallback(() => {
    if (hasFinishedRef.current) return

    hasFinishedRef.current = true
    if (!preview) rememberAubergeIntro()
    setIsExiting(true)
    completionTimerRef.current = setTimeout(onComplete, EXIT_DURATION_MS)
  }, [onComplete, preview])

  const scrollToChapter = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(LAST_CHAPTER_INDEX, index))
    const scroller = scrollerRef.current
    const chapter = chapterRefs.current[nextIndex]

    setActiveIndex(nextIndex)
    if (!scroller || !chapter) return

    scroller.scrollTo?.({
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      left: chapter.offsetLeft,
    })
  }, [])

  const showPreviousChapter = useCallback(() => {
    scrollToChapter(activeIndex - 1)
  }, [activeIndex, scrollToChapter])

  const showNextChapter = useCallback(() => {
    if (isLastChapter) {
      finishIntro()
      return
    }

    scrollToChapter(activeIndex + 1)
  }, [activeIndex, finishIntro, isLastChapter, scrollToChapter])

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    if (scrollFrameRef.current !== null) return

    const scroller = event.currentTarget
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const chapterWidth = scroller.clientWidth || window.innerWidth
      const nextIndex = Math.round(scroller.scrollLeft / chapterWidth)
      setActiveIndex(Math.max(0, Math.min(LAST_CHAPTER_INDEX, nextIndex)))
      scrollFrameRef.current = null
    })
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current)
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current)
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        finishIntro()
        return
      }

      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        showPreviousChapter()
      }

      if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(event.key)) {
        event.preventDefault()
        showNextChapter()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [finishIntro, showNextChapter, showPreviousChapter])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return undefined

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

      event.preventDefault()
      if (wheelLockedRef.current || Math.abs(event.deltaY) < 8) return

      wheelLockedRef.current = true
      if (event.deltaY > 0 && activeIndex < LAST_CHAPTER_INDEX) {
        scrollToChapter(activeIndex + 1)
      } else if (event.deltaY < 0 && activeIndex > 0) {
        scrollToChapter(activeIndex - 1)
      }

      wheelTimerRef.current = setTimeout(() => {
        wheelLockedRef.current = false
      }, seconds.page * 1_000)
    }

    scroller.addEventListener('wheel', handleWheel, { passive: false })
    return () => scroller.removeEventListener('wheel', handleWheel)
  }, [activeIndex, scrollToChapter])

  useGSAP(
    () => {
      const scroller = scrollerRef.current
      const root = rootRef.current
      if (!scroller || !root) return undefined

      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const animations = chapterRefs.current.flatMap((chapter) => {
          if (!chapter) return []

          const visual = chapter.querySelector<HTMLElement>('[data-prologue-visual]')
          const copy = chapter.querySelector<HTMLElement>('[data-prologue-copy]')
          if (!visual || !copy) return []

          return [
            gsap.fromTo(
              visual,
              { scale: 1.045 },
              {
                ease: 'none',
                scale: 1,
                scrollTrigger: {
                  end: 'right left',
                  horizontal: true,
                  scroller,
                  scrub: true,
                  start: 'left right',
                  trigger: chapter,
                },
              }
            ),
            gsap.fromTo(
              copy,
              { y: 36 },
              {
                duration: seconds.step,
                ease: easeGsap.out,
                scrollTrigger: {
                  end: 'left 20%',
                  horizontal: true,
                  scroller,
                  scrub: true,
                  start: 'left 80%',
                  trigger: chapter,
                },
                y: 0,
              }
            ),
          ]
        })

        requestAnimationFrame(() => ScrollTrigger.refresh())
        return () =>
          animations.forEach((animation) => {
            animation.kill()
          })
      })

      return () => media.revert()
    },
    { scope: rootRef }
  )

  return (
    <section
      ref={rootRef}
      aria-label={t('introLabel')}
      aria-modal="true"
      className="auberge-intro"
      data-exiting={isExiting}
      role="dialog"
    >
      <div ref={scrollerRef} className="auberge-intro__scroller" onScroll={handleScroll}>
        {chapters.map((chapter, index) => (
          <article
            key={chapter.title}
            ref={(element) => {
              chapterRefs.current[index] = element
            }}
            aria-current={index === activeIndex ? 'step' : undefined}
            className="auberge-intro__chapter"
            data-prologue-chapter={index + 1}
          >
            <div className="auberge-intro__visual" data-prologue-visual aria-hidden="true">
              <Image
                alt=""
                className="auberge-intro__image"
                data-prologue-image
                fill
                priority={index < 2}
                sizes="100vw"
                src={PROLOGUE_IMAGES[index]}
              />
              <div className="auberge-intro__shade" />
              <div className="auberge-intro__grain" />
            </div>

            <div className="auberge-intro__copy" data-prologue-copy>
              <span className="auberge-intro__chapter-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h1>{chapter.title}</h1>
              <p>{chapter.body}</p>
            </div>
          </article>
        ))}
      </div>

      <header className="auberge-intro__header">
        <div className="auberge-intro__location">
          <span>{t('prologueName')}</span>
          <strong>Velkhar</strong>
        </div>
        <GameButton onClick={finishIntro} size="sm" variant="landing-ghost">
          {t('skip')}
        </GameButton>
      </header>

      <footer className="auberge-intro__footer">
        <div
          aria-label={t('prologueProgress')}
          aria-valuemax={PROLOGUE_IMAGES.length}
          aria-valuemin={1}
          aria-valuenow={activeIndex + 1}
          className="auberge-intro__progress"
          role="progressbar"
          style={progressStyle}
        >
          <span />
        </div>
        <div className="auberge-intro__controls">
          <GameButton
            className="auberge-intro__previous"
            disabled={activeIndex === 0}
            leadingIcon={<GameIcon decorative name="arrow" size={24} />}
            onClick={showPreviousChapter}
            size="sm"
            variant="landing-ghost"
          >
            {t('prologuePrevious')}
          </GameButton>
          <GameButton
            className="auberge-intro__next"
            onClick={showNextChapter}
            size="sm"
            trailingIcon={<GameIcon decorative name="arrow" size={24} />}
            variant="landing"
          >
            {isLastChapter ? t('enterInn') : t('prologueNext')}
          </GameButton>
        </div>
      </footer>
    </section>
  )
}
