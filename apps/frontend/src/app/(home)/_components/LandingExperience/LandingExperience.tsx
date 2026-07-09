'use client'

import { useCallback, useRef, useState } from 'react'

import { AmbientEmbers, CustomCursor, SectionProgress } from '@/components/ui'
import { useLenis } from '@/hooks/use-lenis'
import { ScrollTrigger, SplitText, gsap, useGSAP } from '@/lib/gsap-init'

import { renderFrameSequence } from '../FrameSequenceCanvas/FrameSequenceCanvas'
import { LandingChrome } from '../LandingChrome/LandingChrome'
import { LandingPreloader } from '../LandingPreloader/LandingPreloader'
import { Section2GameplayProof } from '../Section2GameplayProof/Section2GameplayProof'
import { SectionAubergeCta } from '../SectionAubergeCta/SectionAubergeCta'
import { SectionHero } from '../SectionHero/SectionHero'

export function LandingExperience() {
  const rootRef = useRef<HTMLDivElement>(null)
  // L'entrée du chrome et des CTA attend la levée du voile de preload.
  const [preloaderDone, setPreloaderDone] = useState(false)
  const handlePreloaderDone = useCallback(() => setPreloaderDone(true), [])

  useLenis()

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const chrome = document.querySelector<HTMLElement>('[data-motion="chrome"]')

      // L'état condensé (fond + blur) reste actif même en reduced-motion :
      // c'est de la lisibilité, pas de l'ornement. onUpdate plutôt que
      // toggleClass+end car `end:'max'` retirerait la classe pile en bas de page.
      if (chrome) {
        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            chrome.classList.toggle('is-scrolled', self.scroll() > 40)
          },
        })

        // Hide-on-scroll : canal yPercent, distinct du `y` de l'entrée (jamais
        // deux tweens sur la même prop). ST viewport-based sans trigger DOM →
        // ne crée pas de pin-spacer, n'interfère pas avec les pins hero/gameplay.
        // Conservé hors reduced-motion (masquer/révéler le header = mouvement).
        if (!reduceMotion) {
          const hideChrome = gsap.to(chrome, {
            yPercent: -120,
            autoAlpha: 0,
            duration: 0.55,
            ease: 'power3.out',
            paused: true,
          })

          ScrollTrigger.create({
            start: 'top top',
            end: 'max',
            onUpdate: (self) => {
              if (self.direction === -1) {
                hideChrome.reverse()
              } else if (self.scroll() > window.innerHeight * 0.6) {
                hideChrome.play()
              }
            },
          })
        }
      }

      // Chrome caché au départ : son entrée est jouée à la levée du voile de
      // preload (canal `y`, distinct du `yPercent` du hide-on-scroll).
      gsap.set('[data-motion="chrome"]', { autoAlpha: 0, y: -20 })
      gsap.set('[data-motion="reveal"]', { autoAlpha: 0, y: 26, filter: 'blur(10px)' })
      gsap.set('[data-motion="hero-actions"]', { autoAlpha: 0, y: 18, filter: 'blur(8px)' })
      // Le hero garde sa cascade span (jouée à la levée du voile, hors reduced-motion).
      // Les titres non-hero sont animés par SplitText plus bas — on ne les fige pas ici
      // pour ne pas masquer un état pré-split (FOUC) : SplitText pose son propre état.
      const heroTitle = rootRef.current?.querySelector<HTMLElement>(
        '[data-motion="hero"] [data-motion="title"]'
      )
      if (heroTitle) {
        gsap.set(heroTitle, { autoAlpha: 1, y: 0, filter: 'none' })
        gsap.set(heroTitle.querySelectorAll('span'), { autoAlpha: 0, y: 34, filter: 'blur(12px)' })
      }

      if (reduceMotion) {
        gsap.set(
          '[data-motion="chrome"], [data-motion="reveal"], [data-motion="hero-actions"], [data-motion="title"] span, [data-motion="title"]',
          {
            autoAlpha: 1,
            y: 0,
            filter: 'none',
          }
        )
        gsap.set('[data-hero-idle]', { autoAlpha: 0 })
        return
      }

      // L'entrée du chrome, des CTA et du contenu HERO n'est PAS jouée ici : elle
      // est déclenchée par la levée du voile de preload (useGSAP dédié,
      // dependencies:[preloaderDone]). Les éléments du hero sont déjà dans le
      // viewport au chargement — les laisser sur ScrollTrigger les ferait jouer
      // DERRIÈRE le voile, donc "pop" à la levée. On les exclut ici et on les
      // rejoue en fondu synchronisé avec la sortie du preloader.
      const inHero = (element: HTMLElement) => Boolean(element.closest('[data-motion="hero"]'))

      gsap.utils
        .toArray<HTMLElement>('[data-motion="reveal"]')
        .filter((element) => !inHero(element))
        .forEach((element) => {
          gsap.to(element, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 82%',
              once: true,
            },
          })
        })

      // Titres non-hero : reveal ligne par ligne via SplitText, chaque ligne masquée
      // (`mask:'lines'`) montant depuis le bas. autoSplit re-split au resize — critique
      // avec la type fluide en clamp() (le nombre de lignes change selon la largeur).
      // Chaque SplitText rebranche son propre reveal via onSplit → self-healing.
      gsap.utils
        .toArray<HTMLElement>('[data-motion="title"]')
        .filter((title) => !inHero(title))
        .forEach((title) => {
          SplitText.create(title, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            linesClass: 'split-line',
            onSplit: (self) => {
              gsap.from(self.lines, {
                yPercent: 110,
                autoAlpha: 0,
                duration: 1.15,
                ease: 'expo.out',
                stagger: 0.14,
                scrollTrigger: {
                  trigger: title,
                  start: 'top 84%',
                  once: true,
                },
              })
            },
          })
        })

      const heroElement = rootRef.current?.querySelector<HTMLElement>('[data-motion="hero"]')
      const heroScrubLength = Number(heroElement?.dataset.framesLength) || 260
      const heroFrames = heroElement?.querySelector<HTMLElement>('.frame-sequence') ?? null
      const heroIdle = heroElement?.querySelector<HTMLVideoElement>('[data-hero-idle]') ?? null
      const heroOverlap = rootRef.current?.querySelector<HTMLElement>('[data-hero-overlap]')

      // Remonte la section gameplay derrière le hero épinglé, de la hauteur réelle
      // du hero (qui peut dépasser 100dvh sur petit viewport) : son pin démarre
      // pile à la fin du pin hero, le fondu final révèle la même plate — pas de
      // scroll mort ni d'image doublée. Resynchronisé à chaque refresh.
      const syncHeroOverlap = () => {
        if (heroOverlap && heroElement) {
          heroOverlap.style.marginTop = `-${heroElement.offsetHeight}px`
        }
      }

      syncHeroOverlap()
      ScrollTrigger.addEventListener('refreshInit', syncHeroOverlap)

      const heroSequence = { progress: 0 }
      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-motion="hero"]',
          start: 'top top',
          end: `+=${heroScrubLength}%`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          // Sur un scroll rapide, le lissage du scrub laisse le hero dépinné
          // encore visible (voile en retard) : on force le scrub à terminer
          // pile au moment du unpin — l'état final (noir) est déjà en place.
          onLeave: (self) => {
            self.getTween()?.progress(1)
          },
        },
      })

      heroTimeline
        .to(
          heroSequence,
          {
            progress: 1,
            duration: 1,
            ease: 'none',
            onUpdate: () => renderFrameSequence(heroFrames, heroSequence.progress),
          },
          0
        )
        .to(
          '[data-hero-idle]',
          {
            autoAlpha: 0,
            duration: 0.04,
            ease: 'none',
            onComplete: () => heroIdle?.pause(),
            onReverseComplete: () => {
              void heroIdle?.play()
            },
          },
          0.01
        )
        .to(
          '.hero-section__content',
          { autoAlpha: 0, y: -46, filter: 'blur(14px)', duration: 0.12, ease: 'power2.in' },
          0.02
        )
        .to('[data-hero-vignette]', { opacity: 0.45, duration: 0.1, ease: 'none' }, 0.08)
        // Dip-to-dark : le voile atteint le noir complet avant la fin du pin,
        // puis le hero fond derrière lui — la section 2, encore voilée de noir,
        // prend le relais sans couture perceptible.
        .to('[data-hero-veil]', { opacity: 1, duration: 0.18, ease: 'power1.in' }, 0.8)
        .to('[data-motion="hero"]', { autoAlpha: 0, duration: 0.02, ease: 'none' }, 0.98)

      // La section 2 démarre sous un voile noir plein : le dip du hero et cette
      // levée de voile s'enchaînent dans le même noir, la couture est invisible.
      gsap.set('[data-gameplay-veil]', { opacity: 1 })

      const gameplayTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-motion="gameplay"]',
          start: 'top top',
          end: '+=185%',
          pin: true,
          scrub: 0.85,
        },
      })

      gameplayTimeline
        .to('[data-gameplay-veil]', { opacity: 0, duration: 0.16, ease: 'power1.out' }, 0)
        .fromTo(
          '[data-motion="gameplay-card"]',
          { autoAlpha: 0, y: 42, rotate: -9, filter: 'blur(12px)' },
          {
            autoAlpha: 1,
            y: 0,
            rotate: (index) => [-4, -2, -5][index] ?? -4,
            filter: 'blur(0px)',
            stagger: 0.16,
            duration: 0.45,
            ease: 'power3.out',
          },
          0.14
        )
        .fromTo(
          '.gameplay-section__copy',
          { autoAlpha: 0, x: 36, filter: 'blur(12px)' },
          { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 0.42, ease: 'power3.out' },
          0.5
        )
        .fromTo(
          '[data-motion="stats"]',
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power3.out' },
          0.72
        )

      gsap.utils.toArray<HTMLElement>('[data-motion="bridge"]').forEach((bridge) => {
        const bridgeLength = Number(bridge.dataset.bridgeLength) || 145
        const isEmber = bridge.classList.contains('scene-bridge--ember')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bridge,
            start: 'top top',
            end: `+=${bridgeLength}%`,
            pin: true,
            scrub: 0.7,
          },
        })

        gsap.set(bridge.querySelector('[data-bridge-veil]'), { autoAlpha: 0 })
        gsap.set(bridge.querySelector('[data-bridge-smoke]'), { autoAlpha: 0, xPercent: -4 })
        gsap.set(bridge.querySelector('[data-bridge-glow]'), {
          autoAlpha: 0,
          scale: isEmber ? 0.8 : 0.72,
        })
        gsap.set(bridge.querySelector('[data-bridge-next]'), { autoAlpha: 0, scale: 1.035 })

        tl.fromTo(
          bridge.querySelector('[data-bridge-veil]'),
          { autoAlpha: 0 },
          { autoAlpha: 0.94, duration: 0.3, ease: 'power2.out' },
          0.12
        )
          .fromTo(
            bridge.querySelector('[data-bridge-smoke]'),
            { autoAlpha: 0, xPercent: -4 },
            { autoAlpha: isEmber ? 0.72 : 0.58, xPercent: 3, duration: 0.5, ease: 'none' },
            0.18
          )
          .fromTo(
            bridge.querySelector('[data-bridge-glow]'),
            { autoAlpha: 0, scale: isEmber ? 0.8 : 0.72 },
            {
              autoAlpha: isEmber ? 0.78 : 0.9,
              scale: isEmber ? 1.14 : 1.18,
              duration: 0.34,
              ease: 'power2.out',
            },
            isEmber ? 0.36 : 0.22
          )
          .fromTo(
            bridge.querySelector('[data-bridge-next]'),
            { autoAlpha: 0, scale: 1.035 },
            { autoAlpha: 1, scale: 1, duration: 0.28, ease: 'none' },
            isEmber ? 0.52 : 0.46
          )
          .to(
            bridge.querySelector('[data-bridge-veil]'),
            { autoAlpha: 0.18, duration: 0.22, ease: 'power2.inOut' },
            isEmber ? 0.76 : 0.7
          )
          .to(
            bridge.querySelector('[data-bridge-glow]'),
            { autoAlpha: isEmber ? 0.22 : 0.18, scale: 1, duration: 0.18, ease: 'power2.inOut' },
            isEmber ? 0.88 : 0.86
          )
          .to(
            bridge.querySelector('[data-bridge-smoke]'),
            { autoAlpha: 0.2, duration: 0.24, ease: 'power2.inOut' },
            0.76
          )
          .to(
            bridge.querySelector('.frame-sequence'),
            { autoAlpha: 0, duration: 0.28, ease: 'none' },
            0.22
          )
      })

      // Hover magnétique des CTA : le bouton suit légèrement le curseur puis
      // revient élastiquement. Uniquement sur pointeur fin (souris) et hors
      // reduced-motion — pas de piège tactile. gsap.quickTo = writes throttlés
      // au ticker, pas de useState (règle : jamais de valeur continue en state).
      // La classe is-magnetic neutralise la transition CSS transform (sinon 700ms
      // de retard écraseraient le suivi). Chaque handler est nettoyé au revert du
      // scope (gsap.context capture les addEventListener ? non — on stocke les
      // cleanups et on les rejoue dans le return).
      const magneticCleanups: (() => void)[] = []
      const canMagnetize =
        !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches

      if (canMagnetize) {
        gsap.utils
          .toArray<HTMLAnchorElement>(
            '[data-motion="hero-actions"] .button--primary, [data-magnetic]'
          )
          .forEach((cta) => {
            cta.classList.add('is-magnetic')
            const xTo = gsap.quickTo(cta, 'x', { duration: 0.5, ease: 'power3.out' })
            const yTo = gsap.quickTo(cta, 'y', { duration: 0.5, ease: 'power3.out' })

            const onMove = (event: PointerEvent) => {
              const rect = cta.getBoundingClientRect()
              const relX = event.clientX - (rect.left + rect.width / 2)
              const relY = event.clientY - (rect.top + rect.height / 2)
              // Amplitude bornée : ~0.3 du déport, lift léger vers le haut.
              xTo(relX * 0.3)
              yTo(relY * 0.3 - 3)
            }
            const onLeave = () => {
              xTo(0)
              yTo(0)
            }

            cta.addEventListener('pointermove', onMove)
            cta.addEventListener('pointerleave', onLeave)
            magneticCleanups.push(() => {
              cta.removeEventListener('pointermove', onMove)
              cta.removeEventListener('pointerleave', onLeave)
              cta.classList.remove('is-magnetic')
              gsap.set(cta, { x: 0, y: 0 })
            })
          })
      }

      // Micro-parallax des plates non pinnées (auberge) : la plate de fond se
      // dézoome doucement (1.06 → 1) et remonte de quelques % pendant que la
      // section traverse le viewport. Transform-only (scale + yPercent) → pas de
      // reflow, composité GPU. Scrub non pinné : ne perturbe pas les pins voisins.
      // Hors reduced-motion (transform figé). Self-healing au refresh.
      if (!reduceMotion) {
        gsap.utils
          .toArray<HTMLElement>('.auberge-plate .media-layer__fallback')
          .forEach((plate) => {
            gsap.fromTo(
              plate,
              { scale: 1.06, yPercent: -3 },
              {
                scale: 1,
                yPercent: 3,
                ease: 'none',
                scrollTrigger: {
                  trigger: plate.closest('[data-motion="auberge"]'),
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.6,
                },
              }
            )
          })
      }

      // L'indicateur de scroll du hero disparaît dès qu'on quitte le tout début
      // (le CSS gère le fondu via [data-hidden]). ScrollTrigger viewport-based
      // sans élément trigger → n'affecte pas les pins. once:true : ne revient pas.
      const scrollHint = rootRef.current?.querySelector<HTMLElement>('[data-hero-scroll-hint]')
      if (scrollHint) {
        ScrollTrigger.create({
          start: 80,
          end: 'max',
          once: true,
          onEnter: () => {
            scrollHint.dataset.hidden = 'true'
          },
        })
      }

      // SectionProgress est un enfant : son useGSAP crée ses triggers AVANT
      // que les pins ci-dessus n'existent, donc ses positions `top center` sont
      // mesurées sur un document sans pin-spacers. De plus les frames webp et les
      // fonts arrivent après le premier layout et changent la hauteur du document.
      // On force un refresh après le premier paint puis à chaque source de reflow
      // pour resynchroniser tous les triggers (parents + enfants) sur la vraie
      // longueur de scroll.
      const refresh = () => ScrollTrigger.refresh()
      // Double rAF : le premier laisse React commit le layout des pins, le second
      // s'exécute une fois les pin-spacers réellement insérés dans le flux — c'est
      // seulement là que les positions `top center` des markers enfants sont
      // justes. fonts.ready + load couvrent les reflows tardifs (fonts, frames).
      let innerRaf = 0
      const outerRaf = requestAnimationFrame(() => {
        innerRaf = requestAnimationFrame(refresh)
      })
      void document.fonts?.ready.then(refresh)
      window.addEventListener('load', refresh)

      return () => {
        cancelAnimationFrame(outerRaf)
        cancelAnimationFrame(innerRaf)
        window.removeEventListener('load', refresh)
        ScrollTrigger.removeEventListener('refreshInit', syncHeroOverlap)
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
        magneticCleanups.forEach((cleanup) => cleanup())
      }
    },
    { scope: rootRef }
  )

  // Entrée du hero + chrome + CTA, jouée quand le voile de preload s'est levé.
  // Séparée du useGSAP principal pour se rejouer sur le flanc montant de
  // preloaderDone. Chorégraphie en cascade (eyebrow → titre par lignes → body →
  // CTA), même vocabulaire que la section 2 (fondu autoAlpha + blur + expo.out).
  useGSAP(
    () => {
      if (!preloaderDone) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const hero = rootRef.current?.querySelector<HTMLElement>('[data-motion="hero"]')
      const heroReveals = hero
        ? gsap.utils.toArray<HTMLElement>(hero.querySelectorAll('[data-motion="reveal"]'))
        : []
      const heroTitleLines = hero
        ? gsap.utils.toArray<HTMLElement>(hero.querySelectorAll('[data-motion="title"] span'))
        : []

      if (reduceMotion) {
        gsap.set(
          '[data-motion="chrome"], [data-motion="hero-actions"], [data-motion="hero"] [data-motion="reveal"], [data-motion="hero"] [data-motion="title"] span',
          { autoAlpha: 1, y: 0, filter: 'none' }
        )
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      // Le titre monte ligne par ligne, net→flou inversé — pièce maîtresse.
      tl.to(
        heroTitleLines,
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.3, stagger: 0.14 },
        0
      )
        // L'eyebrow et le body (data-motion="reveal") suivent, décalés.
        .to(
          heroReveals,
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.15, stagger: 0.12 },
          0.15
        )
        // Le chrome descend en même temps que le titre s'installe.
        .to('[data-motion="chrome"]', { autoAlpha: 1, y: 0, duration: 1.25 }, 0.1)
        // Les CTA ferment la marche.
        .to(
          '[data-motion="hero-actions"]',
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1 },
          0.55
        )
        // L'indicateur de scroll apparaît en dernier, une fois le hero installé.
        .to('[data-hero-scroll-hint]', { opacity: 1, duration: 0.9 }, 0.9)
    },
    { scope: rootRef, dependencies: [preloaderDone] }
  )

  return (
    <div ref={rootRef} className="landing-experience">
      <LandingPreloader onDone={handlePreloaderDone} />
      <AmbientEmbers />
      <CustomCursor />
      <LandingChrome />
      <SectionProgress
        sectionCount={3}
        sectionSelector='[data-motion="hero"], [data-motion="gameplay"], [data-motion="auberge"]'
      />
      <SectionHero />
      <div id="memoire" aria-hidden="true" data-hero-overlap />
      <Section2GameplayProof />
      {/* <SceneBridge
        bridgeLength={115}
        fallbackSrc={LANDING_MEDIA.quillFallback}
        frameCount={LANDING_MEDIA.quillFrameCount}
        frameDir={LANDING_MEDIA.quillFrames}
        id="regles"
        label="Transition carte vers auberge"
        nextBackgroundSrc={LANDING_MEDIA.aubergePlate}
        nextBackgroundSrcWebp={LANDING_MEDIA.aubergePlateWebp}
        tone="ember"
      /> */}
      <SectionAubergeCta />
    </div>
  )
}
