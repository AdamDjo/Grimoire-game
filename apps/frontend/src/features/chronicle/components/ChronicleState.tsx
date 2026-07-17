import Link from 'next/link'

import type { ChronicleAvailability } from '../model/chronicle.types'

interface ChronicleStateProps {
  onRetry: () => void
  status: Exclude<ChronicleAvailability, 'ready'>
}

const COPY = {
  error: {
    title: 'L’encre s’est interrompue',
    body: 'La Chronique n’a pas pu être chargée. Ta fin de partie est conservée.',
  },
  loading: {
    title: 'Le Grimoire rassemble tes traces',
    body: 'Les choix, les blessures et les rencontres deviennent un dernier récit. Cela peut prendre quelques instants.',
  },
  'too-short': {
    title: 'Quelques pas, pas encore une Chronique',
    body: 'Cette route fut trop brève pour former un récit, mais sa fin compte malgré tout.',
  },
  unavailable: {
    title: 'Cette Chronique demeure introuvable',
    body: 'Elle est peut-être encore en train de s’écrire, privée, ou retirée du Grimoire.',
  },
} as const

export function ChronicleState({ onRetry, status }: ChronicleStateProps) {
  const copy = COPY[status]
  return (
    <section
      className="chronicle-state"
      aria-live="polite"
      role={status === 'error' ? 'alert' : 'status'}
    >
      <span className="chronicle-state__mark" aria-hidden="true">
        V
      </span>
      <h1>{copy.title}</h1>
      <p>{copy.body}</p>
      {status === 'loading' ? (
        <div className="chronicle-state__progress" aria-hidden="true" />
      ) : null}
      {status === 'error' || status === 'unavailable' ? (
        <button type="button" onClick={onRetry}>
          Réessayer
        </button>
      ) : null}
      {status !== 'loading' ? (
        <Link href="/velkhar/aveugle?return=chronicle">Revenir à l’Aveugle</Link>
      ) : null}
    </section>
  )
}
