import { ATTRIBUTE_LABELS, attributeModifier, getPeople, getVocation } from '@grimoire/shared'

import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'

import type { Character, Condition, SurvivalStats } from '@grimoire/shared'

interface VelkharCharacterSheetProps {
  character: Character
  survival: SurvivalStats
}

const ATTRIBUTE_ORDER = ['blood', 'breath', 'ash'] as const

const CONDITION_LABELS: Record<Condition, string> = {
  fever: 'Fever',
  poisoned: 'Poisoned',
  wounded: 'Wounded',
  frozen: 'Frozen',
  stunned: 'Stunned',
  blinded: 'Blinded',
  marsh_sickness: 'Marsh sickness',
  ash_corrupted: 'Ash-corrupted',
  shaken_mind: 'Shaken mind',
  slow_petrification: 'Slow petrification',
}

export function VelkharCharacterSheet({ character, survival }: VelkharCharacterSheetProps) {
  const people = getPeople(character.people)
  const vocation = getVocation(character.vocation)

  return (
    <div className="velkhar-character-sheet">
      <header className="velkhar-character-sheet__identity">
        <GameIcon decorative name="stranger" size={64} />
        <div>
          <p className="velkhar-session-window__eyebrow">Character sheet</p>
          <h3>{character.name}</h3>
          <p>
            {people?.name.en ?? character.people} · {vocation?.name.en ?? character.vocation}
          </p>
        </div>
      </header>

      {character.backstory ? (
        <p className="velkhar-session-window__story">{character.backstory}</p>
      ) : null}

      <section aria-labelledby="velkhar-attributes-title">
        <h4 id="velkhar-attributes-title">Triptych</h4>
        <dl className="velkhar-session-window__attributes">
          {ATTRIBUTE_ORDER.map((attribute) => {
            const value = character.stats.attributes[attribute]
            const modifier = attributeModifier(value)
            return (
              <div key={attribute} data-attribute={attribute}>
                <dt>{ATTRIBUTE_LABELS[attribute].en}</dt>
                <dd>
                  {value} <small>{modifier >= 0 ? `+${modifier}` : modifier}</small>
                </dd>
              </div>
            )
          })}
        </dl>
      </section>

      <section aria-labelledby="velkhar-survival-title">
        <h4 id="velkhar-survival-title">Survival</h4>
        <dl className="velkhar-character-sheet__survival">
          <div>
            <dt>Health</dt>
            <dd>
              {survival.hp}/{survival.maxHp}
            </dd>
          </div>
          <div>
            <dt>Thirst</dt>
            <dd>{survival.thirst}%</dd>
          </div>
          <div>
            <dt>Hunger</dt>
            <dd>{survival.hunger}%</dd>
          </div>
          <div>
            <dt>Fatigue</dt>
            <dd>{100 - survival.energy}%</dd>
          </div>
          <div data-danger={survival.calamine >= 75}>
            <dt>Calamine</dt>
            <dd>{survival.calamine}%</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="velkhar-conditions-title">
        <h4 id="velkhar-conditions-title">Conditions</h4>
        {character.stats.conditions.length > 0 ? (
          <ul className="velkhar-character-sheet__conditions">
            {character.stats.conditions.map((condition) => (
              <li key={condition}>{CONDITION_LABELS[condition]}</li>
            ))}
          </ul>
        ) : (
          <p className="velkhar-session-window__muted">No active condition.</p>
        )}
      </section>
    </div>
  )
}
