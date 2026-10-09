import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ForgotPasswordForm } from './ForgotPasswordForm'

const { signInWithOtpMock } = vi.hoisted(() => ({ signInWithOtpMock: vi.fn() }))

vi.mock('next/image', () => ({
  default: ({
    alt,
    priority: _priority,
    unoptimized: _unoptimized,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean
    unoptimized?: boolean
  }) => <img alt={alt} {...props} />,
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { signInWithOtp: signInWithOtpMock } }),
}))

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    signInWithOtpMock.mockReset().mockResolvedValue({ error: null })
  })

  it('renvoie un lien sans créer de nouvel utilisateur', async () => {
    const user = userEvent.setup()

    render(<ForgotPasswordForm nextPath="/dashboard" />)

    await user.type(screen.getByRole('textbox', { name: /Email address/ }), 'reader@example.com')
    await user.click(screen.getByRole('button', { name: 'Send a new link' }))

    await waitFor(() =>
      expect(signInWithOtpMock).toHaveBeenCalledWith({
        email: 'reader@example.com',
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback?next=%2Fdashboard',
          shouldCreateUser: false,
        },
      })
    )
    expect(screen.getByRole('status')).toHaveTextContent('a new sign-in link has been sent')
    expect(screen.getByRole('link', { name: 'Back to sign in' })).toHaveAttribute(
      'href',
      '/login?next=%2Fdashboard'
    )
  })
})
