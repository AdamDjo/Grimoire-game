'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

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

  // Lissage haute qualité : atténue les artefacts de compression JPEG.
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const cw = canvas.width
  const ch = canvas.height
  const iw = img.naturalWidth
  const ih = img.naturalHeight

  // Échelle "cover" : on prend le ratio le plus grand pour couvrir tout le canvas.
  const ratio = Math.max(cw / iw, ch / ih)
  const dw = iw * ratio
  const dh = ih * ratio
  const dx = (cw - dw) / 2
  const dy = (ch - dh) / 2

  ctx.clearRect(0, 0, cw, ch)
  ctx.drawImage(img, dx, dy, dw, dh)
}

interface UseCanvasScrollSequenceOptions {
  /** Ref sur le <section> conteneur (ScrollTrigger trigger). */
  containerRef: React.RefObject<HTMLElement | null>
  /** Ref sur le <canvas> cible. */
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  /** Éléments qui font un fade-out dès le premier scroll. */
  fadeTargetRefs: React.RefObject<HTMLElement | null>[]
}

/**
 * useCanvasScrollSequence — encapsule :
 * 1) Le dimensionnement Retina-aware du canvas (resize inclus).
 * 2) Le préchargement des 96 frames WebP.
 * 3) L'animation GSAP scrub (frames pilotées par le scroll).
 * 4) Le fade-out GSAP des éléments texte/hint au premier scroll.
 */
export function useCanvasScrollSequence({
  containerRef,
  canvasRef,
  fadeTargetRefs,
}: UseCanvasScrollSequenceOptions): void {
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameStateRef = useRef({ index: 0 })

  /**
   * Dimensionne le canvas (Retina-aware) puis redessine la frame courante.
   */
  function resizeCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return

    // DPR plafonné à 2 ET à la résolution native des frames (1280×720).
    const rawDpr = Math.min(window.devicePixelRatio || 1, 2)
    const maxScale = SOURCE_HEIGHT / window.innerHeight
    const dpr = Math.min(rawDpr, Math.max(1, maxScale))

    canvas.width = Math.round(window.innerWidth * dpr)
    canvas.height = Math.round(window.innerHeight * dpr)

    drawImageCover(canvas, imagesRef.current[Math.round(frameStateRef.current.index)])
  }

  // Dimensionnement initial + gestion du redimensionnement de la fenêtre.
  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Préchargement des frames (évite tout écran noir pendant le scroll).
  useEffect(() => {
    const images: HTMLImageElement[] = []

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = frameSrc(i)
      // Dessiner la frame 1 dès qu'elle est prête : premier rendu immédiat.
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
      gsap.registerPlugin(ScrollTrigger)

      // 1) Frames pilotées par le scroll (scrub).
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

      // 2) Fade-out du texte d'intro + flèche, déclenché au premier scroll.
      //    Non scrubbé : animation autonome, indépendante de la vitesse de molette.
      const fadeTargets = fadeTargetRefs.map((r) => r.current).filter(Boolean)
      if (fadeTargets.length > 0) {
        gsap.to(fadeTargets, {
          opacity: 0,
          y: -40,
          filter: 'blur(8px)',
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top+=4% top',
            toggleActions: 'play none none reverse',
          },
        })
      }
    },
    { scope: containerRef }
  )
}
