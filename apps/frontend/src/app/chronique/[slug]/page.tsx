import { getTranslations } from 'next-intl/server'

import { ChroniclePublicPage } from './ChroniclePublicPage'

import type { Metadata } from 'next'

import '@/features/chronicle/chronicle.css'

interface ChroniclePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ChroniclePageProps): Promise<Metadata> {
  const t = await getTranslations('Chronicle')
  const { slug } = await params
  const canonical = `/chronique/${encodeURIComponent(slug)}`

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: { canonical },
    openGraph: {
      title: t('socialTitle'),
      description: t('socialDescription'),
      images: [{ url: '/scenes/doigt-casse-session.webp', alt: t('socialImageAlt') }],
      type: 'article',
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('socialTitle'),
      description: t('socialDescription'),
      images: ['/scenes/doigt-casse-session.webp'],
    },
  }
}

export default async function ChroniclePage({ params }: ChroniclePageProps) {
  const { slug } = await params
  return <ChroniclePublicPage slug={slug} />
}
