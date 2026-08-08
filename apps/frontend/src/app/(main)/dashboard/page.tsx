import { getTranslations } from 'next-intl/server'

import { getViewerSummary } from '@/lib/viewer'

import { DashboardContent } from './_components/DashboardContent/DashboardContent'
import { createDashboardViewModel } from './_data/dashboard-view-model'

import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Dashboard')
  return { title: t('metadataTitle'), description: t('metadataDescription') }
}

export default async function DashboardPage() {
  const [viewer, t] = await Promise.all([getViewerSummary(), getTranslations('Dashboard')])
  const viewModel = createDashboardViewModel(viewer.tier, viewer.displayName, undefined, {
    traveler: t('traveler'),
    visitor: t('visitor'),
  })

  return <DashboardContent tier={viewer.tier} viewModel={viewModel} />
}
