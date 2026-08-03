import { useTranslations } from 'next-intl'

import { NarrativePassage } from '@/components/ui/grimoire/NarrativePassage/NarrativePassage'

interface NarrativePanelProps {
  narrative: string
  loading: boolean
}

/** The Game Master's prose remains the visual and reading focus of every turn. */
export function NarrativePanel({ narrative, loading }: NarrativePanelProps) {
  const t = useTranslations('Session')
  const paragraphs = narrative.split(/\n{2,}/).filter(Boolean)

  return (
    <article
      className="game-session-narrative"
      data-loading={loading}
      aria-busy={loading}
      aria-live="polite"
    >
      <NarrativePassage align="center">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </NarrativePassage>
      {loading ? (
        <span className="game-session-narrative__loading" role="status">
          {t('worldAnswering')}
        </span>
      ) : null}
    </article>
  )
}
