'use client'

import { useCallback, useRef, useState } from 'react'

import { AmbientEmbers, CustomCursor, ScrollProgressBar, SectionProgress } from '@/components/ui'
import { useLenis } from '@/hooks/use-lenis'
import { ScrollTrigger, SplitText, gsap, useGSAP } from '@/lib/gsap-init'

import { renderFrameSequence } from '../FrameSequenceCanvas/FrameSequenceCanvas'
import { LandingChrome } from '../LandingChrome/LandingChrome'
import { LandingPreloader } from '../LandingPreloader/LandingPreloader'
import { SectionGameplay } from '../SectionGameplay/SectionGameplay'
import { SectionHero } from '../SectionHero/SectionHero'
import { SectionOutro } from '../SectionOutro/SectionOutro'
import { SectionWorld } from '../SectionWorld/SectionWorld'

import { useLandingHeroEntrance } from './use-landing-hero-entrance'

// Un dip cinématique doit assombrir la plate, jamais effacer tout le viewport.
// Garder une fraction de l'image visible évite aussi l'impression de frame morte
// lorsque le scrub lissé termine sa course après le changement de section.
const TRANSITION_VEIL_OPACITY = 0.82

export function LandingExperience() {
  const rootRef = useRef<HTMLDivElement>(null)
  // L'entrée du chrome et des CTA attend la levée du voile de preload.
  const [preloaderDone, setPreloaderDone] = useState(false)
  const handlePreloaderDone = useCallback(() => setPreloaderDone(true), [])

  useLenis()
  useLandingHeroEntrance(rootRef, preloaderDone)

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const chrome = rootRef.current?.querySelector<HTMLElement>('[data-motion="chrome"]')

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
      gsap.set('[data-motion="reveal"]', { autoAlpha: 0, y: 26 })
      gsap.set('[data-motion="hero-actions"]', { autoAlpha: 0, y: 18 })
      // Le hero garde sa cascade span (jouée à la levée du voile, hors reduced-motion).
      // Les titres non-hero sont animés par SplitText plus bas — on ne les fige pas ici
      // pour ne pas masquer un état pré-split (FOUC) : SplitText pose son propre état.
      const heroTitle = rootRef.current?.querySelector<HTMLElement>(
        '[data-motion="hero"] [data-motion="title"]'
      )
      if (heroTitle) {
        gsap.set(heroTitle, { autoAlpha: 1, y: 0 })
        gsap.set(heroTitle.querySelectorAll('span'), { autoAlpha: 0, y: 34 })
      }

      if (reduceMotion) {
        gsap.set(
          '[data-motion="chrome"], [data-motion="reveal"], [data-motion="hero-actions"], [data-motion="title"] span, [data-motion="title"]',
          {
            autoAlpha: 1,
            y: 0,
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
      // Les sections world/outro RE-animent leurs propres reveals via leur timeline
      // scrubbée (blur + translation) : les laisser au reveal global créerait deux
      // tweens concurrents sur les mêmes nœuds → fade tantôt net, tantôt flou. On les
      // exclut donc du global. Gameplay reste inclus : sa timeline anime le conteneur
      // `.gameplay-section__copy`, pas les reveals internes (label/body/cta).
      const inPinnedSection = (element: HTMLElement) =>
        Boolean(
          element.closest('[data-motion="hero"], [data-motion="world"], [data-motion="outro"]')
        )

      gsap.utils
        .toArray<HTMLElement>('[data-motion="reveal"]')
        .filter((element) => !inPinnedSection(element))
        .forEach((element) => {
          gsap.to(element, {
            autoAlpha: 1,
            y: 0,
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
      //
      // Cas outro : le titre vit sous un voile noir plein pendant la première moitié
      // du pin outro. Un ScrollTrigger classique (trigger = titre, `start:'top 84%'`)
      // révèle les lignes DERRIÈRE ce voile (once:true les consomme) → le titre « pop »
      // figé à la levée du voile, sans animation visible. On l'exclut donc du reveal
      // auto : ses lignes sont pré-masquées et exposées pour que la timeline outro
      // (scrubbée, en phase avec la levée du voile) les anime elle-même. `autoSplit`
      // désactivé pour ce titre : un re-split créerait des lignes orphelines que le
      // tween de la timeline ne référencerait plus (le split reste figé au resize).
      let outroTitleLines: Element[] = []
      gsap.utils
        .toArray<HTMLElement>('[data-motion="title"]')
        .filter((title) => !inHero(title))
        .forEach((title) => {
          const isOutroTitle = Boolean(title.closest('[data-motion="outro"]'))
          SplitText.create(title, {
            type: 'lines',
            mask: 'lines',
            autoSplit: !isOutroTitle,
            linesClass: 'split-line',
            onSplit: (self) => {
              if (isOutroTitle) {
                gsap.set(self.lines, { yPercent: 110, autoAlpha: 0 })
                outroTitleLines = self.lines
                return
              }
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
      const heroScrubLength = Number(heroElement?.dataset.framesLength) || 140
      const heroFrames = heroElement?.querySelector<HTMLElement>('.frame-sequence') ?? null
      const heroIdle = heroElement?.querySelector<HTMLVideoElement>('[data-hero-idle]') ?? null
      const heroOverlap = rootRef.current?.querySelector<HTMLElement>('[data-hero-overlap]')

      // Séparation grand desktop / flux responsive : le pin + scrub long est une
      // grammaire de grand viewport. Sur tablette et mobile on ne
      // « scroll-jacke » pas — le doigt défile naturellement, chaque section se
      // révèle par un fondu court à l'entrée du viewport, et la hauteur du
      // document tombe à celle du contenu réel (pas ~660vh de scroll de pins).
      // matchMedia gère le cleanup automatique au franchissement du breakpoint.
      const mm = gsap.matchMedia()
      // Le layout Gameplay passe en colonne à 1100 px. Le conserver épinglé dans
      // cet état produisait une section plus haute que le viewport, donc du contenu
      // inaccessible et un écran presque vide au début du pin sur tablette.
      const DESKTOP_QUERY = '(min-width: 1101px)'
      const FLOW_QUERY = '(max-width: 1100px)'

      mm.add(DESKTOP_QUERY, () => {
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
            scrub: 0.35,
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
            { autoAlpha: 0, y: -46, duration: 0.12, ease: 'power2.in' },
            0.02
          )
          .to('[data-hero-vignette]', { opacity: 0.45, duration: 0.1, ease: 'none' }, 0.08)
          // Dip-to-dark : la plate reste légèrement perceptible. Un noir complet
          // produirait une frame morte pendant que le scrub rattrape le scroll.
          .to(
            '[data-hero-veil]',
            { opacity: TRANSITION_VEIL_OPACITY, duration: 0.14, ease: 'power1.in' },
            0.84
          )
          .to('[data-motion="hero"]', { autoAlpha: 0, duration: 0.02, ease: 'none' }, 0.98)

        // Même niveau d'ombre des deux côtés de la couture, sans écran vide.
        gsap.set('[data-gameplay-veil]', { opacity: TRANSITION_VEIL_OPACITY })

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
            { autoAlpha: 0, y: 42, rotate: -9 },
            {
              autoAlpha: 1,
              y: 0,
              rotate: (index) => [-4, -2, -5][index] ?? -4,
              stagger: 0.16,
              duration: 0.45,
              ease: 'power3.out',
            },
            0.14
          )
          .fromTo(
            '.gameplay-section__copy',
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power3.out' },
            0.5
          )
          .fromTo(
            '[data-motion="stats"]',
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power3.out' },
            0.72
          )

        // Section 3 (world) : même grammaire que la gameplay. Démarre sous un
        // voile sombre (couture invisible avec la gameplay pinnée au-dessus),
        // lève le voile puis révèle eyebrow → titre → lore → piliers en cascade.
        // Le titre profite déjà du SplitText global via data-motion="title".
        gsap.set('[data-world-veil]', { opacity: TRANSITION_VEIL_OPACITY })

        const worldTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '[data-motion="world"]',
            start: 'top top',
            end: '+=185%',
            pin: true,
            scrub: 0.85,
          },
        })

        worldTimeline
          .to('[data-world-veil]', { opacity: 0, duration: 0.16, ease: 'power1.out' }, 0)
          .fromTo(
            '[data-motion="world"] [data-motion="reveal"]',
            { autoAlpha: 0, y: 26 },
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.14,
              duration: 0.42,
              ease: 'power3.out',
            },
            0.14
          )
          // Sortie dip-to-dark : assez dense pour ponctuer la transition, mais la
          // cité reste visible jusqu'à ce que l'auberge prenne réellement le relais.
          .to(
            '[data-world-veil]',
            { opacity: TRANSITION_VEIL_OPACITY, duration: 0.16, ease: 'power1.in' },
            0.82
          )

        // Section 4 (outro) : entrée depuis le noir, symétrique de la sortie world.
        // Elle se pin le temps de lever son voile puis de révéler le logo, la
        // citation, le titre et le CTA en cascade. La plate d'auberge se dévoile
        // derrière le voile qui s'efface — l'atterrissage final de la landing.
        gsap.set('[data-outro-veil]', { opacity: TRANSITION_VEIL_OPACITY })

        const outroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: '[data-motion="outro"]',
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 0.85,
          },
        })

        // Le voile se lève, PUIS le titre monte ligne par ligne (lignes pré-masquées
        // plus haut), PUIS les reveal (logo, citation, corps, CTA, footer) suivent en
        // cascade. Tout est scrubbé : le titre n'anime jamais derrière le noir, et son
        // état final (yPercent:0) reste stable en fin de pin — pas de disparition.
        outroTimeline
          .to('[data-outro-veil]', { opacity: 0, duration: 0.2, ease: 'power1.out' }, 0)
          .to(
            outroTitleLines,
            {
              yPercent: 0,
              autoAlpha: 1,
              stagger: 0.14,
              duration: 0.5,
              ease: 'power3.out',
            },
            0.18
          )
          .fromTo(
            '[data-motion="outro"] [data-motion="reveal"]',
            { autoAlpha: 0, y: 26 },
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.12,
              duration: 0.5,
              ease: 'power3.out',
            },
            0.16
          )

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

        // Micro-parallax des plates de fond (château + outro) : la plate se
        // dézoome doucement (1.06 → 1) et remonte de quelques % pendant que la
        // section traverse le viewport. Transform-only (scale + yPercent) → pas de
        // reflow, composité GPU. Scrub borné au parcours de la section
        // (`[data-motion]` parent) : ne perturbe pas les pins voisins — même pour la
        // section world pinnée, le trigger reste la section, pas le pin-spacer.
        // Hors reduced-motion (transform figé). Self-healing au refresh.
        if (!reduceMotion) {
          gsap.utils
            .toArray<HTMLElement>(
              '.world-plate .media-layer__fallback, .outro-plate .media-layer__fallback'
            )
            .forEach((plate) => {
              gsap.fromTo(
                plate,
                { scale: 1.06, yPercent: -3 },
                {
                  scale: 1,
                  yPercent: 3,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: plate.closest('[data-motion]'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.6,
                  },
                }
              )
            })
        }

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', syncHeroOverlap)
          magneticCleanups.forEach((cleanup) => cleanup())
        }
      })

      // Branche tablette/mobile : aucun pin, aucun scrub, aucun voile. Les 4 sections
      // coulent en flux naturel (hauteur = contenu réel), et chaque groupe se
      // révèle par un fondu court à l'entrée du viewport. Le hero reste une plate
      // fixe animée à l'entrée (la vidéo idle boucle) — pas de scrub des 96 frames
      // (desktop-only : coûteux en data et saccadé sans pin). Les voiles noirs
      // dip-to-dark n'ont plus de support (ils dépendaient du scrub synchronisé)
      // → posés à 0 pour révéler chaque plate directement.
      mm.add(FLOW_QUERY, () => {
        // Voiles dip-to-dark neutralisés en flux responsive (plus de pin qui les lève).
        // L'assombrissement permanent de la plate gameplay (grimoire trop clair
        // derrière le copy) est géré par un renfort de `.media-vignette` en CSS
        // sous 720px — sous le texte —, pas par ce voile.
        gsap.set('[data-hero-veil], [data-gameplay-veil], [data-world-veil], [data-outro-veil]', {
          opacity: 0,
        })

        if (reduceMotion) {
          // Reduced-motion : tout est déjà exposé par le set global plus haut ;
          // on expose en plus les nœuds animés uniquement par les timelines de pin.
          gsap.set(
            '[data-motion="gameplay-card"], .gameplay-section__copy, [data-motion="stats"]',
            { autoAlpha: 1, y: 0, rotate: 0 }
          )
          gsap.set(outroTitleLines, { yPercent: 0, autoAlpha: 1 })
          return
        }

        // Cartes gameplay : montée + fondu en cascade à l'entrée de la section.
        // `fromTo` (pas `from`) car `.card` a `opacity:0` en CSS de base — un `from`
        // animerait de 0 vers la valeur courante (0) et laisserait la carte cachée.
        gsap.fromTo(
          '[data-motion="gameplay-card"]',
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: '[data-motion="gameplay"]', start: 'top 78%', once: true },
          }
        )

        // Copy + stats gameplay (le conteneur `.gameplay-section__copy` et les
        // stats sont animés par la timeline pinnée sur desktop, pas par le reveal
        // global — on les rejoue ici en fondu court). `fromTo` : leur état de base
        // est caché (autoAlpha:0 posé par le set global / la timeline desktop).
        gsap.fromTo(
          ['.gameplay-section__copy', '[data-motion="stats"]'],
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.gameplay-section__copy', start: 'top 82%', once: true },
          }
        )

        // Reveals world (eyebrow, titre, lore, piliers) : exclus du reveal global
        // (ils vivaient dans la timeline scrubbée) → fondu court au scroll ici.
        gsap.fromTo(
          '[data-motion="world"] [data-motion="reveal"]',
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: '[data-motion="world"]', start: 'top 78%', once: true },
          }
        )

        // Reveals outro (logo, citation, corps, CTA, footer) : même traitement.
        gsap.fromTo(
          '[data-motion="outro"] [data-motion="reveal"]',
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: '[data-motion="outro"]', start: 'top 80%', once: true },
          }
        )

        // Titre outro : ses lignes sont pré-masquées (yPercent:110) par le SplitText
        // plus haut. Sans voile noir en flux responsive, plus de risque de « pop derrière le
        // noir » → un trigger classique suffit à les faire monter au scroll.
        gsap.to(outroTitleLines, {
          yPercent: 0,
          autoAlpha: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-motion="outro"]', start: 'top 72%', once: true },
        })
      })

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
      let isMounted = true
      const refresh = () => {
        if (isMounted) ScrollTrigger.refresh()
      }
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
        isMounted = false
        cancelAnimationFrame(outerRaf)
        cancelAnimationFrame(innerRaf)
        window.removeEventListener('load', refresh)
        // mm.revert() rejoue les cleanups de chaque branche (desktop : listener
        // refreshInit + magnétique ; flux responsive : ses ScrollTriggers) et restaure les
        // props inline posées par les branches. Le contexte useGSAP nettoie ses
        // propres animations et triggers sans toucher à ceux des composants enfants.
        mm.revert()
      }
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className="landing-experience">
      <LandingPreloader onDone={handlePreloaderDone} />
      <AmbientEmbers />
      <CustomCursor />
      <LandingChrome />
      <ScrollProgressBar />
      <SectionProgress
        sectionCount={4}
        sectionSelector='[data-motion="hero"], [data-motion="gameplay"], [data-motion="world"], [data-motion="outro"]'
      />
      <SectionHero />
      <div id="memoire" aria-hidden="true" data-hero-overlap />
      <SectionGameplay />
      <SectionWorld />
      <SectionOutro />
    </div>
  )
}
