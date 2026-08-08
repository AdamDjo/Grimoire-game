'use client'

import { useEffect, useRef } from 'react'

import { buildImageSet } from '@/lib/image-set'

import { markFrameLoaded, setPreloadTotal } from '../LandingPreloader/preload-progress'

import './frame-sequence-canvas.css'

interface FrameSequenceCanvasProps {
  className?: string
  fallbackSrc: string
  fallbackSrcWebp?: string
  frameCount?: number
  frameDir: string
  // Seul le canvas hero alimente le bus de progression lu par le preloader.
  reportPreload?: boolean
}

type FrameRenderer = (progress: number) => void

const renderers = new WeakMap<HTMLElement, FrameRenderer>()

const MAX_PIXEL_RATIO = 2
const PRELOAD_CONCURRENCY = 6
const REDRAW_EPSILON = 0.002
const FLOW_QUERY = '(max-width: 1100px)'

export function renderFrameSequence(root: HTMLElement | null, progress: number) {
  if (root) {
    renderers.get(root)?.(progress)
  }
}

function buildFramePath(frameDir: string, index: number) {
  return `${frameDir}/frame_${String(index + 1).padStart(3, '0')}.webp`
}

export function FrameSequenceCanvas({
  className = '',
  fallbackSrc,
  fallbackSrcWebp,
  frameCount = 0,
  frameDir,
  reportPreload = false,
}: FrameSequenceCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!root || !canvas || !context || frameCount <= 0) {
      return undefined
    }

    let disposed = false
    let fullPreloadStarted = false
    let lastProgress = 0
    let lastDrawnFrame = -1
    const images: (HTMLImageElement | null)[] = Array.from({ length: frameCount }, () => null)

    const nearestLoadedIndex = (target: number) => {
      for (let offset = 0; offset < frameCount; offset += 1) {
        if (images[target - offset]) {
          return target - offset
        }
        if (images[target + offset]) {
          return target + offset
        }
      }
      return -1
    }

    const drawCover = (image: HTMLImageElement, alpha: number) => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale

      context.globalAlpha = alpha
      context.drawImage(
        image,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight
      )
    }

    // Blende la frame suivante par-dessus la frame de base : la séquence source
    // est en 12 fps, l'interpolation d'alpha masque les sauts entre frames.
    const render: FrameRenderer = (progress) => {
      lastProgress = progress
      const clamped = Math.min(Math.max(progress, 0), 1)
      const exactFrame = clamped * (frameCount - 1)

      if (lastDrawnFrame >= 0 && Math.abs(exactFrame - lastDrawnFrame) < REDRAW_EPSILON) {
        return
      }

      const baseFrame = Math.floor(exactFrame)
      const blend = exactFrame - baseFrame
      const baseIndex = images[baseFrame] ? baseFrame : nearestLoadedIndex(baseFrame)
      const baseImage = baseIndex >= 0 ? images[baseIndex] : null

      if (!baseImage) {
        return
      }

      lastDrawnFrame = exactFrame
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
      drawCover(baseImage, 1)

      const nextImage = baseIndex === baseFrame && blend > 0 ? images[baseFrame + 1] : null

      if (nextImage) {
        drawCover(nextImage, blend)
      }

      context.globalAlpha = 1
    }

    const resize = () => {
      const width = root.clientWidth
      const height = root.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)

      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      lastDrawnFrame = -1
      render(lastProgress)
    }

    const loadFrame = (index: number) =>
      new Promise<void>((resolve) => {
        const image = new Image()
        image.decoding = 'async'
        image.src = buildFramePath(frameDir, index)

        const finalize = () => {
          if (!disposed && image.naturalWidth > 0) {
            images[index] = image

            if (index <= Math.ceil(lastProgress * (frameCount - 1)) + 1) {
              lastDrawnFrame = -1
              render(lastProgress)
            }
          }

          // Chaque frame décodée (ou en échec) fait avancer la jauge du preloader :
          // on compte la résolution, pas le succès, pour que le voile se lève même
          // si une frame casse.
          if (reportPreload && !disposed) {
            markFrameLoaded()
          }

          resolve()
        }

        image.decode().then(finalize).catch(finalize)
      })

    const preloadFirstFrame = async () => {
      await loadFrame(0)
    }

    const preloadRemainingFrames = async () => {
      if (fullPreloadStarted || disposed) return
      fullPreloadStarted = true

      if (reportPreload) {
        setPreloadTotal(frameCount)
      }
      const queue = Array.from({ length: frameCount - 1 }, (_, index) => index + 1)
      const workers = Array.from({ length: PRELOAD_CONCURRENCY }, async () => {
        while (queue.length > 0 && !disposed) {
          const index = queue.shift()

          if (index !== undefined) {
            await loadFrame(index)
          }
        }
      })

      await Promise.all(workers)
    }

    const flowQuery = window.matchMedia(FLOW_QUERY)
    const handleViewportMode = () => {
      if (!flowQuery.matches) {
        void preloadRemainingFrames()
      }
    }

    // Le flux tablette/mobile n'utilise pas la séquence scrubbée : seule la
    // première frame est nécessaire comme fallback. Si le viewport repasse en
    // grand desktop, le reste se charge sans remonter le composant.
    if (reportPreload) setPreloadTotal(flowQuery.matches ? 1 : frameCount)

    const observer = new ResizeObserver(resize)
    observer.observe(root)
    resize()
    void preloadFirstFrame().then(handleViewportMode)
    flowQuery.addEventListener('change', handleViewportMode)
    renderers.set(root, render)

    return () => {
      disposed = true
      flowQuery.removeEventListener('change', handleViewportMode)
      observer.disconnect()
      renderers.delete(root)
    }
  }, [frameCount, frameDir, reportPreload])

  return (
    <div
      ref={rootRef}
      className={`frame-sequence ${className}`}
      style={{ backgroundImage: buildImageSet(fallbackSrc, fallbackSrcWebp) }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
    </div>
  )
}
