'use client'

import { getPeople, getVocation, type Character, type Choice, type Locale } from '@grimoire/shared'
import { useCallback, useEffect, useRef, useState } from 'react'

import { SoftSignupPrompt } from '@/components/ui/soft-signup-prompt'
import { createClient } from '@/lib/supabase/client'
import { useSessionStore } from '@/stores/session-store'

import { postGameAction, type SceneWithSource } from '../_lib/api'
import { resolveChoice, type DiceRoll as DiceRollResult } from '../_lib/consequences'

import { ChoiceList } from './ChoiceList'
import { DiceRoll } from './DiceRoll'
import { NarrativePanel } from './NarrativePanel'
import { SourceBadge } from './SourceBadge'
import { SurvivalHud } from './SurvivalHud'

import './session.css'

interface SessionClientProps {
  sessionId: string
  initialCharacter: Character
  locale?: Locale
}

/**
 * PROVISIONAL orchestrator for the gamesession demo (#99).
 * Owns the game loop: fetch scene -> render -> player picks a choice ->
 * simulate consequences on the HUD -> fetch the next scene.
 * Disposable — replaced by the real session flow once rules & persistence land.
 */
export function SessionClient({ sessionId, initialCharacter, locale = 'en' }: SessionClientProps) {
  const [character, setCharacter] = useState<Character>(initialCharacter)
  const [scene, setScene] = useState<SceneWithSource | null>(null)
  const [roll, setRoll] = useState<DiceRollResult | null>(null)
  const [turn, setTurn] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)

  const incrementAnonymousRequestCount = useSessionStore(
    (state) => state.incrementAnonymousRequestCount
  )

  // Guards React 18 StrictMode's double-mount so the opening scene fetches once.
  const startedRef = useRef(false)

  const requestScene = useCallback(
    async (choice?: Choice) => {
      setLoading(true)
      setError(null)
      try {
        const next = await postGameAction({
          character,
          locale,
          sessionId,
          choiceId: choice?.id,
          chosenActionText: choice?.text,
        })
        setScene(next)
        setTurn((t) => t + 1)
        incrementAnonymousRequestCount()
      } catch (err) {
        if (err instanceof Error && err.message === 'Anonymous limit reached') {
          setLimitReached(true)
        } else {
          setError(err instanceof Error ? err.message : 'The Game Master fell silent.')
        }
      } finally {
        setLoading(false)
      }
    },
    [character, locale, sessionId, incrementAnonymousRequestCount]
  )

  // Ensures an authenticated session (anonymous if none) before the first scene fetch.
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

      void requestScene()
    })()
    // requestScene depends on character (stable on mount) — intentional one-shot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChoose = useCallback(
    (choice: Choice) => {
      // Simulate the mechanical consequences on the HUD before the next scene.
      const resolution = resolveChoice(character.stats.survival, choice)
      setCharacter((prev) => ({
        ...prev,
        stats: { ...prev.stats, survival: resolution.survival },
      }))
      setRoll(resolution.roll ?? null)
      void requestScene(choice)
    },
    [character.stats.survival, requestScene]
  )

  const people = getPeople(character.people)
  const vocation = getVocation(character.vocation)
  const descriptor = [people?.name.en, vocation?.name.en].filter(Boolean).join(' — ')

  return (
    <div className="gs-shell">
      <main className="gs-main">
        <header className="gs-header">
          <h1 className="gs-title">Velkhar Session</h1>
          <div className="gs-header-meta">
            {scene ? <SourceBadge source={scene.source} /> : null}
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
              <button type="button" className="gs-retry" onClick={() => void requestScene()}>
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

        {scene && !error && !limitReached ? (
          <ChoiceList choices={scene.choices} disabled={loading} onChoose={handleChoose} />
        ) : null}
      </main>

      <aside className="gs-aside">
        <SurvivalHud
          name={character.name}
          descriptor={descriptor}
          attributes={character.stats.attributes}
          survival={character.stats.survival}
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
