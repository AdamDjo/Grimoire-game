import type { ViewerTier } from '@/lib/viewer'

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

export interface DashboardSnapshot {
  activeRun: DashboardRunViewModel | null
  recentChronicles: readonly []
}

const EMPTY_DASHBOARD_SNAPSHOT: DashboardSnapshot = {
  activeRun: null,
  recentChronicles: [],
}

export function createDashboardViewModel(
  tier: ViewerTier,
  displayName: string | null,
  snapshot: DashboardSnapshot = EMPTY_DASHBOARD_SNAPSHOT,
  labels: { traveler: string; visitor: string } = { traveler: 'Voyageur', visitor: 'Visiteur' }
): DashboardViewModel {
  return {
    activeRun: snapshot.activeRun,
    recentChronicles: snapshot.recentChronicles,
    viewerLabel: displayName ?? (tier === 'anonymous' ? labels.visitor : labels.traveler),
  }
}
