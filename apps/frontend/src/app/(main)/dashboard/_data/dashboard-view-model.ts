export interface DashboardRunViewModel {
  campaignId: string
  lastActivityLabel: string
  progressLabel: string
  title: string
}

export interface DashboardViewModel {
  activeRun: DashboardRunViewModel | null
  recentChronicles: readonly []
  viewerLabel: string
}

export function createDashboardViewModel(
  hasAccount: boolean,
  displayName: string | null
): DashboardViewModel {
  return {
    activeRun: hasAccount
      ? {
          campaignId: 'cendre-veille',
          lastActivityLabel: 'Dernière trace conservée',
          progressLabel: 'Run en cours',
          title: 'Le chemin demeure ouvert',
        }
      : null,
    recentChronicles: [],
    viewerLabel: displayName ?? (hasAccount ? 'Voyageur' : 'Visiteur'),
  }
}
