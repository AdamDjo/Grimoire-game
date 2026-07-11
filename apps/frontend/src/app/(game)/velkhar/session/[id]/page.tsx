import {
  ATTRIBUTE_LABELS,
  attributeModifier,
  getPeople,
  getVocation,
  type Attribute,
} from '@grimoire/shared'

import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'

import { MOCK_CHARACTER } from './_data/mock-character'

const ATTRIBUTE_ORDER: Attribute[] = ['blood', 'breath', 'ash']

export default function VelkharSessionPage() {
  const { attributes, survival } = MOCK_CHARACTER.stats
  const people = getPeople(MOCK_CHARACTER.people)
  const vocation = getVocation(MOCK_CHARACTER.vocation)

  return (
    <div>
      <h1>
        <AnimatedShinyText variant="gold-strong">Velkhar Session</AnimatedShinyText>
      </h1>

      <section aria-label="Character">
        <h2>{MOCK_CHARACTER.name}</h2>
        <p>
          {people?.name.en} — {vocation?.name.en}
        </p>

        <ul aria-label="Attributes">
          {ATTRIBUTE_ORDER.map((key) => {
            const value = attributes[key]
            const mod = attributeModifier(value)
            const sign = mod >= 0 ? '+' : ''
            return (
              <li key={key}>
                {ATTRIBUTE_LABELS[key].en} {value} ({sign}
                {mod})
              </li>
            )
          })}
        </ul>

        <ul aria-label="Survival">
          <li>
            HP {survival.hp}/{survival.maxHp}
          </li>
          <li>Thirst {survival.thirst}</li>
          <li>Hunger {survival.hunger}</li>
          <li>Energy {survival.energy}</li>
          <li>Calamine {survival.calamine}</li>
        </ul>
      </section>
    </div>
  )
}
