import Image from 'next/image'
import Link from 'next/link'

import { ChronicleBody } from './ChronicleBody'
import { ChronicleShare } from './ChronicleShare'

import type { ChronicleView } from '../model/chronicle.types'

interface ChronicleReaderProps {
  chronicle: ChronicleView
  inline?: boolean
}

const MOOD_LABELS: Record<ChronicleView['mood'], string> = {
  absurd: 'Étrange',
  epic: 'Épique',
  melancholic: 'Mélancolique',
  serene: 'Sereine',
  tragic: 'Tragique',
}

export function ChronicleReader({ chronicle, inline = false }: ChronicleReaderProps) {
  return (
    <article className="chronicle-reader" data-inline={inline} data-mood={chronicle.mood}>
      <header className="chronicle-reader__header">
        <p className="chronicle-reader__eyebrow">
          Chronique de Velkhar · {MOOD_LABELS[chronicle.mood]}
        </p>
        <h1>{chronicle.title}</h1>
        <p className="chronicle-reader__tagline">{chronicle.tagline}</p>
      </header>

      <div
        className="chronicle-reader__illustration"
        data-mood={chronicle.mood}
        role={chronicle.illustrationUrl ? undefined : 'img'}
        aria-label={
          chronicle.illustrationUrl
            ? undefined
            : `Illustration ${MOOD_LABELS[chronicle.mood].toLowerCase()} de Velkhar`
        }
      >
        {chronicle.illustrationUrl ? (
          <Image
            alt=""
            fill
            priority
            sizes="(max-width: 760px) 100vw, 860px"
            src={chronicle.illustrationUrl}
          />
        ) : (
          <span aria-hidden="true">V</span>
        )}
      </div>

      {chronicle.keyMoments.length > 0 ? (
        <ol className="chronicle-reader__moments" aria-label="Moments marquants">
          {chronicle.keyMoments.slice(0, 4).map((moment) => (
            <li key={`${moment.sceneRef}-${moment.label}`}>{moment.label}</li>
          ))}
        </ol>
      ) : null}

      <ChronicleBody markdown={chronicle.bodyMarkdown} />

      <footer className="chronicle-reader__footer">
        {!inline || chronicle.slug ? <ChronicleShare title={chronicle.title} /> : null}
        <div className="chronicle-reader__after">
          <p>La route s’arrête ici. La trace, elle, demeure.</p>
          <nav aria-label="Après la Chronique">
            <Link href="/velkhar/aveugle?return=chronicle">Revenir à l’Aveugle</Link>
            <Link href="/velkhar/character-create">Créer un nouveau personnage</Link>
            <Link href="/dashboard">Retrouver mes traces</Link>
          </nav>
        </div>
        {inline ? (
          <p className="chronicle-reader__account-note">
            Joueur anonyme ?{' '}
            <Link href="/signup?return=chronicle">Garder cette trace gratuitement</Link>
          </p>
        ) : null}
      </footer>
    </article>
  )
}
