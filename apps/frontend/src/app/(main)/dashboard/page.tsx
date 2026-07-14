import { getViewerSummary } from '@/lib/viewer'

import { DashboardContent } from './_components/DashboardContent/DashboardContent'
import { createDashboardViewModel } from './_data/dashboard-view-model'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vos Chroniques · GRIMOIRE',
  description: 'Reprenez un run actif ou franchissez le seuil de Velkhar.',
}

export default async function DashboardPage() {
  const viewer = await getViewerSummary()
  const viewModel = createDashboardViewModel(viewer.hasAccount, viewer.displayName)

  return <DashboardContent hasAccount={viewer.hasAccount} viewModel={viewModel} />
}
