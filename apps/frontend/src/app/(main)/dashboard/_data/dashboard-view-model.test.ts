import { describe, expect, it } from 'vitest'

import { createDashboardViewModel } from './dashboard-view-model'

describe('dashboard view model', () => {
  it('does not invent a run from the viewer tier', () => {
    expect(createDashboardViewModel('premium', 'Adem').activeRun).toBeNull()
    expect(createDashboardViewModel('free', null).activeRun).toBeNull()
  })

  it('uses a stable anonymous label', () => {
    expect(createDashboardViewModel('anonymous', null).viewerLabel).toBe('Visiteur')
  })

  it('can expose an anonymous run supplied by the data adapter', () => {
    const viewModel = createDashboardViewModel('anonymous', null, {
      activeRun: {
        campaignId: 'cendre-veille',
        lastActivityLabel: 'À l’instant',
        progressLabel: 'Run en cours',
        title: 'Le chemin demeure ouvert',
      },
      recentChronicles: [],
    })

    expect(viewModel.activeRun?.campaignId).toBe('cendre-veille')
  })
})
