import { MainShell } from '@/components/system/MainShell/MainShell'

import type { ReactNode } from 'react'

export default function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <MainShell>{children}</MainShell>
}
