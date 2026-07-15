import { Alegreya_Sans, Caveat, Cinzel, Cormorant_Garamond, EB_Garamond } from 'next/font/google'

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

export const metadata: Metadata = {
  title: 'GRIMOIRE - Of Ash and Salt',
  description:
    'GRIMOIRE est un roguelike narratif par IA. Explore Velkhar, fais des choix libres, lance les des aux pivots et laisse une trace dans un monde qui se souvient.',
  keywords: ['RPG', 'tabletop', 'AI', 'narrative', 'Velkhar', 'Grimoire'],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${cinzel.variable} ${cormorantGaramond.variable} ${ebGaramond.variable} ${alegreyaSans.variable} ${caveat.variable}`}
    >
      <body>
        <GlobalExperience />
        {children}
      </body>
    </html>
  )
}
