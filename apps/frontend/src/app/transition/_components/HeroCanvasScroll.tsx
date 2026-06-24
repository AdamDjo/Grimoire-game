'use client'

import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useEffect, useState } from 'react'

import { PaginationDot } from '@/app/(home)/_components/PaginationDot'
import { Button } from '@/components/ui/Button'
import { CompassRose } from '@/components/ui/CompassRose'
import { NavBar } from '@/components/ui/NavBar'
import { NAV_LINKS, SECTION_IDS } from '@/lib/home-data'

/**
 * HeroCanvasScroll — Hero "méthode Apple".
 *
 * Une séquence de 96 frames WebP est dessinée dans un <canvas> en fonction de
 * la progression du scroll (scrub GSAP). Le bloc texte d'intro (identique à la
 * landing) fait un fade-out vers ~30 % du scroll pour laisser apprécier
 * l'animation seule.
 *
 * Reprend header + pagination + scroll-down de la landing à l'identique.
 */

/** Logo identique à la landing (CompassRose + "Grimoire"). */
const navLogo = (
  <>
    <CompassRose size={28} />
    <span className="text-gradient-gold font-display font-bold uppercase text-[18px] tracking-[0.22em]">
      Grimoire
    </span>
  </>
)

const navLinks = NAV_LINKS.map((label, i) => ({ label, href: '#', active: i === 0 }))

const FRAME_COUNT = 96

/** Hauteur native des frames sources (1280×720) — borne l'upscale en cover. */
const SOURCE_HEIGHT = 720

/** Construit l'URL publique d'une frame (1-indexé, zero-paddé sur 3 chiffres). */
function frameSrc(index: number): string {
  return `/home/frames_transition/frame_${String(index).padStart(3, '0')}.webp`
}

export function HeroCanvasScroll() {
  const containerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  // Section active pour la pagination (le hero correspond à l'index 0).
  const [activeSection] = useState(0)

  // Images préchargées et état de frame muté par GSAP (refs → pas de re-render).
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameStateRef = useRef({ index: 0 })

  /**
   * Dessine une image dans le canvas en reproduisant `object-fit: cover`
   * (l'image remplit tout le canvas sans déformation, débordement centré).
   */
  function drawImageCover(img: HTMLImageElement | undefined) {
    const canvas = canvasRef.current
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Lissage haute qualité : atténue les artefacts de compression JPEG
    // (bandes verticales des blocs DCT dans les dégradés ciel/brouillard).
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
    // Centrage du débordement.
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2

    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, dw, dh)
  }

  /**
   * Dimensionne le canvas (Retina-aware) puis redessine la frame courante.
   * Doit être appelé avant tout dessin, sinon le canvas garde sa taille
   * interne par défaut (300×150) et l'image s'affiche minuscule dans un coin.
   */
  function resizeCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return

    // DPR plafonné à 2 ET à la résolution native des frames (1920×1080) :
    // au-delà on upscalerait l'image, ce qui révèle les artefacts JPEG.
    // En cover, seule la hauteur native (1080) borne le scale utile.
    const rawDpr = Math.min(window.devicePixelRatio || 1, 2)
    const maxScale = SOURCE_HEIGHT / window.innerHeight
    const dpr = Math.min(rawDpr, Math.max(1, maxScale))

    canvas.width = Math.round(window.innerWidth * dpr)
    canvas.height = Math.round(window.innerHeight * dpr)
    // …la taille CSS reste gérée par les classes Tailwind (w-full h-screen).

    drawImageCover(imagesRef.current[Math.round(frameStateRef.current.index)])
  }

  // Dimensionnement initial + gestion du redimensionnement de la fenêtre.
  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Préchargement des 120 frames (évite tout écran noir pendant le scroll).
  useEffect(() => {
    const images: HTMLImageElement[] = []

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = frameSrc(i)
      // Dessiner la frame 1 dès qu'elle est prête : premier rendu immédiat.
      // resizeCanvas() a déjà fixé la taille interne du canvas en amont.
      if (i === 1) {
        img.onload = () => {
          resizeCanvas()
          drawImageCover(img)
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
          // requestAnimationFrame : on ne dessine qu'une fois par frame d'écran.
          requestAnimationFrame(() => {
            drawImageCover(imagesRef.current[Math.round(frameStateRef.current.index)])
          })
        },
      })

      // 2) Fade-out du texte d'intro + flèche entre 0 % et ~30 % du scroll.
      gsap.to([textRef.current, scrollHintRef.current], {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '30% top',
          scrub: true,
        },
      })
    },
    { scope: containerRef }
  )

  return (
    <section ref={containerRef} aria-label="Accueil" className="relative h-[300vh]">
      {/* Couche fond : séquence d'images (décorative).
          z-[1] : au-dessus de la texture "grain bois" globale (body::before, z-0)
          qui sinon peint des lignes verticales par-dessus la vidéo. */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[1] h-screen w-full"
      />

      {/* Overlays identiques à la landing pour la lisibilité du texte. */}
      <div
        className="pointer-events-none fixed inset-0 z-[2]"
        style={{
          background:
            'linear-gradient(180deg, var(--bg-overlay-55) 0%, transparent 18%, transparent 68%, var(--bg-overlay-95) 100%)',
        }}
      />

      {/* Header — identique à la landing (logo + nav). */}
      <NavBar logo={navLogo} links={navLinks} />

      {/* Pagination latérale — identique à la landing. */}
      <nav
        aria-label="Sections de la page"
        className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-[200] flex-col gap-[18px] items-center"
      >
        {SECTION_IDS.map((id, i) => (
          <PaginationDot key={id} sectionId={id} active={activeSection === i} />
        ))}
      </nav>

      {/* Couche contenu : bloc hero identique à la landing (fade-out au scroll). */}
      <div
        ref={textRef}
        className="pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="flex flex-col items-center">
          <div style={{ marginBottom: 20 }}>
            <CompassRose size={36} />
          </div>

          <p className="text-disp-sm" style={{ marginBottom: 14 }}>
            Un monde. Des âmes. Une infinité de rôles.
          </p>

          <h1
            className="text-gradient-gold font-display font-bold"
            style={{
              fontSize: 'clamp(32px, 7vw, 72px)',
              letterSpacing: '0.06em',
              lineHeight: 1.05,
              margin: '0 0 20px',
              whiteSpace: 'pre-line',
            }}
          >
            {'ÉCRIS TON\nHISTOIRE'}
          </h1>

          <p className="text-serif-md" style={{ marginBottom: 36, maxWidth: 500 }}>
            Plongez dans un univers riche en intrigues, en mystères et en possibilités. Rejoignez
            une communauté de rôlistes passionnés et écrivez votre propre destin.
          </p>

          <div className="pointer-events-auto">
            <Button variant="primary" style={{ fontSize: 13, letterSpacing: '0.22em' }}>
              Entrer dans l&apos;Univers
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll arrow — identique à la landing (disparaît avec le texte). */}
      <div
        ref={scrollHintRef}
        className="fixed left-0 right-0 z-10 flex justify-center"
        style={{ bottom: 40 }}
      >
        <motion.div
          className="flex flex-col items-center gap-1.5"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-disp-xs" style={{ color: 'var(--gold-50)' }}>
            Défiler
          </span>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M18 6 L18 30 M8 20 L18 30 L28 20"
              stroke="rgba(196,164,104,0.7)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              width: 1,
              height: 28,
              background: 'linear-gradient(180deg, var(--gold-50), transparent)',
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}
