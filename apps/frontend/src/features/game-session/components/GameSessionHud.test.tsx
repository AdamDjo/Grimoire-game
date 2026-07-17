import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { GameSessionHud } from './GameSessionHud'

describe('GameSessionHud', () => {
  it('compose un footer avec les ressources fournies par un autre univers', async () => {
    const user = userEvent.setup()
    const openLoadout = vi.fn()

    render(
      <GameSessionHud
        label="Pilot status"
        resource={{ label: 'Credits', value: 420 }}
        statusBars={[
          { id: 'health', label: 'Health', max: 100, tone: 'danger', value: 72 },
          { id: 'shield', label: 'Shield', max: 50, tone: 'aqua', value: 30 },
        ]}
        statusGauges={[{ id: 'stress', label: 'Stress', max: 100, tone: 'ember', value: 25 }]}
        toolLabel="Pilot tools"
        tools={[{ id: 'loadout', label: 'Open loadout', onClick: openLoadout }]}
      />
    )

    expect(screen.getByRole('complementary', { name: 'Pilot status' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Health' })).toHaveAttribute(
      'aria-valuenow',
      '72'
    )
    expect(screen.getByRole('progressbar', { name: 'Stress' })).toHaveAttribute(
      'aria-valuenow',
      '25'
    )
    expect(screen.getByLabelText('Credits : 420')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open loadout' }))
    expect(openLoadout).toHaveBeenCalledTimes(1)
  })

  it('accepte un univers sans monnaie ni jauge circulaire', () => {
    render(
      <GameSessionHud
        label="Minimal status"
        statusBars={[{ id: 'health', label: 'Health points', max: 12, tone: 'danger', value: 12 }]}
        statusGauges={[]}
        tools={[]}
      />
    )

    const minimalHud = screen.getByRole('complementary', { name: 'Minimal status' })
    expect(minimalHud).toHaveAttribute('data-has-resource', 'false')
    expect(minimalHud).toHaveAttribute('data-has-gauges', 'false')
    expect(screen.queryByLabelText(/Credits/)).not.toBeInTheDocument()
  })
})
