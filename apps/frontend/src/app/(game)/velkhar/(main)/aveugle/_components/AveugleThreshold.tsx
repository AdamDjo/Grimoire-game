import { useTranslations } from 'next-intl'

import { GameLink } from '@/components/ui/game-link'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GameSceneLayout } from '@/components/ui/grimoire/GameSceneLayout/GameSceneLayout'

import {
  VelkharDormantHud,
  VelkharFlowTopBar,
} from '../../../_components/VelkharFlowChrome/VelkharFlowChrome'
import { VELKHAR_WORLD } from '../../../_config/velkhar-world'

import { VelkharMotionShell } from './velkhar-motion-shell'

interface AveugleThresholdProps {
  campaignId?: string
  transitionFromHome?: boolean
}

function getCharacterCreateHref(campaignId?: string): string {
  return campaignId
    ? `${VELKHAR_WORLD.routes.characterCreate}?campaign=${encodeURIComponent(campaignId)}`
    : VELKHAR_WORLD.routes.characterCreate
}

export function AveugleThreshold({
  campaignId,
  transitionFromHome = false,
}: AveugleThresholdProps) {
  const t = useTranslations('Auberge')
  const sessionT = useTranslations('Session')

  return (
    <VelkharMotionShell animateEntrance={transitionFromHome} className="aveugle-threshold">
      <GameSceneLayout
        background={
          <>
            <div className="aveugle-threshold__scene" data-velkhar-scene aria-hidden="true" />
            <div className="aveugle-threshold__veil" aria-hidden="true" />
          </>
        }
        bottom={<VelkharDormantHud />}
        className="aveugle-threshold__layout"
        reader={
          <section className="aveugle-threshold__dialogue" aria-labelledby="aveugle-title">
            <div className="aveugle-threshold__speaker" data-velkhar-enter>
              <GameIcon decorative name="eye" size={48} />
              <h1 id="aveugle-title">{t('blindOne')}</h1>
            </div>
            <blockquote data-velkhar-enter>{t('thresholdQuote')}</blockquote>
            <div className="aveugle-threshold__actions" data-velkhar-enter>
              <GameLink
                href={getCharacterCreateHref(campaignId)}
                trailingIcon={<GameIcon decorative name="arrow" size={24} />}
              >
                {t('answer')}
              </GameLink>
            </div>
          </section>
        }
        scene={
          <div className="aveugle-threshold__stage" data-velkhar-enter>
            <p className="aveugle-threshold__location">{t('thresholdLocation')}</p>
          </div>
        }
        top={<VelkharFlowTopBar location={t('innName')} region={sessionT('regionLabel')} />}
      />
    </VelkharMotionShell>
  )
}
