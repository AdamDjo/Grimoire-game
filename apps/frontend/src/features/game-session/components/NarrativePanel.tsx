import { NarrativePassage } from '@/components/ui/grimoire/NarrativePassage/NarrativePassage'

interface NarrativePanelProps {
  narrative: string
  loading: boolean
}

/** The Game Master's prose remains the visual and reading focus of every turn. */
export function NarrativePanel({ narrative, loading }: NarrativePanelProps) {
  const paragraphs = narrative.split(/\n{2,}/).filter(Boolean)

  return (
    <article
      className="game-session-narrative"
      data-loading={loading}
      aria-busy={loading}
      aria-live="polite"
    >
      <NarrativePassage align="center" dropCap>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </NarrativePassage>
      {loading ? (
        <span className="game-session-narrative__loading" role="status">
          The world is answering…
        </span>
      ) : null}
    </article>
  )
}
