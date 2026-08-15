import { Alegreya, IM_Fell_French_Canon_SC } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'

import { GlobalExperience } from '@/components/ui/global-experience'

import type { Metadata } from 'next'
import './globals.css'

const fellFrenchDisplay = IM_Fell_French_Canon_SC({
  variable: '--next-font-display',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const alegreyaText = Alegreya({
  variable: '--next-font-text',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
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
    <html lang={locale} className={`${fellFrenchDisplay.variable} ${alegreyaText.variable}`}>
      <body>
        <NextIntlClientProvider>
          <GlobalExperience />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
