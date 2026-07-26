'use client'

import { useRouter } from 'next/navigation'
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
import { getAuthHref } from '@/lib/internal-navigation'
import { ensureAnonymousSession } from '@/lib/supabase/ensure-session'

import { VocationEmblem } from '../../../_components/VocationEmblem/VocationEmblem'
import { VELKHAR_WORLD } from '../../../_config/velkhar-world'
import {
  CHARACTER_RESULT_STORAGE_KEY,
  parseStoredCharacterResult,
  type CharacterCreateDraft,
} from '../../character-create/_lib/character-create-model'
import { getAveugleHub, getSouvenirs } from '../_lib/aveugle-api'
import { resolveAveugleHubSnapshot, type AveugleHubStage } from '../_lib/aveugle-hub-model'

import { AubergeDock, type AubergePanel } from './AubergeDock'
import { AubergeIntro, hasSeenAubergeIntro } from './AubergeIntro'
import { AveugleThreshold } from './AveugleThreshold'
import { VelkharMotionShell } from './velkhar-motion-shell'

import './aveugle-hub.css'

import type { AveugleHubState, Souvenir } from '@grimoire/shared'

interface AveugleHubProps {
  campaignId?: string
  isRunReturn?: boolean
  previewIntro?: boolean
  transitionFromHome?: boolean
}

export const AUBERGE_HUB_UNLOCK_STORAGE_KEY = 'grimoire:velkhar:auberge-unlocked'

function readActiveSessionCookie(): boolean {
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${ACTIVE_GAME_SESSION_COOKIE}=`))
  return hasActiveGameSession(cookie?.split('=')[1])
}

function readCharacter(): CharacterCreateDraft | null {
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

  return null
}

function getFirstRunHref(campaignId?: string): string {
  const path = `${VELKHAR_WORLD.routes.session}/new`
  return campaignId ? `${path}?campaign=${encodeURIComponent(campaignId)}` : path
}

export function AveugleHub({
  campaignId,
  isRunReturn = false,
  previewIntro = false,
  transitionFromHome = false,
}: AveugleHubProps) {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations('Auberge')
  const sessionT = useTranslations('Session')
  const [hydrated, setHydrated] = useState(false)
  const [character, setCharacter] = useState<CharacterCreateDraft | null>(null)
  const [hasActiveSessionState, setHasActiveSessionState] = useState(false)
  const [hubUnlocked, setHubUnlocked] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [activePanel, setActivePanel] = useState<AubergePanel>('dialogue')
  const [hubState, setHubState] = useState<AveugleHubState | null>(null)
  const [spendableSouvenirs, setSpendableSouvenirs] = useState<Souvenir[]>([])
  const [hubError, setHubError] = useState(false)
  const [hubLoading, setHubLoading] = useState(false)
  const ambienceRef = useRef<HTMLDivElement>(null)
  const fireGlowRef = useRef<HTMLDivElement>(null)
  const departureRef = useRef<HTMLDivElement>(null)
  const stageCopy: Record<AveugleHubStage, string> = {
    'character-create': t('stageCharacterCreate'),
    ready: t('stageReady'),
    'active-session': t('stageActiveSession'),
    'run-return': t('stageRunReturn'),
  }

  useEffect(() => {
    const nextCharacter = readCharacter()
    const nextHasActiveSession = readActiveSessionCookie()
    const nextHubUnlocked = Boolean(
      nextCharacter &&
      (isRunReturn ||
        nextHasActiveSession ||
        window.localStorage.getItem(AUBERGE_HUB_UNLOCK_STORAGE_KEY) === 'true')
    )

    if (nextHubUnlocked) {
      window.localStorage.setItem(AUBERGE_HUB_UNLOCK_STORAGE_KEY, 'true')
    }

    setCharacter(nextCharacter)
    setHasActiveSessionState(nextHasActiveSession)
    setHubUnlocked(nextHubUnlocked)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setShowIntro(previewIntro || (!reduceMotion && !hasSeenAubergeIntro()))
    setHydrated(true)
  }, [isRunReturn, previewIntro])

  const loadHub = useCallback(async () => {
    setHubLoading(true)
    setHubError(false)

    try {
      await ensureAnonymousSession()
      const nextHubState = await getAveugleHub()
      const souvenirs = nextHubState.spendableSouvenirCount > 0 ? await getSouvenirs() : []
      setHubState(nextHubState)
      setSpendableSouvenirs(
        souvenirs.filter((souvenir) => souvenir.anonymous && !souvenir.sharedWithAveugle)
      )
    } catch {
      setHubError(true)
    } finally {
      setHubLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!hydrated || !character || !hubUnlocked) return
    void loadHub()
  }, [character, hubUnlocked, hydrated, loadHub])

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

  useEffect(() => {
    if (!hydrated || !character || hubUnlocked) return
    router.replace(getFirstRunHref(campaignId))
  }, [campaignId, character, hubUnlocked, hydrated, router])

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
        const targetOpacity = activePanel === 'memories' ? 0.5 : 0.64
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
      dependencies: [activePanel, hydrated, snapshot.character],
      revertOnUpdate: true,
    }
  )

  const handleTopicSeen = useCallback((topicId: string) => {
    setHubState((current) =>
      current && !current.seenTopicIds.includes(topicId)
        ? { ...current, seenTopicIds: [...current.seenTopicIds, topicId] }
        : current
    )
  }, [])

  const handleSouvenirSpent = useCallback((spentSouvenir: Souvenir) => {
    setSpendableSouvenirs((current) =>
      current.filter((souvenir) => souvenir.id !== spentSouvenir.id)
    )
    setHubState((current) =>
      current
        ? {
            ...current,
            spendableSouvenirCount: Math.max(0, current.spendableSouvenirCount - 1),
          }
        : current
    )
  }, [])

  const resources = hubState
    ? [
        { icon: 'coin' as const, label: t('ironResource'), value: hubState.iron },
        {
          icon: 'memory' as const,
          label: t('memoriesResource'),
          value: hubState.spendableSouvenirCount,
        },
      ]
    : []

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

  if (!hydrated || (snapshot.character && (!hubUnlocked || (hubLoading && !hubState)))) {
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
        <AveugleThreshold campaignId={campaignId} transitionFromHome={transitionFromHome} />
      </>
    )
  }

  if (hubError || !hubState) {
    const showAccountPrompt = isRunReturn || transitionFromHome
    const accountReturnPath = isRunReturn
      ? '/velkhar/aveugle?return=run'
      : '/velkhar/aveugle?transition=home'

    return (
      <main className="aveugle-hub aveugle-hub--loading aveugle-hub--error">
        <div className="aveugle-hub__scene" aria-hidden="true" />
        <section className="aveugle-hub__load-error" role="alert">
          <GameIcon decorative name={showAccountPrompt ? 'lock' : 'warning'} size={48} />
          <h1>{showAccountPrompt ? sessionT('chronicleWaiting') : t('hubErrorTitle')}</h1>
          <p>{showAccountPrompt ? sessionT('limitBody') : t('hubErrorBody')}</p>
          {showAccountPrompt ? (
            <GameLink href={getAuthHref('/signup', accountReturnPath)} variant="radiant">
              {sessionT('createAccount')}
            </GameLink>
          ) : (
            <GameButton loading={hubLoading} onClick={() => void loadHub()} variant="radiant">
              {t('retry')}
            </GameButton>
          )}
        </section>
      </main>
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
            <GameLink
              href={snapshot.primaryHref}
              trailingIcon={<GameIcon decorative name="arrow" size={24} />}
              variant="radiant"
            >
              {snapshot.primaryLabel}
            </GameLink>
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
              hubState={hubState}
              onActivePanelChange={setActivePanel}
              onSouvenirSpent={handleSouvenirSpent}
              onTopicSeen={handleTopicSeen}
              openingLine={openingLine}
              spendableSouvenirs={spendableSouvenirs}
            />
          </div>
        }
        top={topBar}
        variant="sidebar"
      />
    </VelkharMotionShell>
  )
}
