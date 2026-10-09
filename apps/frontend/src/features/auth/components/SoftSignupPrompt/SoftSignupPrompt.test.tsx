import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '@/stores/session-store'

import { SoftSignupPrompt } from './SoftSignupPrompt'

vi.mock('next/navigation', () => ({
  usePathname: () => '/velkhar/session/resume',
}))

describe('SoftSignupPrompt', () => {
  beforeEach(() => {
    useSessionStore.setState({
      anonymousRequestCount: 22,
      showSoftPrompt: true,
      softPromptDismissed: false,
    })
  })

  it('conserve la route courante dans le lien d’inscription', () => {
    render(<SoftSignupPrompt />)

    expect(screen.getByText(/8 anonymous actions remain/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Keep my journey' })).toHaveAttribute(
      'href',
      '/signup?next=%2Fvelkhar%2Fsession%2Fresume'
    )
  })

  it('peut être remis à plus tard', async () => {
    const user = userEvent.setup()
    render(<SoftSignupPrompt />)

    await user.click(screen.getByRole('button', { name: 'Later' }))

    expect(screen.queryByText(/anonymous actions remain/)).not.toBeInTheDocument()
    expect(useSessionStore.getState().softPromptDismissed).toBe(true)
  })
})
