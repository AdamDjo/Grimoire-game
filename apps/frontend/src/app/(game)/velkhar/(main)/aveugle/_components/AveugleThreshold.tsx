import { useTranslations } from 'next-intl'

import { GameLink } from '@/components/ui/game-link'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GamePanel } from '@/components/ui/grimoire/GamePanel/GamePanel'

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

  return (
    <VelkharMotionShell animateEntrance={transitionFromHome} className="aveugle-threshold">
      <div className="aveugle-threshold__scene" data-velkhar-scene aria-hidden="true" />
      <div className="aveugle-threshold__veil" aria-hidden="true" />

      <section className="aveugle-threshold__dialogue" aria-labelledby="aveugle-title">
        <p className="aveugle-threshold__location" data-velkhar-enter>
          {t('thresholdLocation')}
        </p>

        <GamePanel
          className="aveugle-threshold__panel"
          data-velkhar-frame
          padding="none"
          tone="gold"
          variant="dialogue-frame"
        >
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
        </GamePanel>
      </section>
    </VelkharMotionShell>
  )
}
