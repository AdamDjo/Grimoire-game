import { WORLD_ROUTES } from '@/config/worlds'

export type CampaignResumeStage = 'character-create' | 'inn' | 'session'

export interface CampaignResumeSnapshot {
  campaignId: string
  sessionId?: string
  stage: CampaignResumeStage
}

const CAMPAIGN_FIXTURES: Record<string, CampaignResumeSnapshot> = {
  'cendre-veille': {
    campaignId: 'cendre-veille',
    sessionId: 'resume',
    stage: 'session',
  },
  'nouvelle-chronique': {
    campaignId: 'nouvelle-chronique',
    stage: 'character-create',
  },
  'retour-aveugle': {
    campaignId: 'retour-aveugle',
    stage: 'inn',
  },
}

/** Fixture adapter until a read-only campaign contract is available. */
export function getCampaignResumeSnapshot(campaignId: string): CampaignResumeSnapshot | null {
  return CAMPAIGN_FIXTURES[campaignId] ?? null
}

export function resolveCampaignDestination(snapshot: CampaignResumeSnapshot): string {
  const campaign = encodeURIComponent(snapshot.campaignId)

  if (snapshot.stage === 'session' && snapshot.sessionId) {
    return `${WORLD_ROUTES.velkhar.session}/${encodeURIComponent(snapshot.sessionId)}`
  }

  if (snapshot.stage === 'character-create') {
    return `${WORLD_ROUTES.velkhar.aveugle}?flow=character-create&campaign=${campaign}`
  }

  return `${WORLD_ROUTES.velkhar.aveugle}?campaign=${campaign}`
}
