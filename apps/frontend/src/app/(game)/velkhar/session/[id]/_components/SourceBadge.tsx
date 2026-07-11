interface SourceBadgeProps {
  source: 'ai' | 'stub'
}

/** Provisional badge: shows whether the scene came from the AI or the stub. */
export function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <span className="gs-badge" data-source={source} title="Scene source">
      {source === 'ai' ? 'AI Game Master' : 'Stub fallback'}
    </span>
  )
}
