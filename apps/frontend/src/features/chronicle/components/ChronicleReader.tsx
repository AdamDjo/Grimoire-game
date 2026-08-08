import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { getAuthHref } from '@/lib/internal-navigation'

import { ChronicleBody } from './ChronicleBody'
import { ChronicleShare } from './ChronicleShare'

import type { ChronicleView } from '../model/chronicle.types'

interface ChronicleReaderProps {
  chronicle: ChronicleView
  inline?: boolean
}

export function ChronicleReader({ chronicle, inline = false }: ChronicleReaderProps) {
  const t = useTranslations('Chronicle')
  const moodLabels: Record<ChronicleView['mood'], string> = {
    absurd: t('moodAbsurd'),
    epic: t('moodEpic'),
    melancholic: t('moodMelancholic'),
    serene: t('moodSerene'),
    tragic: t('moodTragic'),
  }
  const mood = moodLabels[chronicle.mood]

  return (
    <article className="chronicle-reader" data-inline={inline} data-mood={chronicle.mood}>
      <header className="chronicle-reader__header">
        <p className="chronicle-reader__eyebrow">{t('eyebrow', { mood })}</p>
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
            : t('fallbackIllustration', { mood: mood.toLowerCase() })
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
        <ol className="chronicle-reader__moments" aria-label={t('keyMoments')}>
          {chronicle.keyMoments.slice(0, 4).map((moment) => (
            <li key={`${moment.sceneRef}-${moment.label}`}>{moment.label}</li>
          ))}
        </ol>
      ) : null}

      <ChronicleBody markdown={chronicle.bodyMarkdown} />

      <footer className="chronicle-reader__footer">
        {!inline || chronicle.slug ? <ChronicleShare title={chronicle.title} /> : null}
        <div className="chronicle-reader__after">
          <p>{t('endingLine')}</p>
          <nav aria-label={t('afterNavigation')}>
            <Link href="/velkhar/aveugle?return=chronicle">{t('returnBlindOne')}</Link>
            <Link href="/velkhar/character-create">{t('newCharacter')}</Link>
            <Link href="/dashboard">{t('findTraces')}</Link>
          </nav>
        </div>
        {inline ? (
          <p className="chronicle-reader__account-note">
            {t('anonymousQuestion')}{' '}
            <Link href={getAuthHref('/signup', '/velkhar/aveugle?return=chronicle')}>
              {t('keepTrace')}
            </Link>
          </p>
        ) : null}
      </footer>
    </article>
  )
}
