'use client'

import {
  getPeople,
  getVocation,
  type Character,
  type Choice,
  type DiceRoll as DiceRollResult,
  type Locale,
  type SceneResponse,
  type SurvivalStats,
} from '@grimoire/shared'
import { useCallback, useEffect, useRef, useState } from 'react'

import { SoftSignupPrompt } from '@/components/ui/soft-signup-prompt'
import { forgetActiveGameSession, rememberActiveGameSession } from '@/lib/active-game-session'
import { createClient } from '@/lib/supabase/client'
import { useSessionStore } from '@/stores/session-store'

import { createSession, postGameAction } from '../_lib/api'

import { ChoiceList } from './ChoiceList'
import { DiceRoll } from './DiceRoll'
import { NarrativePanel } from './NarrativePanel'
import { SourceBadge } from './SourceBadge'
import { SurvivalHud } from './SurvivalHud'

import './session.css'

interface SessionClientProps {
  initialCharacter: Character
  locale?: Locale
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
  const [turn, setTurn] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)

  const incrementAnonymousRequestCount = useSessionStore(
    (state) => state.incrementAnonymousRequestCount
  )

  // Guards React 18 StrictMode's double-mount so the session is created once.
  const startedRef = useRef(false)

  /** Applies a backend `SceneResponse` to local state — no rules run here. */
  const applyResponse = useCallback((next: SceneResponse) => {
    sessionIdRef.current = next.scene.sessionId
    if (next.scene.consequences?.gameOver === true) forgetActiveGameSession()
    else rememberActiveGameSession()
    setScene(next.scene)
    setSource(next.source)
    setSurvival((prev) => readSurvival(next.updatedStats, prev))
    setRoll(next.diceRoll ?? null)
    setGameOver(next.scene.consequences?.gameOver === true)
    setTurn((t) => t + 1)
  }, [])

  const handleRequestError = useCallback((err: unknown) => {
    if (err instanceof Error && err.message === 'Anonymous limit reached') {
      setLimitReached(true)
    } else {
      setError(err instanceof Error ? err.message : 'The Game Master fell silent.')
    }
  }, [])

  const chooseAction = useCallback(
    async (choice: Choice) => {
      const activeSessionId = sessionIdRef.current
      if (!activeSessionId) return
      setLoading(true)
      setError(null)
      try {
        const next = await postGameAction({
          sessionId: activeSessionId,
          locale,
          choiceId: choice.id,
          chosenActionText: choice.text,
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

      setLoading(true)
      try {
        applyResponse(await createSession(locale))
      } catch (err) {
        handleRequestError(err)
      } finally {
        setLoading(false)
      }
    })()
    // One-shot on mount; deps are stable callbacks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChoose = useCallback(
    (choice: Choice) => {
      if (gameOver) return
      void chooseAction(choice)
    },
    [gameOver, chooseAction]
  )

  const people = getPeople(initialCharacter.people)
  const vocation = getVocation(initialCharacter.vocation)
  const descriptor = [people?.name.en, vocation?.name.en].filter(Boolean).join(' — ')

  return (
    <div className="gs-shell">
      <main className="gs-main">
        <header className="gs-header">
          <h1 className="gs-title">Velkhar Session</h1>
          <div className="gs-header-meta">
            {scene && source ? <SourceBadge source={source} /> : null}
            {scene ? <span className="gs-location">{scene.location}</span> : null}
          </div>
        </header>

        {limitReached ? (
          <div className="gs-error" role="alert">
            You&apos;ve reached the anonymous play limit. Create a free account to keep playing.
            <div>
              <a href="/signup" className="gs-retry">
                Create account
              </a>
            </div>
          </div>
        ) : error ? (
          <div className="gs-error" role="alert">
            {error}
            <div>
              <button
                type="button"
                className="gs-retry"
                onClick={() =>
                  void createSession(locale).then(applyResponse).catch(handleRequestError)
                }
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <NarrativePanel
            narrative={scene?.narrative ?? 'The salt road stretches ahead…'}
            loading={loading}
          />
        )}

        {gameOver && !error && !limitReached ? (
          <div className="gs-error" role="alert">
            Your run has ended. The salt keeps what it takes.
          </div>
        ) : null}

        {scene && !error && !limitReached && !gameOver ? (
          <ChoiceList choices={scene.choices} disabled={loading} onChoose={handleChoose} />
        ) : null}
      </main>

      <aside className="gs-aside">
        <SurvivalHud
          name={initialCharacter.name}
          descriptor={descriptor}
          attributes={initialCharacter.stats.attributes}
          survival={survival}
        />
        {roll ? (
          <section className="gs-card" aria-label="Last roll">
            <h2 className="gs-card-title">Last roll</h2>
            {/* Key on turn so the die re-animates each risky pivot. */}
            <DiceRoll key={turn} roll={roll} />
          </section>
        ) : null}
      </aside>

      <SoftSignupPrompt />
    </div>
  )
}
