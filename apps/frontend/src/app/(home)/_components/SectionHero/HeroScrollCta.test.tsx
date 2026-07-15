import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { scrollToAnchor } from '../LandingChrome/scroll-to-anchor'

import { HeroScrollCta } from './HeroScrollCta'

vi.mock('../LandingChrome/scroll-to-anchor', () => ({
  scrollToAnchor: vi.fn(() => true),
}))

describe('HeroScrollCta', () => {
  it('confie la navigation vers la fin de la landing au moteur de scroll', async () => {
    const user = userEvent.setup()
    render(<HeroScrollCta href="#outro">Commencer une partie</HeroScrollCta>)

    await user.click(screen.getByRole('link', { name: 'Commencer une partie' }))

    expect(scrollToAnchor).toHaveBeenCalledWith('#outro')
    expect(window.location.hash).toBe('')
  })
})
