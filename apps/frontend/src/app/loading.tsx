import { getTranslations } from 'next-intl/server'

import { LoadingExperience } from './_components/LoadingExperience/LoadingExperience'

export default async function Loading() {
  const t = await getTranslations('System')

  return (
    <LoadingExperience
      eyebrow={t('loadingEyebrow')}
      title={t('loadingTitle')}
      body={t('loadingBody')}
    />
  )
}
