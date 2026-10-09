import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthAccessForm } from './AuthAccessForm'

const { linkIdentityMock, signInWithOAuthMock, signInWithOtpMock, updateUserMock } = vi.hoisted(
  () => ({
    linkIdentityMock: vi.fn(),
    signInWithOAuthMock: vi.fn(),
    signInWithOtpMock: vi.fn(),
    updateUserMock: vi.fn(),
  })
)

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
  createClient: () => ({
    auth: {
      linkIdentity: linkIdentityMock,
      signInWithOAuth: signInWithOAuthMock,
      signInWithOtp: signInWithOtpMock,
      updateUser: updateUserMock,
    },
  }),
}))

describe('AuthAccessForm', () => {
  beforeEach(() => {
    linkIdentityMock.mockReset().mockResolvedValue({ error: null })
    signInWithOAuthMock.mockReset().mockResolvedValue({ error: null })
    signInWithOtpMock.mockReset().mockResolvedValue({ error: null })
    updateUserMock.mockReset().mockResolvedValue({ error: null })
  })

  it('envoie un lien de connexion et conserve la destination demandée', async () => {
    const user = userEvent.setup()

    render(
      <AuthAccessForm anonymousSession={false} mode="login" nextPath="/velkhar/session/resume" />
    )

    await user.type(screen.getByRole('textbox', { name: /Email address/ }), 'reader@example.com')
    await user.click(screen.getByRole('button', { name: 'Send me a sign-in link' }))

    await waitFor(() =>
      expect(signInWithOtpMock).toHaveBeenCalledWith({
        email: 'reader@example.com',
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/callback?next=%2Fvelkhar%2Fsession%2Fresume',
          shouldCreateUser: false,
        },
      })
    )
    expect(screen.getByRole('status')).toHaveTextContent('a sign-in link has been sent')
    expect(screen.getByRole('link', { name: 'Keep your journey' })).toHaveAttribute(
      'href',
      '/signup?next=%2Fvelkhar%2Fsession%2Fresume'
    )
  })

  it('rattache la trace anonyme au fournisseur choisi pendant l’inscription', async () => {
    const user = userEvent.setup()

    render(<AuthAccessForm anonymousSession mode="signup" nextPath="/velkhar/session/resume" />)

    expect(screen.getByText(/Your character, current run/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Google' }))

    await waitFor(() =>
      expect(linkIdentityMock).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback?next=%2Fvelkhar%2Fsession%2Fresume',
        },
      })
    )
    expect(signInWithOAuthMock).not.toHaveBeenCalled()
  })

  it('annonce immédiatement une erreur de callback', () => {
    render(
      <AuthAccessForm anonymousSession={false} initialError mode="login" nextPath="/dashboard" />
    )

    expect(screen.getByRole('alert')).toHaveTextContent('The request failed')
  })
})
