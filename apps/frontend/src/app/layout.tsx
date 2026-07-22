import { Alegreya_Sans, Caveat, Cinzel, Cormorant_Garamond, EB_Garamond } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'

import { GlobalExperience } from '@/components/ui/global-experience'

import type { Metadata } from 'next'
import './globals.css'

const cinzel = Cinzel({
  variable: '--next-font-disp',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
})

const cormorantGaramond = Cormorant_Garamond({
  variable: '--next-font-accent',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  variable: '--next-font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const alegreyaSans = Alegreya_Sans({
  variable: '--next-font-ui',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const caveat = Caveat({
  variable: '--next-font-manuscript',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata')

  return {
    metadataBase: new URL('https://grimoire.game'),
    title: t('title'),
    description: t('description'),
    keywords: ['RPG', 'tabletop', 'AI', 'narrative', 'Velkhar', 'Grimoire'],
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={`${cinzel.variable} ${cormorantGaramond.variable} ${ebGaramond.variable} ${alegreyaSans.variable} ${caveat.variable}`}
    >
      <body>
        <NextIntlClientProvider>
          <GlobalExperience />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
