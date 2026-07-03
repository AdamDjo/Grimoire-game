'use client'

import { useEffect, useRef } from 'react'

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap-init'

const FRAME_COUNT = 96

/** Hauteur native des frames sources (1280×720) — borne l'upscale en cover. */
const SOURCE_HEIGHT = 720

/** Construit l'URL publique d'une frame (1-indexé, zero-paddé sur 3 chiffres). */
function frameSrc(index: number): string {
  return `/home/frames_transition/frame_${String(index).padStart(3, '0')}.webp`
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

interface UseCanvasScrollSequenceOptions {
  containerRef: React.RefObject<HTMLElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  /** Vidéo Hero.mp4 affichée à l'arrivée puis fade-out à l'intro. */
  videoRef: React.RefObject<HTMLVideoElement | null>
  /** Wrapper du bloc texte central (HeroContent). */
  textRef: React.RefObject<HTMLElement | null>
  /** Flèche/label « Défiler » en bas — fade-out à l'intro. */
  scrollHintRef: React.RefObject<HTMLElement | null>
  /** Sous-éléments du bloc texte, révélés en cascade pendant l'intro. */
  textChildRefs: {
    compassRose: React.RefObject<HTMLElement | null>
    slideTexts: React.RefObject<HTMLElement | null>
    cta: React.RefObject<HTMLElement | null>
  }
}

/**
 * useCanvasScrollSequence — orchestre toute la chorégraphie de la Section1Hero
 * via une timeline GSAP unique scrubbée par le scroll (`scrub: 1`) :
 *
 *   Phase A · Intro            [0 → 0.08]
 *     · Vidéo Hero.mp4 fade-out
 *     · Canvas frame-by-frame fade-in (opacité)
 *     · Texte révélé en cascade : CompassRose → slide → CTA (fade + blur)
 *     · ScrollHint fade-out
 *
 *   Phase B · Frame scrub      [0.08 → 0.70]
 *     · Frame index 0 → 95 (logique existante préservée)
 *
 *   Phase C · Sortie texte     [0.80 → 0.90]
 *     · CompassRose / slide / CTA fade-up + blur (symétrique de l'entrée)
 *     · La dernière frame (96) reste à l'écran jusqu'à la fin du scroll,
 *       assurant la continuité visuelle avec Section2Seuil qui réutilise
 *       cette même frame comme fond.
 *
 * Respecte `prefers-reduced-motion` : pas de vidéo, pas de blur, état final
 * appliqué immédiatement.
 */
export function useCanvasScrollSequence({
  containerRef,
  canvasRef,
  videoRef,
  textRef,
  scrollHintRef,
  textChildRefs,
}: UseCanvasScrollSequenceOptions): void {
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameStateRef = useRef({ index: 0 })

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

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const images: HTMLImageElement[] = []

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useGSAP(
    () => {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const video = videoRef.current
      const canvas = canvasRef.current
      const text = textRef.current
      const scrollHint = scrollHintRef.current
      const compass = textChildRefs.compassRose.current
      const slides = textChildRefs.slideTexts.current
      const cta = textChildRefs.cta.current

      // Reduced motion : afficher l'état final immédiatement, pas d'animation
      // d'intro. Le pull-back vers la carte reste actif (informationnel).
      if (prefersReducedMotion) {
        if (video) {
          video.pause()
          gsap.set(video, { opacity: 0 })
        }
        if (canvas) gsap.set(canvas, { opacity: 1 })
        if (text) gsap.set(text, { opacity: 1, filter: 'blur(0px)', y: 0 })
        if (scrollHint) gsap.set(scrollHint, { opacity: 1 })

        // Frame scrub pleine course (0 → 95).
        gsap.to(frameStateRef.current, {
          index: FRAME_COUNT - 1,
          ease: 'none',
          snap: 'index',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
          onUpdate: () => {
            if (canvasRef.current) {
              drawImageCover(
                canvasRef.current,
                imagesRef.current[Math.round(frameStateRef.current.index)]
              )
            }
          },
        })

        return
      }

      // État initial : wrapper texte caché, canvas invisible, vidéo pleine
      // opacité (l'attribut autoplay s'occupe de la lecture).
      if (text) gsap.set(text, { opacity: 0, y: 24, filter: 'blur(8px)' })
      const children = [compass, slides, cta].filter(Boolean) as HTMLElement[]
      if (children.length > 0) {
        gsap.set(children, { opacity: 0, y: 24, filter: 'blur(8px)' })
      }
      if (canvas) gsap.set(canvas, { opacity: 0 })
      if (video) gsap.set(video, { opacity: 1 })

      // Timeline maîtresse : une seule ScrollTrigger sur toute la section,
      // scrubbée à 1 (lerp léger) pour un rendu velouté.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      // ───────── Phase A · Intro [0 → 0.08]
      if (video) tl.to(video, { opacity: 0, ease: 'power3.out', duration: 0.08 }, 0)
      if (canvas) tl.to(canvas, { opacity: 1, ease: 'power3.out', duration: 0.08 }, 0)
      if (text)
        tl.to(
          text,
          { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.06 },
          0.01
        )
      if (compass)
        tl.to(
          compass,
          { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.05 },
          0.01
        )
      if (slides)
        tl.to(
          slides,
          { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.05 },
          0.025
        )
      if (cta)
        tl.to(
          cta,
          { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.05 },
          0.04
        )
      if (scrollHint)
        tl.to(scrollHint, { opacity: 0, y: -20, ease: 'power2.out', duration: 0.06 }, 0)

      // ───────── Phase B · Frame scrub [0.08 → 0.70]
      tl.to(
        frameStateRef.current,
        {
          index: FRAME_COUNT - 1,
          ease: 'none',
          snap: 'index',
          duration: 0.62,
          onUpdate: () => {
            if (canvasRef.current) {
              drawImageCover(
                canvasRef.current,
                imagesRef.current[Math.round(frameStateRef.current.index)]
              )
            }
          },
        },
        0.08
      )

      // ───────── Phase C · Sortie texte [0.80 → 0.90]
      const exitTargets = [compass, slides, cta].filter(Boolean) as HTMLElement[]
      if (exitTargets.length > 0) {
        tl.to(
          exitTargets,
          {
            opacity: 0,
            y: -24,
            filter: 'blur(8px)',
            ease: 'power2.in',
            duration: 0.1,
            stagger: 0.01,
          },
          0.8
        )
      }
      // Le canvas reste à opacity 1 jusqu'à la fin de Section 1 : la frame_096
      // (dernière image) demeure visible derrière les sections suivantes via
      // son `position: fixed`. C'est Section2 qui crossfade par-dessus avec un
      // voile noir scrubbé, garantissant zéro coupure visuelle.
    },
    { scope: containerRef }
  )
}
