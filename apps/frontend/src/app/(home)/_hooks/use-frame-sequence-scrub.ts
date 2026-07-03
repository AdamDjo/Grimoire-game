'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, type RefObject } from 'react'

type Tier = 'desktop' | 'tablet' | 'mobile'

function pickTier(): Tier {
  if (typeof window === 'undefined') return 'desktop'
  if (window.matchMedia('(max-width: 639px)').matches) return 'mobile'
  if (window.matchMedia('(max-width: 1023px)').matches) return 'tablet'
  return 'desktop'
}

/**
 * URL d'une frame (1-indexé, 3 digits) — dossier structure `.../{tier}/frame_XXX.webp`.
 * Si le dossier `tier` n'existe pas encore, le composant peut fallback à `framesDir/frame_XXX.webp`
 * en passant `multiTier: false`.
 */
function frameSrc(dir: string, index: number, tier: Tier | null): string {
  const base = tier ? `${dir}/${tier}` : dir
  return `${base}/frame_${String(index).padStart(3, '0')}.webp`
}

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

interface UseFrameSequenceScrubOptions {
  containerRef: RefObject<HTMLElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  /** Chemin public du dossier de frames (ex. "/home/frames_cendres"). */
  framesDir: string
  /** Nombre total de frames (1-indexé). */
  frameCount: number
  /** Si true, cherche les frames dans `framesDir/{tier}/`. Sinon flat dans `framesDir/`. */
  multiTier?: boolean
  /** Phase de scrub sur la timeline scrub 0-1. */
  scrubStart?: number
  scrubEnd?: number
  /** Ne précharger que quand le container approche du viewport (à 100% margin). */
  lazyPreload?: boolean
}

/**
 * useFrameSequenceScrub — scrub d'une séquence de frames webp dans un canvas
 * au scroll. Brique de base des tableaux cinématiques (T1/T2/T3).
 *
 * - Choisit un tier `desktop/tablet/mobile` via matchMedia si `multiTier`.
 * - Précharge les frames en lazy (IntersectionObserver) si `lazyPreload`.
 * - Respect `prefers-reduced-motion` : affiche la dernière frame, pas de scrub.
 */
export function useFrameSequenceScrub({
  containerRef,
  canvasRef,
  framesDir,
  frameCount,
  multiTier = true,
  scrubStart = 0.1,
  scrubEnd = 0.75,
  lazyPreload = true,
}: UseFrameSequenceScrubOptions): void {
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameStateRef = useRef({ index: 0 })
  const loadedRef = useRef(false)

  function resizeCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(window.innerWidth * dpr)
    canvas.height = Math.round(window.innerHeight * dpr)
    drawImageCover(canvas, imagesRef.current[Math.round(frameStateRef.current.index)])
  }

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (loadedRef.current) return

    const load = () => {
      if (loadedRef.current) return
      loadedRef.current = true

      const tier = multiTier ? pickTier() : null
      const images: HTMLImageElement[] = []

      for (let i = 1; i <= frameCount; i++) {
        const img = new Image()
        img.decoding = 'async'
        img.src = frameSrc(framesDir, i, tier)
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

    if (!lazyPreload || !containerRef.current) {
      load()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          load()
          observer.disconnect()
        }
      },
      { rootMargin: '100% 0px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framesDir, frameCount, multiTier, lazyPreload])

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        frameStateRef.current.index = frameCount - 1
        requestAnimationFrame(() => {
          if (canvasRef.current) {
            drawImageCover(canvasRef.current, imagesRef.current[frameCount - 1])
          }
        })
        return
      }

      const tween = gsap.to(frameStateRef.current, {
        index: frameCount - 1,
        ease: 'none',
        snap: 'index',
        scrollTrigger: {
          trigger: containerRef.current,
          start: `top+=${scrubStart * 100}% top`,
          end: `top+=${scrubEnd * 100}% top`,
          scrub: 1,
        },
        onUpdate: () => {
          requestAnimationFrame(() => {
            if (canvasRef.current) {
              drawImageCover(
                canvasRef.current,
                imagesRef.current[Math.round(frameStateRef.current.index)]
              )
            }
          })
        },
      })

      return () => {
        tween.kill()
      }
    },
    { scope: containerRef, dependencies: [frameCount, scrubStart, scrubEnd] }
  )
}
