import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { GameplayStatsBar } from './GameplayStatsBar'

// Les libellés viennent du namespace i18n `Attributes` via une clé dynamique
// `attributes(stat.labelKey)` : TypeScript ne peut pas la vérifier. Ce test est
// le seul garde-fou contre une désynchronisation entre le canon (#264, triptyque
// Sang / Souffle / Volonté) et les fichiers de messages.
describe('GameplayStatsBar', () => {
  it('renders the canon attribute triptych', () => {
    render(<GameplayStatsBar />)

    expect(screen.getByText('Blood')).toBeInTheDocument()
    expect(screen.getByText('Breath')).toBeInTheDocument()
    expect(screen.getByText('Will')).toBeInTheDocument()
  })

  it('no longer exposes the renamed CENDRE attribute', () => {
    render(<GameplayStatsBar />)

    expect(screen.queryByText('Ash')).not.toBeInTheDocument()
  })
})
