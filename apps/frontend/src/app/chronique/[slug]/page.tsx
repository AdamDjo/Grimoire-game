import { ChroniclePublicPage } from './ChroniclePublicPage'

import type { Metadata } from 'next'

import '@/features/chronicle/chronicle.css'

interface ChroniclePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ChroniclePageProps): Promise<Metadata> {
  const { slug } = await params
  const canonical = `/chronique/${encodeURIComponent(slug)}`

  return {
    title: 'Une Chronique de Velkhar | GRIMOIRE',
    description: 'Le récit d’une route parcourue dans Velkhar, conservé par le Grimoire.',
    alternates: { canonical },
    openGraph: {
      title: 'Une Chronique de Velkhar',
      description: 'Une trace laissée dans le monde de GRIMOIRE.',
      images: [{ url: '/scenes/doigt-casse-session.webp', alt: 'Les cendres de Velkhar' }],
      type: 'article',
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Une Chronique de Velkhar',
      description: 'Une trace laissée dans le monde de GRIMOIRE.',
      images: ['/scenes/doigt-casse-session.webp'],
    },
  }
}

export default async function ChroniclePage({ params }: ChroniclePageProps) {
  const { slug } = await params
  return <ChroniclePublicPage slug={slug} />
}
