import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { LandingExperience } from './LandingExperience'

// Le moteur de motion pilote GSAP sur une mise en page réelle ; jsdom n'en a aucune à lui offrir.
vi.mock('./use-landing-motion', () => ({ useLandingMotion: vi.fn() }))

describe('Landing', () => {
  it('pose les cinq plans derrière un seul h1', () => {
    const { container } = render(<LandingExperience />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(container.querySelectorAll('main > section')).toHaveLength(5)
  })

  it('fait pointer chaque ancre interne vers une cible qui existe', () => {
    const { container } = render(<LandingExperience />)

    const anchors = container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    expect(anchors.length).toBeGreaterThan(0)
    for (const anchor of anchors) {
      expect(container.querySelector(anchor.hash)).not.toBeNull()
    }
  })

  it("envoie un nouveau joueur à l'auberge depuis les deux appels à l'action", () => {
    render(<LandingExperience />)

    // Le seuil invite, l'outro conclut : deux libellés, une seule destination.
    const begin = screen.getByRole('link', { name: 'Begin' })
    const enter = screen.getByRole('link', { name: 'Enter the inn' })
    expect(begin).toHaveAttribute('href', '/velkhar/aveugle?transition=home')
    expect(enter).toHaveAttribute('href', '/velkhar/aveugle?transition=home')
  })

  it("reprend la partie en cours au lieu de renvoyer à l'auberge", () => {
    render(<LandingExperience resumeHref="/velkhar/session/active-session" />)

    const links = screen.getAllByRole('link', { name: 'Resume my game' })
    expect(links).toHaveLength(2)
    for (const link of links) {
      expect(link).toHaveAttribute('href', '/velkhar/session/active-session')
    }
    expect(screen.queryByRole('link', { name: 'Begin' })).toBeNull()
  })

  it('répond à un choix de démo sans bouger une seule jauge', async () => {
    const user = userEvent.setup()
    render(<LandingExperience />)

    const blood = screen.getByRole('progressbar', { name: /Blood/i })
    const before = blood.getAttribute('aria-valuenow')

    await user.click(screen.getByRole('button', { name: /Place a tooth/i }))

    // La démo ne doit jamais ressembler à un vrai tour : elle explique, elle ne résout rien.
    expect(screen.getByRole('status')).toHaveTextContent(/interface preview/i)
    expect(blood).toHaveAttribute('aria-valuenow', before ?? '')
  })

  it("garde l'action libre désactivée tant que rien n'est écrit", async () => {
    const user = userEvent.setup()
    render(<LandingExperience />)

    const submit = screen.getByRole('button', { name: 'Try this action' })
    expect(submit).toBeDisabled()

    await user.type(screen.getByRole('textbox', { name: 'Free action' }), 'I inspect the gate.')
    expect(submit).toBeEnabled()

    await user.click(submit)
    expect(screen.getByRole('status')).toHaveTextContent(/interface preview/i)
  })
})
