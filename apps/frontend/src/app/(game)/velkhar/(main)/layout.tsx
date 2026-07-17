import { MainShell } from '@/components/system/MainShell/MainShell'

import type { ReactNode } from 'react'

export default function VelkharMainLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <MainShell>{children}</MainShell>
}
