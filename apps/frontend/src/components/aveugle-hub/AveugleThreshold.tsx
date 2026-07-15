import { GameLink } from '@/components/ui/game-link'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GamePanel } from '@/components/ui/grimoire/GamePanel/GamePanel'
import { VelkharMotionShell } from '@/components/ui/velkhar-motion-shell'

interface AveugleThresholdProps {
  campaignId?: string
  isCharacterFlow?: boolean
  transitionFromHome?: boolean
}

function getCharacterFlowHref(campaignId?: string): string {
  return campaignId
    ? `/velkhar/aveugle?flow=character-create&campaign=${encodeURIComponent(campaignId)}`
    : '/velkhar/aveugle?flow=character-create'
}

function getCharacterCreateHref(campaignId?: string): string {
  return campaignId
    ? `/velkhar/character-create?campaign=${encodeURIComponent(campaignId)}`
    : '/velkhar/character-create'
}

export function AveugleThreshold({
  campaignId,
  isCharacterFlow = false,
  transitionFromHome = false,
}: AveugleThresholdProps) {
  return (
    <VelkharMotionShell animateEntrance={transitionFromHome} className="aveugle-threshold">
      <div className="aveugle-threshold__scene" data-velkhar-scene aria-hidden="true" />
      <div className="aveugle-threshold__veil" aria-hidden="true" />

      <section className="aveugle-threshold__dialogue" aria-labelledby="aveugle-title">
        <p className="aveugle-threshold__location" data-velkhar-enter>
          Velkhar · L’Auberge de L’Aveugle
        </p>
        <div className="aveugle-threshold__portrait" data-velkhar-enter aria-hidden="true" />

        <GamePanel
          className="aveugle-threshold__panel"
          data-velkhar-frame
          padding="none"
          tone="gold"
          variant="aveugle-dialogue"
        >
          <div className="aveugle-threshold__speaker" data-velkhar-enter>
            <GameIcon decorative name={isCharacterFlow ? 'quill' : 'eye'} size={48} />
            <h1 id="aveugle-title">{isCharacterFlow ? 'Le registre de L’Aveugle' : 'L’Aveugle'}</h1>
          </div>

          <blockquote data-velkhar-enter>
            {isCharacterFlow
              ? '« Un nom d’abord. Le reste viendra sur la route. »'
              : '« Approche, voyageur. Avant la route, donne-moi ton nom. »'}
          </blockquote>

          <div className="aveugle-threshold__actions" data-velkhar-enter>
            <GameLink
              href={
                isCharacterFlow
                  ? getCharacterCreateHref(campaignId)
                  : getCharacterFlowHref(campaignId)
              }
              trailingIcon={<GameIcon decorative name="arrow" size={24} />}
            >
              {isCharacterFlow ? 'Donner mon nom' : 'Répondre'}
            </GameLink>
          </div>
        </GamePanel>
      </section>
    </VelkharMotionShell>
  )
}
