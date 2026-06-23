'use client'

import { Compass, Eye, Globe } from 'lucide-react'

import { Footer } from '@/components/ui/Footer'

const FOOTER_LINKS = ['Accueil', 'Univers', 'Règles', 'Communauté', 'FAQ', 'Contact'].map(
  (label) => ({ label, href: '#' })
)

const FOOTER_ACTIONS = [
  { icon: <Compass size={15} />, label: 'Carte du monde' },
  { icon: <Eye size={15} />, label: 'Voir le lore' },
  { icon: <Globe size={15} />, label: 'Changer de langue' },
]

export function FooterSection() {
  return (
    <Footer
      copyright="© 2024 — Tous droits réservés"
      links={FOOTER_LINKS}
      actions={FOOTER_ACTIONS}
    />
  )
}
