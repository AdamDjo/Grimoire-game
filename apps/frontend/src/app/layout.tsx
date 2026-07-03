import { Cinzel, EB_Garamond, Outfit } from 'next/font/google'

import type { Metadata } from 'next'
import './globals.css'

const cinzel = Cinzel({
  variable: '--next-font-disp',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  variable: '--next-font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const outfit = Outfit({
  variable: '--next-font-ui',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GRIMOIRE - Jeu de role IA narratif dans le monde de Velkhar',
  description:
    'GRIMOIRE est un roguelike narratif par IA. Explore Velkhar, fais des choix libres, lance les des aux pivots et laisse une trace dans un monde qui se souvient.',
  keywords: ['RPG', 'tabletop', 'AI', 'narrative', 'Velkhar', 'Grimoire'],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${ebGaramond.variable} ${outfit.variable}`}>
      <body>
        {/* Fond global du site : motif géométrique doré sur cosmos noir.
            Posé en -z-10 pour ne jamais laisser apparaître le noir du <body>
            entre les sections. Section1/Section2 le masquent avec leurs propres
            visuels (vidéo, canvas, frame_096) ; les sections suivantes s'en
            servent comme ambiance commune. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/home/background.jpg)' }}
        />
        {children}
      </body>
    </html>
  )
}
