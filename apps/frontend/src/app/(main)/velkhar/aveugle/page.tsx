import { GameLink } from '@/components/ui/game-link'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GamePanel } from '@/components/ui/grimoire/GamePanel/GamePanel'

import type { Metadata } from 'next'

import './aveugle.css'

export const metadata: Metadata = {
  title: 'L’Auberge de L’Aveugle · GRIMOIRE',
}

interface AveuglePageProps {
  searchParams: Promise<{
    campaign?: string | string[]
    flow?: string | string[]
  }>
}

function getCharacterFlowHref(campaign: string | string[] | undefined): string {
  const campaignId = typeof campaign === 'string' ? campaign : undefined

  return campaignId
    ? `/velkhar/aveugle?flow=character-create&campaign=${encodeURIComponent(campaignId)}`
    : '/velkhar/aveugle?flow=character-create'
}

export default async function AveuglePage({ searchParams }: AveuglePageProps) {
  const { campaign, flow } = await searchParams
  const isCharacterFlow = flow === 'character-create'

  return (
    <main className="aveugle-threshold">
      <div className="aveugle-threshold__scene" aria-hidden="true" />
      <div className="aveugle-threshold__veil" aria-hidden="true" />

      <section className="aveugle-threshold__dialogue" aria-labelledby="aveugle-title">
        <p className="aveugle-threshold__location">Velkhar · L’Auberge de L’Aveugle</p>

        <GamePanel
          className="aveugle-threshold__panel"
          ornament="diamond"
          padding="lg"
          tone="gold"
          variant="main"
        >
          <div className="aveugle-threshold__speaker">
            <GameIcon decorative name={isCharacterFlow ? 'quill' : 'eye'} size={48} />
            <div>
              <p>{isCharacterFlow ? 'Le registre de L’Aveugle' : 'L’Aveugle'}</p>
              <h1 id="aveugle-title">
                {isCharacterFlow
                  ? 'Sous quel nom les sables te connaissent-ils ?'
                  : 'Chaque histoire commence ici.'}
              </h1>
            </div>
          </div>

          <blockquote>
            {isCharacterFlow
              ? '« Un nom d’abord. Puis nous verrons ce que la route a laissé dans ton regard. »'
              : '« Repose-toi, voyageur. Avant de franchir les portes de Velkhar, dis-moi qui tu es. »'}
          </blockquote>

          <p className="aveugle-threshold__copy">
            {isCharacterFlow
              ? 'Le registre s’ouvre sur la table. Ton personnage prendra forme ici, au fil de cette première conversation.'
              : 'L’Auberge est le seuil de chaque run. Vous pouvez commencer cette première conversation sans créer de compte.'}
          </p>

          <div className="aveugle-threshold__actions">
            {isCharacterFlow ? (
              <GameLink href="/dashboard" variant="secondary">
                Revenir aux Chroniques
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
    </main>
  )
}
