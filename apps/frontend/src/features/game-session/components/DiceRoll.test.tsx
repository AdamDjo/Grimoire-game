import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DiceRoll } from './DiceRoll'

describe('DiceRoll', () => {
  it('explique le Désavantage et sa cause renvoyée par le backend', () => {
    render(
      <DiceRoll
        roll={{
          disadvantageCause: 'Wound',
          modifier: 2,
          roll: 4,
          rollMode: 'disadvantage',
          success: false,
          target: 13,
          total: 6,
        }}
      />
    )

    expect(screen.getByText('Disadvantage')).toBeInTheDocument()
    expect(screen.getByText('Cause: Wound')).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Dice roll result' })).toHaveAttribute(
      'data-roll-mode',
      'disadvantage'
    )
  })
})
