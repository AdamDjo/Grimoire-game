import { describe, expect, it } from 'vitest'

import {
  getCampaignResumeSnapshot,
  resolveCampaignDestination,
  type CampaignResumeSnapshot,
} from './campaign-resume'

describe('campaign resume adapter', () => {
  it('resolves an active run to the session route', () => {
    const snapshot = getCampaignResumeSnapshot('cendre-veille')

    expect(snapshot && resolveCampaignDestination(snapshot)).toBe('/velkhar/session/resume')
  })

  it.each<CampaignResumeSnapshot>([
    { campaignId: 'new', stage: 'character-create' },
    { campaignId: 'known', stage: 'inn' },
  ])('routes the $stage state to its useful destination', (snapshot) => {
    const destination = resolveCampaignDestination(snapshot)
    const expected =
      snapshot.stage === 'character-create'
        ? '/velkhar/character-create?campaign=new'
        : '/velkhar/aveugle?campaign=known'

    expect(destination).toBe(expected)
  })

  it('returns null for a campaign unavailable to the client', () => {
    expect(getCampaignResumeSnapshot('inconnue')).toBeNull()
  })
})
