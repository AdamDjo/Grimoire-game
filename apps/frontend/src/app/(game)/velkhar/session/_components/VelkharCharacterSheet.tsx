import { ATTRIBUTE_LABELS, attributeModifier, getPeople, getVocation } from '@grimoire/shared'
import { useLocale, useTranslations } from 'next-intl'

import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'

import type { Character, ConditionId, SurvivalStats } from '@grimoire/shared'

interface VelkharCharacterSheetProps {
  character: Character
  survival: SurvivalStats
}

const ATTRIBUTE_ORDER = ['blood', 'breath', 'ash'] as const

export function VelkharCharacterSheet({ character, survival }: VelkharCharacterSheetProps) {
  const locale = useLocale()
  const t = useTranslations('Session')
  const people = getPeople(character.people)
  const vocation = getVocation(character.vocation)
  const conditionLabels: Record<ConditionId, string> = {
    fever: t('conditionFever'),
    poison: t('conditionPoison'),
    wound: t('conditionWound'),
    freeze: t('conditionFreeze'),
    stun: t('conditionStun'),
    blindness: t('conditionBlindness'),
    marsh_disease: t('conditionMarshDisease'),
    cendre_corrupt: t('conditionCendreCorrupt'),
    shaken_reason: t('conditionShakenReason'),
    petrification: t('conditionPetrification'),
  }

  return (
    <div className="velkhar-character-sheet">
      <header className="velkhar-character-sheet__identity">
        <GameIcon decorative name="stranger" size={64} />
        <div>
          <p className="velkhar-session-window__eyebrow">{t('characterSheet')}</p>
          <h3>{character.name}</h3>
          <p>
            {people?.name[locale] ?? character.people} ·{' '}
            {vocation?.name[locale] ?? character.vocation}
          </p>
        </div>
      </header>

      {character.backstory ? (
        <p className="velkhar-session-window__story">{character.backstory}</p>
      ) : null}

      <section aria-labelledby="velkhar-attributes-title">
        <h4 id="velkhar-attributes-title">{t('triptych')}</h4>
        <dl className="velkhar-session-window__attributes">
          {ATTRIBUTE_ORDER.map((attribute) => {
            const value = character.stats.attributes[attribute]
            const modifier = attributeModifier(value)
            return (
              <div key={attribute} data-attribute={attribute}>
                <dt>{ATTRIBUTE_LABELS[attribute][locale]}</dt>
                <dd>
                  {value} <small>{modifier >= 0 ? `+${modifier}` : modifier}</small>
                </dd>
              </div>
            )
          })}
        </dl>
      </section>

      <section aria-labelledby="velkhar-survival-title">
        <h4 id="velkhar-survival-title">{t('survival')}</h4>
        <dl className="velkhar-character-sheet__survival">
          <div>
            <dt>{t('health')}</dt>
            <dd>
              {survival.hp}/{survival.maxHp}
            </dd>
          </div>
          <div>
            <dt>{t('thirst')}</dt>
            <dd>{survival.thirst}%</dd>
          </div>
          <div>
            <dt>{t('hunger')}</dt>
            <dd>{survival.hunger}%</dd>
          </div>
          <div>
            <dt>{t('fatigue')}</dt>
            <dd>{100 - survival.energy}%</dd>
          </div>
          <div data-danger={survival.calamine >= 75}>
            <dt>{t('calamine')}</dt>
            <dd>{survival.calamine}%</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="velkhar-conditions-title">
        <h4 id="velkhar-conditions-title">{t('conditions')}</h4>
        {character.stats.conditions.length > 0 ? (
          <ul className="velkhar-character-sheet__conditions">
            {character.stats.conditions.map((condition) => (
              <li key={condition.id}>{conditionLabels[condition.id]}</li>
            ))}
          </ul>
        ) : (
          <p className="velkhar-session-window__muted">{t('noCondition')}</p>
        )}
      </section>
    </div>
  )
}
