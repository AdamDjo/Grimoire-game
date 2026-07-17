'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { forgetActiveGameSession, rememberActiveGameSession } from '@/lib/active-game-session'
import { createClient } from '@/lib/supabase/client'
import { useSessionStore } from '@/stores/session-store'

import type {
  GameSessionApi,
  GameSessionChoice,
  GameSessionResponse,
  GameSessionState,
  PendingGameAction,
} from '../model/game-session.types'
import type { Locale } from '@grimoire/shared'

interface UseGameSessionOptions<TWorldState, TResponse extends GameSessionResponse> {
  api: GameSessionApi<TResponse>
  initialWorldState: TWorldState
  locale: Locale
  reduceWorldState: (previous: TWorldState, response: TResponse) => TWorldState
  resumeHref: string
}

export interface UseGameSessionResult<
  TWorldState,
  TResponse extends GameSessionResponse,
> extends GameSessionState<TWorldState, TResponse> {
  choose: (choice: GameSessionChoice) => void
  retry: () => void
  submitFreeAction: (action: string) => void
}

/**
 * World-agnostic session controller.
 * The world injects only its state reducer and presentation components.
 */
export function useGameSession<TWorldState, TResponse extends GameSessionResponse>({
  api,
  initialWorldState,
  locale,
  reduceWorldState,
  resumeHref,
}: UseGameSessionOptions<TWorldState, TResponse>): UseGameSessionResult<TWorldState, TResponse> {
  const [state, setState] = useState<GameSessionState<TWorldState, TResponse>>({
    error: null,
    gameOver: false,
    inventory: [],
    limitReached: false,
    loading: true,
    online: true,
    roll: null,
    response: null,
    scene: null,
    selectedChoiceId: null,
    source: undefined,
    turn: 0,
    worldState: initialWorldState,
  })
  const sessionIdRef = useRef<string | null>(null)
  const startedRef = useRef(false)
  const lastAttemptRef = useRef<PendingGameAction | null>(null)
  const incrementAnonymousRequestCount = useSessionStore(
    (sessionState) => sessionState.incrementAnonymousRequestCount
  )

  const applyResponse = useCallback(
    (response: TResponse) => {
      sessionIdRef.current = response.scene.sessionId
      if (response.scene.consequences?.gameOver === true) forgetActiveGameSession()
      else rememberActiveGameSession(resumeHref)

      setState((current) => ({
        ...current,
        error: null,
        gameOver: response.scene.consequences?.gameOver === true,
        inventory: response.updatedInventory,
        limitReached: false,
        loading: false,
        roll: response.diceRoll ?? null,
        response,
        scene: response.scene,
        selectedChoiceId: null,
        source: response.source,
        turn: current.turn + 1,
        worldState: reduceWorldState(current.worldState, response),
      }))
    },
    [reduceWorldState, resumeHref]
  )

  const handleRequestError = useCallback((error: unknown) => {
    setState((current) => {
      if (error instanceof Error && error.message === 'Anonymous limit reached') {
        return { ...current, limitReached: true, loading: false }
      }

      return {
        ...current,
        error: error instanceof Error ? error.message : 'The Game Master fell silent.',
        loading: false,
      }
    })
  }, [])

  const openSession = useCallback(async () => {
    setState((current) => ({ ...current, error: null, loading: true }))
    try {
      applyResponse(await api.createSession(locale))
      lastAttemptRef.current = null
    } catch (error) {
      handleRequestError(error)
    }
  }, [api, applyResponse, handleRequestError, locale])

  const submitAction = useCallback(
    async (action: PendingGameAction) => {
      const sessionId = sessionIdRef.current
      if (!sessionId) return
      if (!navigator.onLine) {
        setState((current) => ({
          ...current,
          error: 'You are offline. Your current scene is safe; reconnect to continue.',
          online: false,
        }))
        return
      }

      lastAttemptRef.current = action
      setState((current) => ({
        ...current,
        error: null,
        loading: true,
        selectedChoiceId: action.choice?.id ?? null,
      }))

      try {
        const response = await api.postGameAction({
          sessionId,
          locale,
          ...(action.choice
            ? { choiceId: action.choice.id, chosenActionText: action.choice.text }
            : {}),
          ...(action.freeAction ? { freeAction: action.freeAction } : {}),
        })
        applyResponse(response)
        incrementAnonymousRequestCount()
      } catch (error) {
        handleRequestError(error)
      }
    },
    [api, applyResponse, handleRequestError, incrementAnonymousRequestCount, locale]
  )

  useEffect(() => {
    const syncConnection = () => {
      const online = navigator.onLine
      setState((current) => ({
        ...current,
        error: online && current.error?.startsWith('You are offline') ? null : current.error,
        online,
      }))
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
    if (startedRef.current) return
    startedRef.current = true

    void (async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) await supabase.auth.signInAnonymously()
      await openSession()
    })()
  }, [openSession])

  const choose = useCallback(
    (choice: GameSessionChoice) => {
      if (state.gameOver) return
      void submitAction({ choice })
    },
    [state.gameOver, submitAction]
  )

  const submitFreeAction = useCallback(
    (draft: string) => {
      const freeAction = draft.trim()
      if (!freeAction || state.gameOver || state.loading) return
      void submitAction({ freeAction })
    },
    [state.gameOver, state.loading, submitAction]
  )

  const retry = useCallback(() => {
    const lastAttempt = lastAttemptRef.current
    if (lastAttempt) void submitAction(lastAttempt)
    else void openSession()
  }, [openSession, submitAction])

  return { ...state, choose, retry, submitFreeAction }
}
