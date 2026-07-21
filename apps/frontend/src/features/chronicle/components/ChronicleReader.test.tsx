import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ChronicleReader } from './ChronicleReader'

import type { ChronicleView } from '../model/chronicle.types'

const CHRONICLE: ChronicleView = {
  bodyMarkdown:
    'Le sel gardait le silence.\n\n## Le dernier seuil\n\n> Personne ne revient intact.',
  createdAt: '2026-07-17T00:00:00.000Z',
  endReason: 'death',
  keyMoments: [{ label: 'Le puits sans fond', sceneRef: 3 }],
  mood: 'melancholic',
  slug: 'les-cendres-du-puits',
  tagline: 'Toute route laisse une marque.',
  title: 'Les cendres du puits',
}

describe('ChronicleReader', () => {
  afterEach(() => vi.restoreAllMocks())

  it('rend la hiérarchie éditoriale, le fallback d’ambiance et les sorties', () => {
    render(<ChronicleReader chronicle={CHRONICLE} />)

    expect(screen.getByRole('heading', { level: 1, name: CHRONICLE.title })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Le dernier seuil' })).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'melancholic illustration of Velkhar' })
    ).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Defining moments' })).toHaveTextContent(
      'Le puits sans fond'
    )
    expect(screen.getByRole('link', { name: 'Return to The Blind One' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Create a new character' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Find my journeys' })).toBeInTheDocument()
  })

  it('copie le lien public avec un retour explicite', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    render(<ChronicleReader chronicle={CHRONICLE} />)

    await user.click(screen.getByRole('button', { name: 'Copy link' }))

    expect(writeText).toHaveBeenCalledWith(window.location.href)
    expect(screen.getByRole('button', { name: 'Link copied' })).toBeInTheDocument()
  })

  it('ne propose pas de partage inline avant attribution du slug public', () => {
    render(<ChronicleReader chronicle={{ ...CHRONICLE, slug: undefined }} inline />)

    expect(screen.queryByLabelText('Share this Chronicle')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Keep this journey for free' })).toBeInTheDocument()
  })
})
