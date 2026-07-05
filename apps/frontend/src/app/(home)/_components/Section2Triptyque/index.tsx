'use client'

import { useRef, useState } from 'react'

import { ScrollTrigger, useGSAP } from '@/lib/gsap-init'

import { TRIPTYCH_EYEBROW, TRIPTYCH_PANELS, TRIPTYCH_PROMISE } from '../../_data/home-data'
import { EmberParticles } from '../EmberParticles'

import { TriptychGlyph, type TriptychGlyphName } from './TriptychGlyph'

const FRAMES_DIR = '/home/frames_section2'
const SECTION_HEIGHT_VH = 320

/** Ambiance de chaque plaque = une des frames Section2 (raccord univers). */
function frameSrc(name: string): string {
  return `${FRAMES_DIR}/${name}.webp`
}

/**
 * Paliers de snap sur la timeline scrub (progress 0→1) — un palier par plaque,
 * calé sur le *centre* de chaque tranche (1/6, 3/6, 5/6 pour trois plaques). On
 * vise le milieu et non les bords : au bord droit (progress = 1) le pin se
 * relâche et masque le stage, la dernière plaque n'aurait aucun temps d'écran.
 * Un scroll = une plaque.
 */
const SNAP_POINTS = TRIPTYCH_PANELS.map((_, i) => (i + 0.5) / TRIPTYCH_PANELS.length)

/**
 * Section 2 — Le Triptyque.
 *
 * Trois plaques en accordéon horizontal (Mémoire / Maître du Jeu / Velkhar)
 * révélées au scroll sur la dernière frame de la Section2 (frame_060, raccord
 * invisible avec le carrousel du hero). La plaque active s'étend (`flex-grow`)
 * et dévoile son contenu ; les autres restent des tranches fermées.
 *
 * Motion : entrée en cascade au scroll (clip-path), glyphes SVG qui pulsent en
 * boucle, balayage doré sur la plaque active, révélation de titre par masque,
 * braises `<EmberParticles variant="gold" />`, bandeau de promesse.
 *
 * Le scroll pilote `activeIndex` via ScrollTrigger + snap ; le clic/clavier
 * permet aussi de sélectionner une plaque (accessibilité).
 */
export function Section2Triptyque() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLButtonElement | null)[]>([])

  const [stageVisible, setStageVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Reduced motion : stage visible, plaques révélées, première active, pas de scrub.
      if (prefersReducedMotion) {
        setStageVisible(true)
        setRevealed(true)
        setActiveIndex(0)
        return
      }

      const state = { progress: 0 }
      const panelCount = TRIPTYCH_PANELS.length
      const lastIndex = panelCount - 1

      /**
       * Mappe la progression scrub (0→1) sur l'index de plaque active en
       * découpant la timeline en `panelCount` tranches égales. Contrairement à
       * `Math.round(progress * lastIndex)`, la dernière plaque (Velkhar) devient
       * active dès son tiers de timeline et le reste jusqu'à la fin — sans quoi
       * elle ne serait visible qu'au tout dernier instant, là où le stage se
       * masque au relâchement du pin.
       */
      const indexFromProgress = (progress: number) =>
        Math.min(lastIndex, Math.floor(progress * panelCount))

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        snap: {
          snapTo: SNAP_POINTS,
          duration: { min: 0.25, max: 0.6 },
          delay: 0.06,
          ease: 'power2.inOut',
        },
        onToggle: (self) => {
          setStageVisible(self.isActive)
          if (self.isActive) setRevealed(true)
        },
        onUpdate: (self) => {
          state.progress = self.progress
          const next = indexFromProgress(self.progress)
          setActiveIndex((prev) => (prev === next ? prev : next))
        },
      })

      return () => trigger.kill()
    },
    { scope: sectionRef }
  )

  // Parallax souris léger sur l'image de la plaque active (desktop pointer).
  function handlePanelMouseMove(event: React.MouseEvent<HTMLButtonElement>, index: number) {
    if (index !== activeIndex) return
    const img = event.currentTarget.querySelector<HTMLElement>('[data-plate-img]')
    if (!img) return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = (event.clientX - rect.left) / rect.width - 0.5
    const dy = (event.clientY - rect.top) / rect.height - 0.5
    img.style.transform = `scale(1.05) translate(${dx * -12}px, ${dy * -8}px)`
  }

  function resetPanelParallax(event: React.MouseEvent<HTMLButtonElement>) {
    const img = event.currentTarget.querySelector<HTMLElement>('[data-plate-img]')
    if (img) img.style.transform = ''
  }

  return (
    <section
      ref={sectionRef}
      data-section-id="triptyque"
      aria-label="Le Triptyque — mémoire, Maître du Jeu, Velkhar"
      className="relative z-10"
      style={{ height: `${SECTION_HEIGHT_VH}vh` }}
    >
      <div
        ref={stageRef}
        className="fixed inset-0 z-[20] flex h-screen w-full flex-col overflow-hidden"
        style={{ opacity: stageVisible ? 1 : 0, transition: 'opacity 0.35s ease' }}
      >
        {/* Fond global : frame_060 (raccord univers) + voile de profondeur. */}
        <img
          src={frameSrc('frame_060')}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 70% 12%, rgba(196,164,104,0.14), transparent 55%), linear-gradient(180deg, rgba(16,11,6,0.6), rgba(5,5,6,0.86))',
          }}
        />

        <EmberParticles variant="gold" position="absolute" count={48} zIndex={2} />

        {/* Eyebrow. */}
        <div className="relative z-[3] flex items-center justify-center gap-3 pt-8 md:pt-12">
          <span
            className="font-display text-[11px] uppercase text-gold opacity-90 md:text-xs"
            style={{ letterSpacing: '0.32em' }}
          >
            {TRIPTYCH_EYEBROW}
          </span>
        </div>

        {/* Rail des plaques. */}
        <div className="relative z-[3] flex flex-1 gap-3 px-4 py-6 md:px-8 md:py-8">
          {TRIPTYCH_PANELS.map((panel, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={panel.id}
                ref={(node) => {
                  panelRefs.current[index] = node
                }}
                type="button"
                aria-pressed={isActive}
                aria-label={panel.kicker}
                onClick={() => setActiveIndex(index)}
                onMouseMove={(event) => handlePanelMouseMove(event, index)}
                onMouseLeave={resetPanelParallax}
                className="group relative min-w-0 overflow-hidden rounded-[var(--radius)] border text-left transition-[flex-grow,border-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  flex: '1 1 0',
                  flexGrow: isActive ? 5 : 1,
                  borderColor: isActive ? 'var(--gold-50)' : 'var(--gold-15)',
                  boxShadow: isActive ? '0 26px 80px rgba(0,0,0,0.5)' : 'none',
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? 'translateY(0)' : 'translateY(30px)',
                  clipPath: revealed ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                  transition:
                    'flex-grow 0.7s cubic-bezier(0.16,1,0.3,1), border-color 0.7s ease, opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1), clip-path 1s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: revealed ? `${index * 0.15}s` : '0s',
                }}
              >
                {/* Image d'ambiance de la plaque. */}
                <span
                  data-plate-img
                  aria-hidden="true"
                  className="absolute -inset-[4%] bg-cover bg-center transition-[transform,filter] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    backgroundImage: `url(${frameSrc(panel.frame)})`,
                    transform: isActive ? 'scale(1)' : 'scale(1.08)',
                    filter: isActive
                      ? 'saturate(1.05) brightness(1)'
                      : 'saturate(0.8) brightness(0.6)',
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(5,5,6,0.08), rgba(20,16,10,0.34) 45%, rgba(5,5,6,0.86) 82%)',
                    opacity: isActive ? 0.92 : 1,
                  }}
                />
                {/* Sheen doré sur la plaque active. */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 ${isActive ? 'animate-plate-sheen opacity-100' : 'opacity-0'}`}
                  style={{
                    background:
                      'linear-gradient(115deg, transparent 40%, rgba(224,196,137,0.16) 50%, transparent 60%)',
                    backgroundSize: '250% 100%',
                    transition: 'opacity 0.6s ease',
                  }}
                />

                {/* Contenu fermé : glyphe + titre vertical. */}
                <span
                  className="absolute inset-0 flex flex-col items-center justify-center gap-5 transition-opacity duration-500"
                  style={{ opacity: isActive ? 0 : 1 }}
                >
                  <TriptychGlyph
                    name={panel.glyph as TriptychGlyphName}
                    className="h-7 w-7 animate-glyph-pulse text-gold"
                  />
                  <span
                    className="font-display text-[var(--ink)]"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      fontSize: 'clamp(16px, 1.4vw, 20px)',
                      letterSpacing: '0.2em',
                      opacity: 0.85,
                    }}
                  >
                    {panel.title.replace(/\.$/, '')}
                  </span>
                </span>

                {/* Contenu ouvert : kicker + titre (masque) + lore + plaque produit. */}
                <span
                  className="absolute inset-0 flex flex-col justify-end gap-3 p-6 transition-opacity duration-500 md:p-8"
                  style={{ opacity: isActive ? 1 : 0 }}
                >
                  <span className="flex items-center gap-2.5">
                    <TriptychGlyph
                      name={panel.glyph as TriptychGlyphName}
                      className="h-5 w-5 animate-glyph-pulse text-gold"
                    />
                    <span
                      className="font-display text-[11px] uppercase text-gold opacity-80"
                      style={{ letterSpacing: '0.24em' }}
                    >
                      {panel.kicker}
                    </span>
                  </span>

                  <span className="overflow-hidden">
                    <span
                      className="block font-display text-gold-light"
                      style={{
                        fontSize: 'clamp(24px, 2.8vw, 38px)',
                        lineHeight: 1.05,
                        textShadow: '0 2px 20px rgba(0,0,0,0.85)',
                        transform: isActive ? 'translateY(0)' : 'translateY(110%)',
                        transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
                      }}
                    >
                      {panel.title}
                    </span>
                  </span>

                  <span
                    className="font-serif italic text-[var(--ink)]"
                    style={{
                      fontSize: 'clamp(15px, 1.2vw, 17px)',
                      lineHeight: 1.42,
                      maxWidth: '42ch',
                      textShadow: '0 2px 14px rgba(0,0,0,0.9)',
                    }}
                  >
                    {panel.lore}
                  </span>

                  <span
                    className="rounded-[var(--radius)] border px-4 py-3 text-[var(--ink)]"
                    style={{
                      fontSize: 'clamp(14px, 1.1vw, 15px)',
                      lineHeight: 1.5,
                      maxWidth: '44ch',
                      background: 'rgba(12,9,5,0.58)',
                      borderColor: 'rgba(196,164,104,0.22)',
                      boxShadow:
                        'inset 0 1px 0 rgba(224,196,137,0.12), 0 20px 60px rgba(0,0,0,0.35)',
                      backdropFilter: 'blur(14px)',
                    }}
                  >
                    {panel.product}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Bandeau de promesse — rejouabilité infinie. */}
        <div
          className="relative z-[3] flex items-center justify-center gap-4 border-t px-4 py-5"
          style={{
            borderColor: 'rgba(196,164,104,0.18)',
            background: 'linear-gradient(180deg, transparent, rgba(5,4,3,0.9))',
          }}
        >
          <span
            aria-hidden="true"
            className="animate-hairline-pulse hidden h-px w-11 sm:block"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--gold-50))',
            }}
          />
          <p
            className="text-center font-display text-gold-light"
            style={{ fontSize: 'clamp(12px, 1.1vw, 14px)', letterSpacing: '0.08em' }}
          >
            {TRIPTYCH_PROMISE.lead}{' '}
            <em className="font-serif italic text-[var(--ink)]">{TRIPTYCH_PROMISE.emphasis}</em>
          </p>
          <span
            aria-hidden="true"
            className="animate-hairline-pulse hidden h-px w-11 sm:block"
            style={{
              background: 'linear-gradient(90deg, var(--gold-50), transparent)',
            }}
          />
        </div>
      </div>
    </section>
  )
}
