'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { GameLink } from '@/components/ui/game-link'
import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GameSceneLayout } from '@/components/ui/grimoire/GameSceneLayout/GameSceneLayout'
import { LocationIdentity } from '@/components/ui/grimoire/LocationIdentity/LocationIdentity'
import { PlayerIdentity } from '@/components/ui/grimoire/PlayerIdentity/PlayerIdentity'
import { ResourceCounter } from '@/components/ui/grimoire/ResourceCounter/ResourceCounter'
import { ACTIVE_GAME_SESSION_COOKIE, hasActiveGameSession } from '@/lib/active-game-session'
import { gsap, useGSAP } from '@/lib/gsap-init'

import { VocationEmblem } from '../../../_components/VocationEmblem/VocationEmblem'
import {
  CHARACTER_RESULT_STORAGE_KEY,
  parseStoredCharacterResult,
  type CharacterCreateDraft,
} from '../../character-create/_lib/character-create-model'
import {
  AUBERGE_PREPARATION_STORAGE_KEY,
  EMPTY_AUBERGE_PREPARATION,
  parseAubergePreparation,
  withOmenQuery,
  type AubergePreparationState,
} from '../_lib/auberge-preparation'
import {
  getFallbackHubCharacter,
  resolveAveugleHubSnapshot,
  type AveugleHubStage,
} from '../_lib/aveugle-hub-model'

import { AubergeDock, type AubergePanel } from './AubergeDock'
import { AubergeIntro, hasSeenAubergeIntro } from './AubergeIntro'
import { AveugleThreshold } from './AveugleThreshold'
import { VelkharMotionShell } from './velkhar-motion-shell'

import './aveugle-hub.css'

interface AveugleHubProps {
  campaignId?: string
  characterReadyHint?: boolean
  isCharacterFlow?: boolean
  isRunReturn?: boolean
  previewIntro?: boolean
  transitionFromHome?: boolean
}

function readActiveSessionCookie(): boolean {
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${ACTIVE_GAME_SESSION_COOKIE}=`))
  return hasActiveGameSession(cookie?.split('=')[1])
}

function readCharacter(
  characterReadyHint: boolean,
  fallbackName: string
): CharacterCreateDraft | null {
  const persisted = parseStoredCharacterResult(
    window.localStorage.getItem(CHARACTER_RESULT_STORAGE_KEY)
  )
  if (persisted) return persisted

  const legacy = parseStoredCharacterResult(
    window.sessionStorage.getItem(CHARACTER_RESULT_STORAGE_KEY)
  )
  if (legacy) {
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(legacy))
    window.sessionStorage.removeItem(CHARACTER_RESULT_STORAGE_KEY)
    return legacy
  }

  return characterReadyHint ? getFallbackHubCharacter(fallbackName) : null
}

export function AveugleHub({
  campaignId,
  characterReadyHint = false,
  isCharacterFlow = false,
  isRunReturn = false,
  previewIntro = false,
  transitionFromHome = false,
}: AveugleHubProps) {
  const locale = useLocale()
  const t = useTranslations('Auberge')
  const [hydrated, setHydrated] = useState(false)
  const [character, setCharacter] = useState<CharacterCreateDraft | null>(null)
  const [hasActiveSessionState, setHasActiveSessionState] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [activePanel, setActivePanel] = useState<AubergePanel>('dialogue')
  const [preparation, setPreparation] = useState<AubergePreparationState>(EMPTY_AUBERGE_PREPARATION)
  const ambienceRef = useRef<HTMLDivElement>(null)
  const fireGlowRef = useRef<HTMLDivElement>(null)
  const departureRef = useRef<HTMLDivElement>(null)
  const stageCopy: Record<AveugleHubStage, string> = {
    'character-create': t('stageCharacterCreate'),
    ready: t('stageReady'),
    'active-session': t('stageActiveSession'),
    'run-return': t('stageRunReturn'),
  }
  const resources = [
    { icon: 'coin' as const, label: t('saltResource'), value: 125 },
    { icon: 'memory' as const, label: t('memoriesResource'), value: 0 },
    { icon: 'artifact' as const, label: t('artifactsResource'), value: 0 },
  ]

  useEffect(() => {
    const nextCharacter = readCharacter(characterReadyHint, t('traveler'))
    setCharacter(nextCharacter)
    setHasActiveSessionState(readActiveSessionCookie())
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setShowIntro(previewIntro || (!reduceMotion && !hasSeenAubergeIntro()))
    const storedPreparation = parseAubergePreparation(
      window.localStorage.getItem(AUBERGE_PREPARATION_STORAGE_KEY)
    )
    const nextPreparation = isRunReturn
      ? { ...storedPreparation, selectedOmenId: null }
      : storedPreparation
    setPreparation(nextPreparation)
    if (isRunReturn) {
      window.localStorage.setItem(AUBERGE_PREPARATION_STORAGE_KEY, JSON.stringify(nextPreparation))
    }
    setHydrated(true)
  }, [characterReadyHint, isRunReturn, previewIntro, t])

  const snapshot = useMemo(
    () =>
      resolveAveugleHubSnapshot({
        campaignId,
        character,
        hasActiveSession: hasActiveSessionState,
        isRunReturn,
        labels: {
          answerBlindOne: t('answerBlindOne'),
          freeConcept: t('freeConcept'),
          prepareDeparture: t('prepareDeparture'),
          resumeRoad: t('resumeRoad'),
          startRun: t('startRun'),
          unknownPeople: t('unknownPeople'),
        },
        locale,
      }),
    [campaignId, character, hasActiveSessionState, isRunReturn, locale, t]
  )
  const openingLine = stageCopy[snapshot.stage]
  const isActiveSession = snapshot.stage === 'active-session'
  const departureHref =
    preparation.selectedOmenId && !isActiveSession
      ? withOmenQuery(snapshot.primaryHref, preparation.selectedOmenId)
      : snapshot.primaryHref

  useGSAP(
    () => {
      const glow = fireGlowRef.current
      if (!glow || !hydrated || !snapshot.character) return undefined

      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          glow,
          { opacity: 0.34, scale: 0.98 },
          {
            duration: 2.8,
            ease: 'sine.inOut',
            opacity: 0.58,
            repeat: -1,
            scale: 1.03,
            yoyo: true,
          }
        )
      })

      return () => media.revert()
    },
    { dependencies: [hydrated, snapshot.character], revertOnUpdate: true }
  )

  useGSAP(
    () => {
      const ambience = ambienceRef.current
      const departure = departureRef.current
      if (!ambience || !departure || !hydrated || !snapshot.character) return undefined

      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const targetOpacity =
          activePanel === 'omen' ? 0.88 : activePanel === 'memories' ? 0.5 : 0.64
        const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } })
        timeline
          .to(ambience, { duration: 0.5, opacity: targetOpacity, overwrite: 'auto' }, 0)
          .fromTo(
            departure,
            { autoAlpha: 0, y: 8 },
            {
              autoAlpha: 1,
              clearProps: 'opacity,transform,visibility',
              duration: 0.36,
              y: 0,
            },
            0.12
          )
      })

      return () => media.revert()
    },
    {
      dependencies: [activePanel, preparation.selectedOmenId, hydrated, snapshot.character],
      revertOnUpdate: true,
    }
  )

  const handlePreparationChange = useCallback((nextPreparation: AubergePreparationState) => {
    setPreparation(nextPreparation)
    window.localStorage.setItem(AUBERGE_PREPARATION_STORAGE_KEY, JSON.stringify(nextPreparation))
  }, [])

  const topBar = snapshot.character ? (
    <div className="aveugle-hub__player-bar" data-velkhar-enter>
      <PlayerIdentity
        avatar={
          <VocationEmblem
            decorative
            name={
              snapshot.character.vocationId === 'shadow-blade'
                ? 'lame-ombre'
                : snapshot.character.vocationId === 'word-weaver'
                  ? 'tisse-verbe'
                  : snapshot.character.vocationId === 'watcher'
                    ? 'veilleur'
                    : 'marcheur-du-sel'
            }
            size="sm"
          />
        }
        label={t('characterIdentity', { name: snapshot.character.name })}
        name={snapshot.character.name}
        resources={resources.map((resource) => (
          <ResourceCounter
            key={resource.label}
            compact
            icon={<GameIcon decorative name={resource.icon} size={24} />}
            label={resource.label}
            value={resource.value}
          />
        ))}
        subtitle={`${snapshot.character.people}, ${snapshot.character.vocation}`}
      />
    </div>
  ) : null

  if (!hydrated) {
    return (
      <main className="aveugle-hub aveugle-hub--loading" aria-busy="true">
        <div className="aveugle-hub__scene" aria-hidden="true" />
        <div className="aveugle-hub__skeleton aveugle-hub__skeleton--scene" />
        <div className="aveugle-hub__skeleton aveugle-hub__skeleton--panel" />
      </main>
    )
  }

  if (!snapshot.character) {
    return (
      <>
        {showIntro ? (
          <AubergeIntro onComplete={() => setShowIntro(false)} preview={previewIntro} />
        ) : null}
        <AveugleThreshold
          campaignId={campaignId}
          isCharacterFlow={isCharacterFlow}
          transitionFromHome={transitionFromHome}
        />
      </>
    )
  }

  return (
    <VelkharMotionShell animateEntrance={transitionFromHome} className="aveugle-hub">
      {showIntro ? (
        <AubergeIntro onComplete={() => setShowIntro(false)} preview={previewIntro} />
      ) : null}
      <GameSceneLayout
        background={
          <>
            <div className="aveugle-hub__scene" data-velkhar-scene />
            <div
              ref={ambienceRef}
              className={`aveugle-hub__ambience aveugle-hub__ambience--${activePanel}`}
            />
            <div ref={fireGlowRef} className="aveugle-hub__fire-glow" />
          </>
        }
        bottom={
          <div ref={departureRef} className="aveugle-hub__departure" data-velkhar-enter>
            {isActiveSession || preparation.selectedOmenId ? (
              <GameLink
                href={departureHref}
                trailingIcon={<GameIcon decorative name="arrow" size={24} />}
                variant="radiant"
              >
                {snapshot.primaryLabel}
              </GameLink>
            ) : (
              <GameButton
                onClick={() => setActivePanel('omen')}
                trailingIcon={<GameIcon decorative name="moon" size={24} />}
                variant="radiant"
              >
                {t('chooseOmen')}
              </GameButton>
            )}
          </div>
        }
        className="aveugle-hub__layout"
        main={
          <div className="aveugle-hub__stage" data-velkhar-enter>
            <LocationIdentity
              icon={<GameIcon decorative name="fire" size={32} />}
              place={t('innName')}
              world="Velkhar"
            />
            <div className="aveugle-hub__scene-caption">
              <p>{t('sceneCaption')}</p>
            </div>
          </div>
        }
        sidebar={
          <div className="aveugle-hub__sidebar" data-velkhar-frame>
            <AubergeDock
              activePanel={activePanel}
              isActiveSession={isActiveSession}
              onActivePanelChange={setActivePanel}
              onPreparationChange={handlePreparationChange}
              openingLine={openingLine}
              preparation={preparation}
            />
          </div>
        }
        top={topBar}
        variant="sidebar"
      />
    </VelkharMotionShell>
  )
}
