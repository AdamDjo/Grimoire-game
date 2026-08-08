import { getTranslations } from 'next-intl/server'

import { SystemState } from '@/components/system/SystemState/SystemState'

export default async function Loading() {
  const t = await getTranslations('System')

  return (
    <SystemState
      eyebrow={t('loadingEyebrow')}
      title={t('loadingTitle')}
      body={t('loadingBody')}
      isLoading
    />
  )
}
