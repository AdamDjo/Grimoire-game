import { IM_Fell_English, IM_Fell_English_SC } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'

import { GlobalExperience } from '@/components/ui/global-experience'

import type { Metadata } from 'next'
import './globals.css'

const fellEnglishDisplay = IM_Fell_English_SC({
  variable: '--next-font-display',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

const fellEnglishText = IM_Fell_English({
  variable: '--next-font-text',
  subsets: ['latin'],
  weight: '400',
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
    <html lang={locale} className={`${fellEnglishDisplay.variable} ${fellEnglishText.variable}`}>
      <body>
        <NextIntlClientProvider>
          <GlobalExperience />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
