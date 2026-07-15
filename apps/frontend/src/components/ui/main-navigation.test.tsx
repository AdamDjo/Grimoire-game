import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MainNavigation } from './main-navigation'

const pathnameMock = vi.fn(() => '/dashboard')

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
    document.documentElement.style.overflow = ''
  })

  it('expose une navigation globale stable', () => {
    render(<MainNavigation tier="anonymous" />)

    expect(screen.getByRole('link', { name: 'Découvrir' })).toHaveAttribute('href', '/#velkhar')
    expect(screen.getByRole('link', { name: 'Chroniques' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'L’Auberge' })).toHaveAttribute(
      'href',
      '/velkhar/aveugle'
    )
  })

  it('verrouille le scroll et restaure le focus à la fermeture du menu', async () => {
    const user = userEvent.setup()
    render(<MainNavigation tier="anonymous" />)

    const trigger = screen.getByRole('button', { name: 'Ouvrir le menu' })
    await user.click(trigger)

    const dialog = screen.getByRole('dialog', { name: 'Menu principal' })
    expect(dialog).toBeInTheDocument()
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(within(dialog).getByRole('link', { name: 'Découvrir' })).toHaveFocus()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog', { name: 'Menu principal' })).not.toBeInTheDocument()
    expect(document.documentElement.style.overflow).toBe('')
    expect(trigger).toHaveFocus()
  })
})
