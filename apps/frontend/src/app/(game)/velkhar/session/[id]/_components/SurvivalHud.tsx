import {
  ATTRIBUTE_LABELS,
  attributeModifier,
  type Attribute,
  type Attributes,
  type SurvivalStats,
} from '@grimoire/shared'

const ATTRIBUTE_ORDER: Attribute[] = ['blood', 'breath', 'ash']

type GaugeKind = 'hp' | 'thirst' | 'hunger' | 'energy' | 'calamine'

interface Gauge {
  kind: GaugeKind
  label: string
  value: number
  max: number
}

interface SurvivalHudProps {
  name: string
  descriptor: string
  attributes: Attributes
  survival: SurvivalStats
}

/** Provisional HUD: canon triptych (blood/breath/ash) + survival gauges. */
export function SurvivalHud({ name, descriptor, attributes, survival }: SurvivalHudProps) {
  const gauges: Gauge[] = [
    { kind: 'hp', label: 'HP', value: survival.hp, max: survival.maxHp },
    { kind: 'thirst', label: 'Thirst', value: survival.thirst, max: 100 },
    { kind: 'hunger', label: 'Hunger', value: survival.hunger, max: 100 },
    { kind: 'energy', label: 'Energy', value: survival.energy, max: 100 },
    { kind: 'calamine', label: 'Calamine', value: survival.calamine, max: 100 },
  ]

  return (
    <section className="gs-card" aria-label="Character status">
      <h2 className="gs-char-name">{name}</h2>
      <p className="gs-char-sub">{descriptor}</p>

      <div className="gs-triptych" aria-label="Attributes">
        {ATTRIBUTE_ORDER.map((key) => {
          const value = attributes[key]
          const mod = attributeModifier(value)
          const sign = mod >= 0 ? '+' : ''
          return (
            <div key={key} className="gs-attr" data-attr={key}>
              <div className="gs-attr-label">{ATTRIBUTE_LABELS[key].en}</div>
              <div className="gs-attr-value">{value}</div>
              <div className="gs-attr-mod">
                {sign}
                {mod}
              </div>
            </div>
          )
        })}
      </div>

      <div className="gs-gauges" aria-label="Survival">
        {gauges.map((gauge) => {
          const pct = gauge.max > 0 ? Math.round((gauge.value / gauge.max) * 100) : 0
          return (
            <div key={gauge.kind} className="gs-gauge-row">
              <div className="gs-gauge-head">
                <span>{gauge.label}</span>
                <span>
                  {gauge.value}
                  {gauge.kind === 'hp' ? `/${gauge.max}` : ''}
                </span>
              </div>
              <div
                className="gs-gauge-track"
                role="progressbar"
                aria-label={gauge.label}
                aria-valuenow={gauge.value}
                aria-valuemin={0}
                aria-valuemax={gauge.max}
              >
                <div
                  className="gs-gauge-fill"
                  data-kind={gauge.kind}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
