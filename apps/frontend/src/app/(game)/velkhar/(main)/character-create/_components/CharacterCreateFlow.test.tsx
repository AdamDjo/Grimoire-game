import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  CHARACTER_DRAFT_STORAGE_KEY,
  CHARACTER_RESULT_STORAGE_KEY,
} from '../_lib/character-create-model'

import { CharacterCreateFlow } from './CharacterCreateFlow'

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/lib/supabase/ensure-session', () => ({
  ensureAnonymousSession: vi.fn().mockResolvedValue(undefined),
}))

describe('CharacterCreateFlow', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    pushMock.mockReset()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, data: { id: 'char1' } }),
      })
    )
  })

  it('completes the preset path and returns to L’Aveugle', async () => {
    const user = userEvent.setup()

    render(<CharacterCreateFlow campaignId="nouvelle-chronique" />)

    const nameInput = await screen.findByLabelText('Character name *')
    await user.type(nameInput, 'Amani')
    await user.click(screen.getByRole('button', { name: 'Next' }))

    await screen.findByRole('heading', { name: 'People' })
    await user.click(screen.getByRole('button', { name: /Sahelin/ }))

    const vocationHeading = await screen.findByRole('heading', { name: 'Salt-Walker' })
    const vocationCard = vocationHeading.closest('article')
    expect(vocationCard).not.toBeNull()
    fireEvent.mouseEnter(vocationCard!)
    expect(screen.getAllByText(/Choose this path to play a traveler/)).not.toHaveLength(0)
    await user.click(within(vocationCard!).getByRole('button', { name: 'Follow this path' }))

    await screen.findByRole('heading', { name: 'Past' })
    await user.click(
      screen.getByRole('button', { name: 'An entire caravan perished because of you.' })
    )
    await user.click(screen.getByRole('button', { name: 'Continue with this past' }))

    expect(await screen.findByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Create this character' }))

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        '/velkhar/aveugle?campaign=nouvelle-chronique&character=ready'
      )
    })

    const storedResult = window.localStorage.getItem(CHARACTER_RESULT_STORAGE_KEY)
    expect(storedResult).toContain('Amani')
    expect(storedResult).not.toContain('stats')
  })

  it('resolves a free concept and lets the player accept the proposed vocation', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      if (url.includes('/resolve-vocation')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              success: true,
              data: {
                status: 'resolved',
                vocationId: 'watcher',
                customVocationName: 'Ruin-Reader',
                narrativeTrait: 'Reads danger before it strikes.',
                shiftedSkills: [{ original: 'Lore', shifted: 'Ruin-Sense' }],
                announcement: 'The Blind One nods slowly.',
              },
            }),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, data: { id: 'char1' } }),
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<CharacterCreateFlow campaignId="nouvelle-chronique" />)

    await user.type(await screen.findByLabelText('Character name *'), 'Amani')
    await user.click(screen.getByRole('button', { name: 'Next' }))

    await screen.findByRole('heading', { name: 'People' })
    await user.click(screen.getByRole('button', { name: /Sahelin/ }))

    await screen.findByRole('heading', { name: 'Vocation' })
    await user.type(
      screen.getByLabelText('Your character idea *'),
      'A ruin-reader who listens to the bones of the desert.'
    )
    await user.click(screen.getByRole('button', { name: 'Entrust this concept to The Blind One' }))

    expect(await screen.findByText('The Blind One nods slowly.')).toBeInTheDocument()
    expect(screen.getByText('Ruin-Reader')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Accept this vocation' }))

    await screen.findByRole('heading', { name: 'Past' })
  })

  it('falls back to the preset choices when the concept cannot be resolved', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      if (url.includes('/resolve-vocation')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              success: true,
              data: { status: 'fallback', reason: 'unintelligible_concept' },
            }),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, data: { id: 'char1' } }),
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<CharacterCreateFlow campaignId="nouvelle-chronique" />)

    await user.type(await screen.findByLabelText('Character name *'), 'Amani')
    await user.click(screen.getByRole('button', { name: 'Next' }))

    await screen.findByRole('heading', { name: 'People' })
    await user.click(screen.getByRole('button', { name: /Sahelin/ }))

    await screen.findByRole('heading', { name: 'Vocation' })
    await user.type(screen.getByLabelText('Your character idea *'), 'asdf asdf asdf asdf asdf')
    await user.click(screen.getByRole('button', { name: 'Entrust this concept to The Blind One' }))

    expect(
      await screen.findByText(
        'The Blind One could not make out a vocation in these words. Choose one of the four paths above, or refine your concept.'
      )
    ).toBeInTheDocument()
  })

  it('restores a versioned draft after hydration', async () => {
    window.sessionStorage.setItem(
      CHARACTER_DRAFT_STORAGE_KEY,
      JSON.stringify({
        version: 2,
        name: 'Kael',
        peopleId: 'rivain',
        vocationPath: 'preset',
        vocationId: '',
        freeConcept: '',
        backstory: '',
        historyReviewed: false,
        vocationResolutionStatus: 'idle',
        customVocationName: '',
        narrativeTrait: '',
        shiftedSkills: [],
      })
    )

    render(<CharacterCreateFlow />)

    expect(await screen.findByRole('heading', { name: 'Vocation' })).toBeInTheDocument()
    expect(screen.getByText('Character draft resumed.')).toBeInTheDocument()
  })

  it('protects a dirty draft before returning to L’Aveugle', async () => {
    const user = userEvent.setup()
    const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<CharacterCreateFlow campaignId="nouvelle-chronique" />)

    await user.type(await screen.findByLabelText('Character name *'), 'Naïra')
    await user.click(screen.getByRole('button', { name: 'Leave the Forge' }))

    expect(confirmMock).toHaveBeenCalledOnce()
    expect(pushMock).not.toHaveBeenCalled()

    confirmMock.mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: 'Leave the Forge' }))

    expect(pushMock).toHaveBeenCalledWith('/velkhar/aveugle?campaign=nouvelle-chronique')
    confirmMock.mockRestore()
  })
})
