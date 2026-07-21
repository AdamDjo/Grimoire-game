import { getTranslations } from 'next-intl/server'

import { SystemState } from '@/components/system/SystemState/SystemState'

export default async function NotFound() {
  const t = await getTranslations('System')

  return (
    <SystemState
      eyebrow={t('notFoundEyebrow')}
      title={t('notFoundTitle')}
      body={t('notFoundBody')}
    />
  )
}
