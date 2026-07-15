import { GameLink } from '@/components/ui/game-link'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GamePanel } from '@/components/ui/grimoire/GamePanel/GamePanel'
import { VelkharMotionShell } from '@/components/ui/velkhar-motion-shell'

import type { Metadata } from 'next'

import './aveugle.css'

export const metadata: Metadata = {
  title: 'L’Auberge de L’Aveugle · GRIMOIRE',
}

interface AveuglePageProps {
  searchParams: Promise<{
    campaign?: string | string[]
    character?: string | string[]
    flow?: string | string[]
    transition?: string | string[]
  }>
}

function getCharacterFlowHref(campaign: string | string[] | undefined): string {
  const campaignId = typeof campaign === 'string' ? campaign : undefined

  return campaignId
    ? `/velkhar/aveugle?flow=character-create&campaign=${encodeURIComponent(campaignId)}`
    : '/velkhar/aveugle?flow=character-create'
}

function getCharacterCreateHref(campaign: string | string[] | undefined): string {
  const campaignId = typeof campaign === 'string' ? campaign : undefined

  return campaignId
    ? `/velkhar/character-create?campaign=${encodeURIComponent(campaignId)}`
    : '/velkhar/character-create'
}

export default async function AveuglePage({ searchParams }: AveuglePageProps) {
  const { campaign, character, flow, transition } = await searchParams
  const isCharacterFlow = flow === 'character-create'
  const isCharacterReady = character === 'ready'

  return (
    <VelkharMotionShell animateEntrance={transition === 'home'} className="aveugle-threshold">
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
            <GameIcon
              decorative
              name={isCharacterReady ? 'scroll' : isCharacterFlow ? 'quill' : 'eye'}
              size={48}
            />
            <div>
              <p>
                {isCharacterFlow || isCharacterReady ? 'Le registre de L’Aveugle' : 'L’Aveugle'}
              </p>
              <h1 id="aveugle-title">
                {isCharacterReady
                  ? 'Le registre porte désormais ton nom.'
                  : isCharacterFlow
                    ? 'Sous quel nom les sables te connaissent-ils ?'
                    : 'Chaque histoire commence ici.'}
              </h1>
            </div>
          </div>

          <blockquote data-velkhar-enter>
            {isCharacterReady
              ? '« Bien. Les sables sauront qui marche sur eux. Lorsque tu seras prêt, la porte s’ouvrira. »'
              : isCharacterFlow
                ? '« Un nom d’abord. Puis nous verrons ce que la route a laissé dans ton regard. »'
                : '« Repose-toi, voyageur. Avant de franchir les portes de Velkhar, dis-moi qui tu es. »'}
          </blockquote>

          <p className="aveugle-threshold__copy" data-velkhar-enter>
            {isCharacterReady
              ? 'Ton personnage est revenu auprès de L’Aveugle. La prochaine action peut maintenant ouvrir le run.'
              : isCharacterFlow
                ? 'Le registre s’ouvre sur la table. Ton personnage prendra forme ici, au fil de cette première conversation.'
                : 'L’Auberge est le seuil de chaque run. Vous pouvez commencer cette première conversation sans créer de compte.'}
          </p>

          <div className="aveugle-threshold__actions" data-velkhar-enter>
            {isCharacterReady ? (
              <GameLink
                href="/velkhar/session/new"
                trailingIcon={<GameIcon decorative name="arrow" size={24} />}
              >
                Franchir la porte
              </GameLink>
            ) : isCharacterFlow ? (
              <GameLink
                href={getCharacterCreateHref(campaign)}
                trailingIcon={<GameIcon decorative name="arrow" size={24} />}
              >
                Ouvrir le registre
              </GameLink>
            ) : (
              <GameLink
                href={getCharacterFlowHref(campaign)}
                trailingIcon={<GameIcon decorative name="arrow" size={24} />}
              >
                Répondre à L’Aveugle
              </GameLink>
            )}
          </div>
        </GamePanel>
      </section>
    </VelkharMotionShell>
  )
}
