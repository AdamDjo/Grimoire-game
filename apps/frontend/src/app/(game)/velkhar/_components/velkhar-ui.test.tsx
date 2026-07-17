import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CalamineMeter } from './CalamineMeter/CalamineMeter'
import { SurvieGauge } from './SurvieGauge/SurvieGauge'
import { VocationEmblem } from './VocationEmblem/VocationEmblem'

describe('Velkhar UI', () => {
  it('compose les jauges de survie propres à Velkhar', () => {
    render(
      <>
        <CalamineMeter max={100} value={32} />
        <SurvieGauge
          faim={{ value: 60, max: 100 }}
          fatigue={{ value: 45, max: 100 }}
          soif={{ value: 78, max: 100 }}
        />
      </>
    )

    expect(screen.getByRole('progressbar', { name: 'Calamine' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Survie' })).toBeInTheDocument()
  })

  it('expose un symbole de vocation accessible ou décoratif', () => {
    const { rerender } = render(<VocationEmblem name="marcheur-du-sel" />)
    expect(screen.getByRole('img', { name: 'Symbole du Marcheur-du-Sel' })).toBeInTheDocument()

    rerender(<VocationEmblem decorative name="lame-ombre" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
