interface NarrativePanelProps {
  narrative: string
  loading: boolean
}

/** Provisional narrative panel: renders the Game Master prose. */
export function NarrativePanel({ narrative, loading }: NarrativePanelProps) {
  return (
    <article className="gs-narrative" data-loading={loading} aria-busy={loading} aria-live="polite">
      {narrative}
    </article>
  )
}
