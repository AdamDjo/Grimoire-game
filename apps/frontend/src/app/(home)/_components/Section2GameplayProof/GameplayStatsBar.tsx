import { GAMEPLAY_STATS } from '../../_data/landing-content'

const TONE_TEXT_CLASS: Record<(typeof GAMEPLAY_STATS)[number]['tone'], string> = {
  blood: 'text-blood',
  soul: 'text-soul',
  ash: 'text-cendre',
}

export function GameplayStatsBar() {
  return (
    <aside
      className="gameplay-stats absolute z-[4] grid max-w-[1040px] items-stretch opacity-0 shadow-[0_18px_55px_rgba(0,0,0,0.5)]"
      aria-label="Etat du personnage"
      data-motion="stats"
    >
      {GAMEPLAY_STATS.map((stat) => (
        <div
          key={stat.label}
          className={`gameplay-stat grid min-w-0 items-center gap-3 ${TONE_TEXT_CLASS[stat.tone]}`}
        >
          <span
            className="gameplay-stat__sigil relative inline-block aspect-square w-8 rotate-45"
            aria-hidden="true"
          />
          <span className="gameplay-stat__label text-stat-label">{stat.label}</span>
          <span className="gameplay-stat__value text-stat-value">{stat.value}</span>
          <span
            className="gameplay-stat__track grid grid-cols-[repeat(6,minmax(10px,1fr))] gap-1"
            aria-hidden="true"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} className={index < stat.filled ? 'is-filled' : undefined} />
            ))}
          </span>
        </div>
      ))}
    </aside>
  )
}
