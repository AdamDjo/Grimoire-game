import { useTranslations } from 'next-intl'

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
  const t = useTranslations('Dashboard')

  return (
    <main className="dashboard-content">
      <header className="dashboard-content__intro">
        <p className="dashboard-content__welcome">
          {t('welcome', { name: viewModel.viewerLabel })}
        </p>
        <GameSectionHeading
          description={t('description')}
          eyebrow={t('eyebrow')}
          level={1}
          title={t('title')}
        />
      </header>

      <section className="dashboard-content__grid" aria-label={t('adventuresLabel')}>
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
              <p>{viewModel.activeRun ? viewModel.activeRun.progressLabel : t('noActiveRun')}</p>
              <h2>{viewModel.activeRun ? viewModel.activeRun.title : t('newTrace')}</h2>
            </div>
          </div>

          <p className="dashboard-content__copy">
            {viewModel.activeRun
              ? t('activeRunCopy', { activity: viewModel.activeRun.lastActivityLabel })
              : t('emptyRunCopy')}
          </p>

          <div className="dashboard-content__actions">
            {viewModel.activeRun ? (
              <GameLink
                href={`${WORLD_ROUTES.velkhar.campaign}/${viewModel.activeRun.campaignId}`}
                trailingIcon={<GameIcon decorative name="arrow" size={24} />}
              >
                {t('resumeStory')}
              </GameLink>
            ) : (
              <GameLink
                href={`${WORLD_ROUTES.velkhar.campaign}/nouvelle-chronique`}
                trailingIcon={<GameIcon decorative name="arrow" size={24} />}
              >
                {t('crossThreshold')}
              </GameLink>
            )}

            {tier === 'anonymous' ? (
              <GameLink href={getAuthHref('/login', '/dashboard')} size="sm" variant="ghost">
                {t('findTraces')}
              </GameLink>
            ) : null}
          </div>
        </GamePanel>

        <GamePanel as="section" padding="md" variant="sidebar">
          <div className="dashboard-content__panel-heading">
            <GameIcon decorative name="book" size={48} />
            <div>
              <p>{t('library')}</p>
              <h2>{t('recentChronicles')}</h2>
            </div>
          </div>

          {viewModel.recentChronicles.length === 0 ? (
            <div className="dashboard-content__empty">
              <p>{t('noChronicle')}</p>
              <span>{t('chronicleHint')}</span>
            </div>
          ) : null}
        </GamePanel>
      </section>

      <aside className="dashboard-content__boundary" aria-label={t('dashboardRole')}>
        <GameIcon decorative name="key" size={32} />
        <p>{t('boundary')}</p>
      </aside>
      {tier !== 'anonymous' ? <SignOutButton /> : null}
    </main>
  )
}
