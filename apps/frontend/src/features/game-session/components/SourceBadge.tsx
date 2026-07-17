interface SourceBadgeProps {
  source: 'ai' | 'stub'
}

/** Quiet diagnostic signal that never competes with the fiction. */
export function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <span className="game-session-source" data-source={source} title="Scene source">
      {source === 'ai' ? 'Living Game Master' : 'Fallback tale'}
    </span>
  )
}
