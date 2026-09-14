import Image from 'next/image'

import { GameSessionHud } from '../../components/GameSessionHud'

import type { StatBarTone } from '@/components/ui/grimoire/StatBar/StatBar'
import type { SurvivalStats } from '@grimoire/shared'

interface Gauge {
  id: keyof GameHudLabels['gauges']
  tone: StatBarTone
  /** Reads `[value, max]` out of the survival snapshot. */
  read: (stats: SurvivalStats) => readonly [number, number]
}

/**
 * The five survival gauges, in reading order. Each id doubles as the label key
 * and the icon filename in `public/encre-de-sel/icons/`, so a sixth gauge is
 * one entry here plus its icon — never a new branch below.
 */
const GAUGES: readonly Gauge[] = [
  { id: 'blood', tone: 'danger', read: (s) => [s.hp, s.maxHp] },
  { id: 'breath', tone: 'aqua', read: (s) => [s.energy, 100] },
  { id: 'hunger', tone: 'ember', read: (s) => [s.hunger, 100] },
  { id: 'thirst', tone: 'ember', read: (s) => [s.thirst, 100] },
  { id: 'calamine', tone: 'ember', read: (s) => [s.calamine, 100] },
]

export interface GameHudLabels {
  /** Accessible name of the readout as a whole. */
  region: string
  gauges: {
    blood: string
    breath: string
    hunger: string
    thirst: string
    calamine: string
  }
}

export interface GameHudProps {
  /**
   * The gauges to display. Same shape a live session holds in
   * `session.worldState`, so preview and game read one source of truth.
   */
  survival: SurvivalStats
  /**
   * Already-resolved copy. Labels are passed in rather than looked up here, so
   * the component works under any translation namespace without knowing it.
   */
  labels: GameHudLabels
  className?: string
  /**
   * Per-gauge classes, keyed like `labels.gauges`. Lets a caller tint a single
   * gauge from its own stylesheet without this component knowing the theme.
   */
  gaugeClassNames?: Partial<Record<keyof GameHudLabels['gauges'], string>>
}

/**
 * The survival bar, driven entirely by `SurvivalStats`.
 *
 * It holds no numbers and no copy of its own: a scripted snapshot and a live
 * run feed it the same shape, and neither needs this file to change.
 */
export function GameHud({ survival, labels, className, gaugeClassNames }: GameHudProps) {
  return (
    <GameSessionHud
      className={className}
      label={labels.region}
      statusBars={GAUGES.map(({ id, tone, read }) => {
        const [value, max] = read(survival)
        return {
          id,
          tone,
          value,
          max,
          label: labels.gauges[id],
          className: gaugeClassNames?.[id],
          icon: <Image alt="" width={36} height={36} src={`/encre-de-sel/icons/${id}.webp`} />,
        }
      })}
      statusGauges={[]}
      tools={[]}
    />
  )
}
