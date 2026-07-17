'use client'

import { useCallback, useEffect, useState } from 'react'

import { ChronicleApiError, getPublicChronicle, getSessionChronicle } from '../api/chronicle-api'

import type { ChronicleAvailability, ChronicleView } from '../model/chronicle.types'

const POLL_DELAY_MS = 2500
const MAX_SESSION_POLLS = 12

interface UseChronicleOptions {
  kind: 'public' | 'session'
  reference: string | null
  tooShort?: boolean
}

interface UseChronicleResult {
  chronicle: ChronicleView | null
  retry: () => void
  status: ChronicleAvailability
}

export function useChronicle({
  kind,
  reference,
  tooShort = false,
}: UseChronicleOptions): UseChronicleResult {
  const [attempt, setAttempt] = useState(0)
  const [chronicle, setChronicle] = useState<ChronicleView | null>(null)
  const [status, setStatus] = useState<ChronicleAvailability>(tooShort ? 'too-short' : 'loading')

  const retry = useCallback(() => {
    setChronicle(null)
    setStatus(tooShort ? 'too-short' : 'loading')
    setAttempt((current) => current + 1)
  }, [tooShort])

  useEffect(() => {
    if (tooShort) {
      setStatus('too-short')
      return
    }
    if (!reference) {
      setStatus('error')
      return
    }

    let cancelled = false
    let timeout: ReturnType<typeof setTimeout> | undefined

    const load = async (poll = 0) => {
      try {
        const result =
          kind === 'session'
            ? await getSessionChronicle(reference)
            : await getPublicChronicle(reference)
        if (cancelled) return
        setChronicle(result)
        setStatus('ready')
      } catch (error) {
        if (cancelled) return
        const notFound = error instanceof ChronicleApiError && error.status === 404
        if (kind === 'session' && notFound && poll < MAX_SESSION_POLLS) {
          timeout = setTimeout(() => void load(poll + 1), POLL_DELAY_MS)
          return
        }
        setStatus(notFound ? 'unavailable' : 'error')
      }
    }

    setStatus('loading')
    void load()
    return () => {
      cancelled = true
      if (timeout) clearTimeout(timeout)
    }
  }, [attempt, kind, reference, tooShort])

  return { chronicle, retry, status }
}
