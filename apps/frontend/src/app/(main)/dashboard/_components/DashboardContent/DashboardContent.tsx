import { GameLink } from '@/components/ui/game-link'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GamePanel } from '@/components/ui/grimoire/GamePanel/GamePanel'
import { GameSectionHeading } from '@/components/ui/grimoire/GameSectionHeading/GameSectionHeading'
import { WORLD_ROUTES } from '@/config/worlds'
import { SignOutButton } from '@/features/auth/components/SignOutButton/SignOutButton'
import { getAuthHref } from '@/lib/internal-navigation'

import type { DashboardViewModel } from '../../_data/dashboard-view-model'
import type { ViewerTier } from '@/lib/viewer'

import './dashboard-content.css'

interface DashboardContentProps {
  tier: ViewerTier
  viewModel: DashboardViewModel
}

export function DashboardContent({ tier, viewModel }: DashboardContentProps) {
  return (
    <main className="dashboard-content">
      <header className="dashboard-content__intro">
        <p className="dashboard-content__welcome">Bienvenue, {viewModel.viewerLabel}</p>
        <GameSectionHeading
          description="Reprenez une trace existante ou franchissez à nouveau le seuil de L’Aveugle."
          eyebrow="Le monde se souvient"
          level={1}
          title="Vos Chroniques"
        />
      </header>

      <section className="dashboard-content__grid" aria-label="Accès à vos aventures">
        <GamePanel
          as="article"
          className="dashboard-content__resume"
          ornament="diamond"
          padding="md"
          tone={viewModel.activeRun ? 'gold' : 'neutral'}
          variant="main"
        >
          <div className="dashboard-content__panel-heading">
            <GameIcon decorative name={viewModel.activeRun ? 'fire' : 'footprint'} size={48} />
            <div>
              <p>{viewModel.activeRun ? viewModel.activeRun.progressLabel : 'Aucun run actif'}</p>
              <h2>
                {viewModel.activeRun
                  ? viewModel.activeRun.title
                  : 'Une nouvelle trace attend d’être laissée'}
              </h2>
            </div>
          </div>

          <p className="dashboard-content__copy">
            {viewModel.activeRun
              ? `${viewModel.activeRun.lastActivityLabel}. La reprise vous reconduira directement à la scène active.`
              : 'Le premier run reste accessible sans compte. L’Auberge demeure l’unique point de départ.'}
          </p>

          <div className="dashboard-content__actions">
            {viewModel.activeRun ? (
              <GameLink
                href={`${WORLD_ROUTES.velkhar.campaign}/${viewModel.activeRun.campaignId}`}
                trailingIcon={<GameIcon decorative name="arrow" size={24} />}
              >
                Reprendre le récit
              </GameLink>
            ) : (
              <GameLink
                href={`${WORLD_ROUTES.velkhar.campaign}/nouvelle-chronique`}
                trailingIcon={<GameIcon decorative name="arrow" size={24} />}
              >
                Franchir le seuil
              </GameLink>
            )}

            {tier === 'anonymous' ? (
              <GameLink href={getAuthHref('/login', '/dashboard')} size="sm" variant="ghost">
                Retrouver mes traces
              </GameLink>
            ) : null}
          </div>
        </GamePanel>

        <GamePanel as="section" padding="md" variant="sidebar">
          <div className="dashboard-content__panel-heading">
            <GameIcon decorative name="book" size={48} />
            <div>
              <p>Bibliothèque</p>
              <h2>Chroniques récentes</h2>
            </div>
          </div>

          {viewModel.recentChronicles.length === 0 ? (
            <div className="dashboard-content__empty">
              <p>Aucune Chronique n’est encore consignée.</p>
              <span>Chaque run achevé laissera ici son récit.</span>
            </div>
          ) : null}
        </GamePanel>
      </section>

      <aside className="dashboard-content__boundary" aria-label="Rôle du Dashboard">
        <GameIcon decorative name="key" size={32} />
        <p>
          Le Dashboard retrouve vos traces. L’Auberge de L’Aveugle reste le seul hub entre les runs.
        </p>
      </aside>
      {tier !== 'anonymous' ? <SignOutButton /> : null}
    </main>
  )
}
