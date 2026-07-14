import { describe, expect, it } from 'vitest'

import { createDashboardViewModel } from './dashboard-view-model'

describe('dashboard view model', () => {
  it('exposes the resume fixture only to an account view', () => {
    expect(createDashboardViewModel(true, 'Adem').activeRun?.campaignId).toBe('cendre-veille')
    expect(createDashboardViewModel(false, null).activeRun).toBeNull()
  })

  it('uses a stable anonymous label', () => {
    expect(createDashboardViewModel(false, null).viewerLabel).toBe('Visiteur')
  })
})
