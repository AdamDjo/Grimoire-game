'use client'

import { useEffect, useRef, useState } from 'react'

import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { useHighPerformanceMode } from '@/hooks/use-high-performance-mode'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap-init'

import { KINETIC_LINES } from '../../_data/home-data'

const CHAPTERS = [
  {
    id: 'cendres',
    ariaLabel: 'Cendres de Velkhar — tableau cinématique',
    eyebrow: 'I',
    line: KINETIC_LINES.cendres,
  },
  {
    id: 'artefact',
    ariaLabel: 'L’Artefact — tableau cinématique',
    eyebrow: 'II',
    line: KINETIC_LINES.artefact,
  },
  {
    id: 'nuit',
    ariaLabel: 'La Nuit — tableau cinématique',
    eyebrow: 'III',
    line: KINETIC_LINES.nuit,
  },
] as const

const RAIL_HEIGHT_VH = 500
const FRAMES_DIR = '/home/frames_section2'
const SECTION2_FRAME_COUNT = 60
/** Hauteur native des frames sources (1280×720) — borne l'upscale en cover. */
const SOURCE_HEIGHT = 720

/**
 * Raccord invisible avec la fin du hero : la Section2 démarre sur end_T1, le
 * dernier keyframe net du hero. Le canvas enchaîne dessus sur frame_001 (même
 * plan), donc aucune coupure ni fondu au noir entre les deux sections.
 */
const MATCH_CUT_SRC = '/home/frames_transition/end_T1.png'
const FINAL_FRAME_SRC = `${FRAMES_DIR}/frame_060.webp`

/**
 * Paliers de snap sur la timeline scrub (progress 0→1) — fractions RÉGULIÈRES,
 * calquées sur la Section1Hero (`snap: [0, 1]`), pas des valeurs devinées. Le
 * scroll ne peut se stabiliser QUE sur un de ces états, donc jamais d'atterrissage
 * entre deux paliers (plus d'« image vide » ni de « je dépasse le texte »).
 *
 * Carrousel — un scroll = un palier :
 *  - 0    : déroulé des keyframes → frame_060 figée
 *  - 1/3  : frame_060 + texte I  (cendres)
 *  - 2/3  : frame_060 + texte II (artefact)
 *  - 1    : frame_060 + texte III (nuit)
 *
 * Le segment [0 → 1/3] joue le déroulé des frames PUIS l'apparition de cendres :
 * deux extrémités, rien entre (comportement `[0, 1]` du hero). Le premier scroll
 * déroule tout d'un coup et amène cendres sur la frame figée.
 */
const SNAP_POINTS = [0, 1 / 3, 2 / 3, 1]

/**
 * Fraction du premier segment [0 → 1/3] consacrée au déroulé des frames. Au-delà,
 * cendres apparaît. 0.7 → les frames occupent 70 % du segment, cendres fond sur
 * les 30 % restants, stable au palier 1/3.
 */
const FRAMES_ROLL_RATIO = 0.7

/** Construit l'URL publique d'une frame (1-indexé, zero-paddé sur 3 chiffres). */
function frameSrc(index: number): string {
  return `${FRAMES_DIR}/frame_${String(index).padStart(3, '0')}.webp`
}

/**
 * Dessine une image dans le canvas en reproduisant `object-fit: cover`
 * (l'image remplit tout le canvas sans déformation, débordement centré).
 */
function drawImageCover(canvas: HTMLCanvasElement, img: HTMLImageElement | undefined): void {
  if (!img || !img.complete || img.naturalWidth === 0) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const cw = canvas.width
  const ch = canvas.height
  const iw = img.naturalWidth
  const ih = img.naturalHeight

  const ratio = Math.max(cw / iw, ch / ih)
  const dw = iw * ratio
  const dh = ih * ratio
  const dx = (cw - dw) / 2
  const dy = (ch - dh) / 2

  ctx.clearRect(0, 0, cw, ch)
  ctx.drawImage(img, dx, dy, dw, dh)
}

/**
 * Rail cinématique après le hero — déroulé des keyframes de Section2 puis
 * apparition en séquence des trois textes diégétiques (cendres / artefact /
 * nuit) sur la frame finale figée.
 *
 * Timeline scrubbée sur le scroll avec snap sur les paliers de texte. Le stage
 * plein écran est en position fixed, activé quand le rail est visible.
 */
export function CinematicChapterRail() {
  const railRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([])

  const highPerf = useHighPerformanceMode()
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameStateRef = useRef({ index: 0 })

  const [stageVisible, setStageVisible] = useState(false)

  function resizeCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return

    const rawDpr = Math.min(window.devicePixelRatio || 1, 2)
    const maxScale = SOURCE_HEIGHT / window.innerHeight
    const dpr = Math.min(rawDpr, Math.max(1, maxScale))

    canvas.width = Math.round(window.innerWidth * dpr)
    canvas.height = Math.round(window.innerHeight * dpr)

    drawImageCover(canvas, imagesRef.current[Math.round(frameStateRef.current.index)])
  }

  // Redimensionnement du canvas au resize (débounce + refresh ScrollTrigger).
  useEffect(() => {
    if (!highPerf) return

    resizeCanvas()

    let timeoutId: number | undefined
    const debouncedResize = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        resizeCanvas()
        ScrollTrigger.refresh()
      }, 120)
    }

    window.addEventListener('resize', debouncedResize)
    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      window.removeEventListener('resize', debouncedResize)
    }
  }, [highPerf])

  // Préchargement lazy des frames (IntersectionObserver, marge 100%).
  useEffect(() => {
    if (!highPerf) return

    let loaded = false
    const load = () => {
      if (loaded) return
      loaded = true

      const images: HTMLImageElement[] = []
      for (let i = 1; i <= SECTION2_FRAME_COUNT; i++) {
        const img = new Image()
        img.decoding = 'async'
        img.src = frameSrc(i)
        if (i === 1) {
          img.onload = () => {
            resizeCanvas()
            if (canvasRef.current) drawImageCover(canvasRef.current, img)
          }
        }
        images.push(img)
      }
      imagesRef.current = images
    }

    const container = railRef.current
    if (!container) {
      load()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          load()
          observer.disconnect()
        }
      },
      { rootMargin: '100% 0px' }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [highPerf])

  useGSAP(
    () => {
      const rail = railRef.current
      const chapters = chapterRefs.current.filter(Boolean) as HTMLDivElement[]

      if (!rail || chapters.length !== CHAPTERS.length) return

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const lastFrameIndex = SECTION2_FRAME_COUNT - 1

      // État initial : textes cachés.
      gsap.set(chapters, { autoAlpha: 0, y: 26, filter: 'blur(8px)' })

      // Reduced motion : image finale figée, premier texte visible, pas de scrub.
      if (prefersReducedMotion) {
        setStageVisible(true)
        gsap.set(chapters[0], { autoAlpha: 1, y: 0, filter: 'blur(0px)' })
        if (highPerf && canvasRef.current) {
          frameStateRef.current.index = lastFrameIndex
          requestAnimationFrame(() => {
            if (canvasRef.current) {
              drawImageCover(canvasRef.current, imagesRef.current[lastFrameIndex])
            }
          })
        }
        return
      }

      const drawFrame = () => {
        if (canvasRef.current) {
          drawImageCover(
            canvasRef.current,
            imagesRef.current[Math.round(frameStateRef.current.index)]
          )
        }
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rail,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          snap: {
            snapTo: SNAP_POINTS,
            duration: { min: 0.25, max: 0.6 },
            delay: 0.06,
            ease: 'power2.inOut',
          },
          onToggle: (self) => setStageVisible(self.isActive),
        },
      })

      /** Fondu d'un texte (in ou out), même signature partout — style hero. */
      const fadeIn = (el: HTMLElement, at: number) =>
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 26, filter: 'blur(8px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.12 },
          at
        )
      const fadeOut = (el: HTMLElement, at: number) =>
        tl.to(
          el,
          { autoAlpha: 0, y: -18, filter: 'blur(8px)', ease: 'power2.in', duration: 0.1 },
          at
        )

      // Bornes de progress des paliers de snap (fractions régulières).
      const P1 = 1 / 3 // cendres
      const P2 = 2 / 3 // artefact
      const P3 = 1 // nuit
      const rollEnd = P1 * FRAMES_ROLL_RATIO // fin du déroulé des frames

      // ───────── Segment 1 · Déroulé des keyframes [0 → rollEnd], puis cendres
      // frame_001 → frame_060. Le premier scroll joue tout le déroulé d'un coup
      // (deux extrémités, rien entre — comportement `[0, 1]` du hero), et cendres
      // fond juste après, stable au palier 1/3.
      if (highPerf) {
        tl.to(
          frameStateRef.current,
          {
            index: lastFrameIndex,
            ease: 'none',
            snap: 'index',
            duration: rollEnd,
            onUpdate: drawFrame,
          },
          0
        )
      } else {
        tl.to({}, { duration: rollEnd }, 0)
      }

      // ───────── Palier 1/3 · Texte I (cendres) sur frame_060 figée
      fadeIn(chapters[0], rollEnd + 0.02)

      // ───────── Palier 2/3 · cendres → artefact (carrousel)
      fadeOut(chapters[0], P1 + (P2 - P1) * 0.55)
      fadeIn(chapters[1], P2 - 0.12)

      // ───────── Palier 1 · artefact → nuit (carrousel)
      fadeOut(chapters[1], P2 + (P3 - P2) * 0.55)
      fadeIn(chapters[2], P3 - 0.12)

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    },
    { scope: railRef, dependencies: [highPerf] }
  )

  return (
    <section
      ref={railRef}
      aria-label="Transitions cinématiques de Velkhar"
      className="relative z-10"
      style={{ height: `${RAIL_HEIGHT_VH}vh` }}
    >
      {CHAPTERS.map((chapter) => (
        <div
          key={chapter.id}
          data-section-id={chapter.id}
          aria-label={chapter.ariaLabel}
          className="sr-only"
        />
      ))}

      <div
        ref={stageRef}
        className="pointer-events-none fixed inset-0 z-[20]"
        style={{ opacity: stageVisible ? 1 : 0 }}
      >
        {highPerf ? (
          <>
            <img
              src={MATCH_CUT_SRC}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              style={{ willChange: 'transform' }}
            />
          </>
        ) : (
          <img
            src={FINAL_FRAME_SRC}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Voile de lisibilité concentré en bande centrale, sous le texte —
            assez pour détacher les lettres dorées, sans éteindre la cité
            lumineuse au cœur de l'image. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, transparent 30%, rgba(5,5,6,0.34) 50%, transparent 70%)',
          }}
        />

        {CHAPTERS.map((chapter, index) => (
          <div
            key={chapter.id}
            data-chapter-id={chapter.id}
            ref={(node) => {
              chapterRefs.current[index] = node
            }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
          >
            <span
              className="font-display text-[11px] uppercase text-[var(--gold)] opacity-70 md:text-sm"
              style={{ letterSpacing: '0.32em' }}
            >
              {chapter.eyebrow}
            </span>
            <p
              className="font-serif italic"
              style={{
                fontSize: 'clamp(34px, 5.5vw, 84px)',
                lineHeight: 1.15,
                maxWidth: '18ch',
                letterSpacing: 0,
                textShadow: '0 2px 24px rgba(0,0,0,.85)',
              }}
            >
              <AnimatedShinyText variant="gold-strong" shimmerWidth={320}>
                {chapter.line}
              </AnimatedShinyText>
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
