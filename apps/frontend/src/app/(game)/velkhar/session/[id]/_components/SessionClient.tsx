'use client'

import {
  getPeople,
  getVocation,
  type Character,
  type Choice,
  type DiceRoll as DiceRollResult,
  type GameNotification,
  type InventoryItemRef,
  type Locale,
  type SceneResponse,
  type SurvivalStats,
} from '@grimoire/shared'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'

import {
  GameAvatar,
  GameIcon,
  GameSceneLayout,
  GameTopBar,
  LocationIdentity,
  NarrativeComposer,
  PlayerIdentity,
} from '@/components/ui/grimoire'
import { SoftSignupPrompt } from '@/components/ui/soft-signup-prompt'
import { forgetActiveGameSession, rememberActiveGameSession } from '@/lib/active-game-session'
import { createClient } from '@/lib/supabase/client'
import { useSessionStore } from '@/stores/session-store'

import { createSession, postGameAction } from '../_lib/api'

import { ChoiceList } from './ChoiceList'
import { DiceRoll } from './DiceRoll'
import { NarrativePanel } from './NarrativePanel'
import { SessionToolPanel, type SessionTool } from './SessionToolPanel'
import { SourceBadge } from './SourceBadge'
import { SurvivalHud } from './SurvivalHud'

import './session.css'

interface SessionClientProps {
  initialCharacter: Character
  locale?: Locale
}

interface PendingAction {
  choice?: Choice
  freeAction?: string
}

/**
 * Reads the backend's flat `updatedStats` record back into `SurvivalStats`,
 * falling back to the previous values for any gauge the backend didn't move.
 */
function readSurvival(stats: Record<string, number>, previous: SurvivalStats): SurvivalStats {
  return {
    hp: stats.hp ?? previous.hp,
    maxHp: stats.maxHp ?? previous.maxHp,
    thirst: stats.thirst ?? previous.thirst,
    hunger: stats.hunger ?? previous.hunger,
    energy: stats.energy ?? previous.energy,
    calamine: stats.calamine ?? previous.calamine,
  }
}

function formatChange(value: number): string {
  return value > 0 ? `+${value}` : `${value}`
}

function consequenceMessages(response: SceneResponse): string[] {
  const messages = response.notifications.map(
    (notification: GameNotification) => notification.message
  )
  const consequences = response.scene.consequences

  if (!consequences) return messages

  for (const [stat, value] of Object.entries(consequences.survivalChanges ?? {})) {
    messages.push(`${stat}: ${formatChange(value)}`)
  }
  for (const item of consequences.itemsGained ?? []) messages.push(`Found: ${item}`)
  for (const item of consequences.itemsLost ?? []) messages.push(`Lost: ${item}`)
  if (consequences.ironGained) messages.push(`Iron: ${formatChange(consequences.ironGained)}`)

  return messages
}

/**
 * Orchestrates the gamesession loop. The backend is the Game Master: it owns
 * the world-state, the d20 and every consequence. This client only sends the
 * session id + chosen choice and renders what comes back — it never simulates
 * rules or mutates stats itself.
 */
export function SessionClient({ initialCharacter, locale = 'en' }: SessionClientProps) {
  const [survival, setSurvival] = useState<SurvivalStats>(initialCharacter.stats.survival)
  const [scene, setScene] = useState<SceneResponse['scene'] | null>(null)
  // The real session id is owned by the backend (the DB is the source of truth).
  // It arrives in the opening scene from `createSession`; the `[id]` URL segment
  // is only a route placeholder and must never be sent back as the session id.
  const sessionIdRef = useRef<string | null>(null)
  const [source, setSource] = useState<SceneResponse['source']>(undefined)
  const [roll, setRoll] = useState<DiceRollResult | null>(null)
  const [inventory, setInventory] = useState<InventoryItemRef[]>([])
  const [notifications, setNotifications] = useState<string[]>([])
  const [turn, setTurn] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [freeAction, setFreeAction] = useState('')
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [openTool, setOpenTool] = useState<SessionTool | null>(null)
  const [online, setOnline] = useState(true)

  const incrementAnonymousRequestCount = useSessionStore(
    (state) => state.incrementAnonymousRequestCount
  )

  // Guards React 18 StrictMode's double-mount so the session is created once.
  const startedRef = useRef(false)
  const lastAttemptRef = useRef<PendingAction | null>(null)

  /** Applies a backend `SceneResponse` to local state — no rules run here. */
  const applyResponse = useCallback((next: SceneResponse) => {
    sessionIdRef.current = next.scene.sessionId
    if (next.scene.consequences?.gameOver === true) forgetActiveGameSession()
    else rememberActiveGameSession()
    setScene(next.scene)
    setSource(next.source)
    setSurvival((prev) => readSurvival(next.updatedStats, prev))
    setRoll(next.diceRoll ?? null)
    setInventory(next.updatedInventory)
    setNotifications(consequenceMessages(next))
    setGameOver(next.scene.consequences?.gameOver === true)
    setSelectedChoiceId(null)
    setFreeAction('')
    setTurn((t) => t + 1)
  }, [])

  const handleRequestError = useCallback((err: unknown) => {
    if (err instanceof Error && err.message === 'Anonymous limit reached') {
      setLimitReached(true)
    } else {
      setError(err instanceof Error ? err.message : 'The Game Master fell silent.')
    }
  }, [])

  const openSession = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      applyResponse(await createSession(locale))
      lastAttemptRef.current = null
    } catch (err) {
      handleRequestError(err)
    } finally {
      setLoading(false)
    }
  }, [applyResponse, handleRequestError, locale])

  const submitAction = useCallback(
    async (action: PendingAction) => {
      const activeSessionId = sessionIdRef.current
      if (!activeSessionId) return
      if (!navigator.onLine) {
        setOnline(false)
        setError('You are offline. Your current scene is safe; reconnect to continue.')
        return
      }

      lastAttemptRef.current = action
      setSelectedChoiceId(action.choice?.id ?? null)
      setLoading(true)
      setError(null)
      try {
        const next = await postGameAction({
          sessionId: activeSessionId,
          locale,
          ...(action.choice
            ? { choiceId: action.choice.id, chosenActionText: action.choice.text }
            : {}),
          ...(action.freeAction ? { freeAction: action.freeAction } : {}),
        })
        applyResponse(next)
        incrementAnonymousRequestCount()
      } catch (err) {
        handleRequestError(err)
      } finally {
        setLoading(false)
      }
    },
    [locale, applyResponse, incrementAnonymousRequestCount, handleRequestError]
  )

  useEffect(() => {
    const syncConnection = () => {
      const isOnline = navigator.onLine
      setOnline(isOnline)
      if (isOnline) {
        setError((current) => (current?.startsWith('You are offline') ? null : current))
      }
    }

    syncConnection()
    window.addEventListener('online', syncConnection)
    window.addEventListener('offline', syncConnection)
    return () => {
      window.removeEventListener('online', syncConnection)
      window.removeEventListener('offline', syncConnection)
    }
  }, [])

  useEffect(() => {
    if (!openTool) return
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setOpenTool(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [openTool])

  // Ensures an authenticated session (anonymous if none), then opens the session.
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    void (async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        await supabase.auth.signInAnonymously()
      }

      await openSession()
    })()
    // One-shot on mount; deps are stable callbacks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChoose = useCallback(
    (choice: Choice) => {
      if (gameOver) return
      void submitAction({ choice })
    },
    [gameOver, submitAction]
  )

  const handleFreeAction = useCallback(
    (draft = freeAction) => {
      const action = draft.trim()
      if (!action || gameOver || loading) return
      void submitAction({ freeAction: action })
    },
    [freeAction, gameOver, loading, submitAction]
  )

  const handleComposerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== 'Enter' || event.shiftKey) return
      event.preventDefault()
      handleFreeAction(event.currentTarget.value)
    },
    [handleFreeAction]
  )

  const handleRetry = useCallback(() => {
    const lastAttempt = lastAttemptRef.current
    if (lastAttempt) void submitAction(lastAttempt)
    else void openSession()
  }, [openSession, submitAction])

  const people = getPeople(initialCharacter.people)
  const vocation = getVocation(initialCharacter.vocation)
  const descriptor = [people?.name.en, vocation?.name.en].filter(Boolean).join(' · ')
  const narrative = scene?.narrative ?? 'The salt road stretches ahead…'

  return (
    <>
      <GameSceneLayout
        className="gs-shell"
        variant="immersive"
        background={
          <Image
            alt="The crowded room of the Broken Finger tavern"
            className="gs-background"
            fill
            priority
            sizes="100vw"
            src="/scenes/doigt-casse-session.webp"
          />
        }
        top={
          <GameTopBar
            className="gs-topbar"
            variant="velkhar"
            start={
              <LocationIdentity
                icon={<GameIcon decorative name="compass" size={32} />}
                place={scene?.location ?? 'The Salt Road'}
                world="Velkhar"
              />
            }
            center={
              <PlayerIdentity
                avatar={
                  <GameAvatar alt="" size="sm" src="/ui-kit/icons/stranger.webp" state="active" />
                }
                compact
                name={initialCharacter.name}
                subtitle={descriptor}
              />
            }
            end={
              <div className="gs-topbar__end">
                {source ? <SourceBadge source={source} /> : null}
                <Link href="/velkhar/aveugle?return=run">Return to the Blind One</Link>
              </div>
            }
          />
        }
        main={
          <main className="gs-main">
            <div className="gs-stage" key={scene?.id ?? 'opening'}>
              {notifications.length > 0 ? (
                <div className="gs-consequences" aria-label="Latest consequences" role="status">
                  {notifications.map((message) => (
                    <span key={message}>{message}</span>
                  ))}
                </div>
              ) : null}

              {limitReached ? (
                <div className="gs-state-panel" role="alert">
                  <GameIcon decorative name="lock" size={48} />
                  <h1>Your Chronicle is waiting</h1>
                  <p>Create a free account to keep this run and continue playing.</p>
                  <Link href="/signup">Create account</Link>
                </div>
              ) : error ? (
                <div className="gs-state-panel" role="alert">
                  <GameIcon decorative name={online ? 'warning' : 'hourglass'} size={48} />
                  <h1>{online ? 'The Game Master fell silent' : 'The road is out of reach'}</h1>
                  <p>{error}</p>
                  <button type="button" onClick={handleRetry} disabled={!online}>
                    Try again
                  </button>
                </div>
              ) : gameOver ? (
                <div className="gs-state-panel" role="status">
                  <GameIcon decorative name="book" size={48} />
                  <h1>This run has become a Chronicle</h1>
                  <p>The salt keeps what it takes. Your ending is ready to be remembered.</p>
                  <Link href="/velkhar/aveugle?return=chronicle">Return with your Chronicle</Link>
                </div>
              ) : (
                <>
                  <NarrativePanel narrative={narrative} loading={loading} />

                  {roll ? <DiceRoll key={turn} roll={roll} /> : null}

                  {scene ? (
                    <>
                      <ChoiceList
                        choices={scene.choices}
                        disabled={loading}
                        selectedChoiceId={selectedChoiceId}
                        onChoose={handleChoose}
                      />

                      <NarrativeComposer
                        aria-label="Describe another action"
                        actionDisabled={loading || freeAction.trim().length === 0}
                        actionLabel="Attempt this action"
                        maxLength={500}
                        placeholder="Another action… describe what you want to attempt"
                        value={freeAction}
                        onAction={() => handleFreeAction()}
                        onChange={(event) => setFreeAction(event.target.value)}
                        onKeyDown={handleComposerKeyDown}
                      />
                      <p className="gs-composer-hint">
                        Enter to act · Shift + Enter for a new line
                      </p>
                    </>
                  ) : null}
                </>
              )}
            </div>
          </main>
        }
        bottom={
          <SurvivalHud
            attributes={initialCharacter.stats.attributes}
            inventory={inventory}
            survival={survival}
            onOpenCharacter={() => setOpenTool('character')}
            onOpenInventory={() => setOpenTool('inventory')}
            onOpenMenu={() => setOpenTool('menu')}
          />
        }
      />
      <SessionToolPanel
        character={initialCharacter}
        inventory={inventory}
        openTool={openTool}
        source={source}
        onClose={() => setOpenTool(null)}
      />
      <SoftSignupPrompt />
    </>
  )
}
