import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MainNavigation } from './main-navigation'

const pathnameMock = vi.fn(() => '/dashboard')
const scrollToLandingAnchorMock = vi.fn((_href: string) => true)

vi.mock('next/navigation', () => ({
  usePathname: () => pathnameMock(),
  useRouter: () => ({ refresh: vi.fn() }),
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

    expect(screen.queryByRole('link', { name: 'Discover' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Chronicles' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'The Inn' })).toHaveAttribute(
      'href',
      '/velkhar/aveugle'
    )
    expect(screen.getByRole('link', { name: 'GRIMOIRE, game home' })).toHaveAttribute(
      'href',
      '/velkhar/aveugle'
    )
  })

  it('expose les entrées du site uniquement en contexte marketing', async () => {
    const user = userEvent.setup()
    pathnameMock.mockReturnValue('/')
    render(<MainNavigation context="marketing" onAnchorNavigate={scrollToLandingAnchorMock} />)

    const discoverLink = screen.getByRole('link', { name: 'Discover' })
    expect(discoverLink).toHaveAttribute('href', '#velkhar')
    expect(screen.getByRole('link', { name: 'Gameplay' })).toHaveAttribute('href', '#gameplay')
    expect(screen.getByRole('link', { name: 'World' })).toHaveAttribute('href', '#world')
    expect(screen.queryByRole('link', { name: 'Chronicles' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'The Inn' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GRIMOIRE, site home' })).toHaveAttribute('href', '/')

    await user.click(discoverLink)
    expect(scrollToLandingAnchorMock).toHaveBeenCalledWith('#velkhar')
  })

  it('dirige le logo du jeu vers les Chroniques pour un compte', () => {
    render(<MainNavigation context="game" tier="free" />)

    expect(screen.getByRole('link', { name: 'GRIMOIRE, game home' })).toHaveAttribute(
      'href',
      '/dashboard'
    )
  })

  it('met en avant la reprise lorsqu’une session active existe', () => {
    render(<MainNavigation context="game" resumeHref="/velkhar/session/resume" tier="anonymous" />)

    expect(screen.getByRole('link', { name: 'Resume game' })).toHaveAttribute(
      'href',
      '/velkhar/session/resume'
    )
    expect(screen.getByRole('link', { name: 'Resume game' })).toHaveClass(
      'main-navigation__priority-link'
    )
  })

  it('verrouille le scroll et restaure le focus à la fermeture du menu', async () => {
    const user = userEvent.setup()
    render(<MainNavigation context="game" tier="anonymous" />)

    const trigger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(trigger)

    const dialog = screen.getByRole('dialog', { name: 'Game menu' })
    expect(dialog).toBeInTheDocument()
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(within(dialog).getByRole('link', { name: 'The Inn' })).toHaveFocus()
    expect(within(dialog).getByRole('group', { name: 'Interface language' })).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog', { name: 'Game menu' })).not.toBeInTheDocument()
    expect(document.documentElement.style.overflow).toBe('')
    expect(trigger).toHaveFocus()
  })
})
