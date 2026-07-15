import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { scrollToLandingAnchor } from '@/components/ui/scroll-to-landing-anchor'

import { HeroScrollCta } from './HeroScrollCta'

vi.mock('@/components/ui/scroll-to-landing-anchor', () => ({
  scrollToLandingAnchor: vi.fn(() => true),
}))

describe('HeroScrollCta', () => {
  it('confie la navigation vers la fin de la landing au moteur de scroll', async () => {
    const user = userEvent.setup()
    render(<HeroScrollCta href="#outro">Commencer une partie</HeroScrollCta>)

    await user.click(screen.getByRole('link', { name: 'Commencer une partie' }))

    expect(scrollToLandingAnchor).toHaveBeenCalledWith('#outro')
    expect(window.location.hash).toBe('')
  })
})
