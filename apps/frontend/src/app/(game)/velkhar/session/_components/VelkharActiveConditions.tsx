'use client'

import { getConditionDefinition } from '@grimoire/shared'
import { useLocale, useTranslations } from 'next-intl'
import { useId } from 'react'

import { GameIcon, type GameIconName } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { cn } from '@/lib/utils'

import type { ActiveCondition, ConditionId } from '@grimoire/shared'

const CONDITION_ICONS: Record<ConditionId, GameIconName> = {
  blindness: 'eye',
  cendre_corrupt: 'artifact',
  fever: 'fire',
  freeze: 'wind',
  marsh_disease: 'potion',
  petrification: 'diamond',
  poison: 'potion',
  shaken_reason: 'memory',
  stun: 'warning',
  wound: 'blood-drop',
}

interface VelkharActiveConditionsProps {
  conditions: ActiveCondition[]
  isDying?: boolean
  neglectStreak?: number
  variant: 'hud' | 'sheet'
}

interface ConditionTokenProps {
  description: string
  icon: GameIconName
  label: string
  tone?: 'critical' | 'warning'
  tooltipId: string
}

function ConditionToken({
  description,
  icon,
  label,
  tone = 'warning',
  tooltipId,
}: ConditionTokenProps) {
  return (
    <li className="velkhar-condition" data-tone={tone}>
      <span className="velkhar-condition__trigger" tabIndex={0} aria-describedby={tooltipId}>
        <GameIcon decorative name={icon} size={24} />
        <span>{label}</span>
      </span>
      <span className="velkhar-condition__tooltip" id={tooltipId} role="tooltip">
        {description}
      </span>
    </li>
  )
}

/** Backend-owned active conditions with keyboard-accessible mechanical tooltips. */
export function VelkharActiveConditions({
  conditions,
  isDying = false,
  neglectStreak = 0,
  variant,
}: VelkharActiveConditionsProps) {
  const currentLocale = useLocale()
  const locale: 'en' | 'fr' = currentLocale.startsWith('fr') ? 'fr' : 'en'
  const t = useTranslations('Session')
  const idPrefix = useId().replaceAll(':', '')
  const hasWarnings = isDying || neglectStreak > 0

  if (conditions.length === 0 && !hasWarnings) {
    if (variant === 'sheet') {
      return <p className="velkhar-session-window__muted">{t('noCondition')}</p>
    }

    return (
      <div className="velkhar-conditions velkhar-conditions--hud" data-empty="true">
        <span className="velkhar-conditions__label">{t('conditions')}</span>
        <p className="velkhar-conditions__empty">
          <GameIcon decorative name="shield" size={24} />
          <span>{t('noCondition')}</span>
        </p>
      </div>
    )
  }

  return (
    <div className={cn('velkhar-conditions', `velkhar-conditions--${variant}`)}>
      {variant === 'hud' ? (
        <span className="velkhar-conditions__label">{t('conditions')}</span>
      ) : null}
      <ul aria-label={t('activeConditionsLabel')}>
        {isDying ? (
          <ConditionToken
            description={t('dyingEffect')}
            icon="blood-drop"
            label={t('dying')}
            tone="critical"
            tooltipId={`${idPrefix}-dying`}
          />
        ) : null}
        {neglectStreak > 0 ? (
          <ConditionToken
            description={t('neglectEffect', { count: neglectStreak })}
            icon="hourglass"
            label={t('neglect', { count: neglectStreak })}
            tooltipId={`${idPrefix}-neglect`}
          />
        ) : null}
        {conditions.map((condition) => {
          const definition = getConditionDefinition(condition.id)
          if (!definition) return null

          return (
            <ConditionToken
              key={condition.id}
              description={`${definition.effect[locale]} ${t('conditionCure', {
                cure: definition.cure[locale],
              })}`}
              icon={CONDITION_ICONS[condition.id]}
              label={definition.name[locale]}
              tone={definition.disadvantage ? 'critical' : 'warning'}
              tooltipId={`${idPrefix}-${condition.id}`}
            />
          )
        })}
      </ul>
    </div>
  )
}
