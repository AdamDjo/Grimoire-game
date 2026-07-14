import { MainNavigation } from '@/components/ui/main-navigation'
import { getViewerSummary } from '@/lib/viewer'

import type { ReactNode } from 'react'

import './main-layout.css'

export default async function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  const viewer = await getViewerSummary()

  return (
    <div className="main-shell">
      <MainNavigation hasAccount={viewer.hasAccount} />
      <div className="main-shell__grain" aria-hidden="true" />
      {children}
    </div>
  )
}
