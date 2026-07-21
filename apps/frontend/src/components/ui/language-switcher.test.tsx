import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UI_LOCALE_COOKIE, UI_LOCALE_METADATA_KEY } from '@/i18n/config'

import { LanguageSwitcher } from './language-switcher'

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  refresh: vi.fn(),
  updateUser: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mocks.refresh }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: mocks.getSession,
      updateUser: mocks.updateUser,
    },
  }),
}))

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    mocks.getSession.mockReset()
    mocks.refresh.mockReset()
    mocks.updateUser.mockReset()
    document.cookie = `${UI_LOCALE_COOKIE}=; Path=/; Max-Age=0`
    window.history.replaceState({}, '', '/velkhar/aveugle?return=run#dialogue')
  })

  it('persists the selection in the cookie and the signed-in account without navigating away', async () => {
    const user = userEvent.setup()
    mocks.getSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } } })
    mocks.updateUser.mockResolvedValue({ data: {}, error: null })

    render(<LanguageSwitcher />)
    await user.click(screen.getByRole('button', { name: 'Français' }))

    await waitFor(() => {
      expect(document.cookie).toContain(`${UI_LOCALE_COOKIE}=fr`)
      expect(mocks.updateUser).toHaveBeenCalledWith({
        data: { [UI_LOCALE_METADATA_KEY]: 'fr' },
      })
      expect(mocks.refresh).toHaveBeenCalledOnce()
      expect(`${window.location.pathname}${window.location.search}${window.location.hash}`).toBe(
        '/velkhar/aveugle?return=run#dialogue'
      )
    })
  })

  it('persists an anonymous selection locally without writing account metadata', async () => {
    const user = userEvent.setup()
    mocks.getSession.mockResolvedValue({ data: { session: null } })

    render(<LanguageSwitcher />)
    await user.click(screen.getByRole('button', { name: 'Français' }))

    await waitFor(() => expect(mocks.refresh).toHaveBeenCalledOnce())
    expect(document.cookie).toContain(`${UI_LOCALE_COOKIE}=fr`)
    expect(mocks.updateUser).not.toHaveBeenCalled()
  })
})
