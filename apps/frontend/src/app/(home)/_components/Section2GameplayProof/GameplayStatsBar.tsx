import { GAMEPLAY_STATS } from '../../_data/landing-content'

export function GameplayStatsBar() {
  return (
    <aside className="gameplay-stats" aria-label="Etat du personnage" data-motion="stats">
      {GAMEPLAY_STATS.map((stat) => (
        <div key={stat.label} className={`gameplay-stat gameplay-stat--${stat.tone}`}>
          <span className="gameplay-stat__sigil" aria-hidden="true" />
          <span className="gameplay-stat__label">{stat.label}</span>
          <span className="gameplay-stat__value">{stat.value}</span>
          <span className="gameplay-stat__track" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} className={index < stat.filled ? 'is-filled' : undefined} />
            ))}
          </span>
        </div>
      ))}
    </aside>
  )
}
