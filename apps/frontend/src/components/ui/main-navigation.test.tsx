import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MainNavigation } from './main-navigation'

const pathnameMock = vi.fn(() => '/dashboard')
const scrollToLandingAnchorMock = vi.fn((_href: string) => true)

vi.mock('next/navigation', () => ({
  usePathname: () => pathnameMock(),
}))

vi.mock('next/image', () => ({
  default: ({
    alt,
    fill: _fill,
    priority: _priority,
    unoptimized: _unoptimized,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean
    priority?: boolean
    unoptimized?: boolean
  }) => <img alt={alt} {...props} />,
}))

describe('MainNavigation', () => {
  beforeEach(() => {
    pathnameMock.mockReturnValue('/dashboard')
    scrollToLandingAnchorMock.mockClear()
    document.documentElement.style.overflow = ''
  })

  it('sépare le jeu de la navigation marketing', () => {
    render(<MainNavigation context="game" tier="anonymous" />)

    expect(screen.queryByRole('link', { name: 'Découvrir' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Chroniques' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'L’Auberge' })).toHaveAttribute(
      'href',
      '/velkhar/aveugle'
    )
    expect(screen.getByRole('link', { name: 'GRIMOIRE, accueil du jeu' })).toHaveAttribute(
      'href',
      '/velkhar/aveugle'
    )
  })

  it('expose les entrées du site uniquement en contexte marketing', async () => {
    const user = userEvent.setup()
    pathnameMock.mockReturnValue('/')
    render(<MainNavigation context="marketing" onAnchorNavigate={scrollToLandingAnchorMock} />)

    const discoverLink = screen.getByRole('link', { name: 'Découvrir' })
    expect(discoverLink).toHaveAttribute('href', '#velkhar')
    expect(screen.getByRole('link', { name: 'L’Auberge' })).toHaveAttribute(
      'href',
      '/velkhar/aveugle?transition=home'
    )
    expect(screen.getByRole('link', { name: 'GRIMOIRE, accueil du site' })).toHaveAttribute(
      'href',
      '/'
    )

    await user.click(discoverLink)
    expect(scrollToLandingAnchorMock).toHaveBeenCalledWith('#velkhar')
  })

  it('dirige le logo du jeu vers les Chroniques pour un compte', () => {
    render(<MainNavigation context="game" tier="free" />)

    expect(screen.getByRole('link', { name: 'GRIMOIRE, accueil du jeu' })).toHaveAttribute(
      'href',
      '/dashboard'
    )
  })

  it('verrouille le scroll et restaure le focus à la fermeture du menu', async () => {
    const user = userEvent.setup()
    render(<MainNavigation context="game" tier="anonymous" />)

    const trigger = screen.getByRole('button', { name: 'Ouvrir le menu' })
    await user.click(trigger)

    const dialog = screen.getByRole('dialog', { name: 'Menu du jeu' })
    expect(dialog).toBeInTheDocument()
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(within(dialog).getByRole('link', { name: 'L’Auberge' })).toHaveFocus()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog', { name: 'Menu du jeu' })).not.toBeInTheDocument()
    expect(document.documentElement.style.overflow).toBe('')
    expect(trigger).toHaveFocus()
  })
})
