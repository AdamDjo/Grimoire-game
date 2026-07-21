import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CHARACTER_RESULT_STORAGE_KEY } from '../_lib/character-create-model'

import { CharacterCreateFlow } from './CharacterCreateFlow'

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
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

    await screen.findByRole('heading', { name: 'History' })
    await user.click(
      screen.getByRole('button', { name: 'An entire caravan perished because of you.' })
    )
    await user.click(screen.getByRole('button', { name: 'Keep this history' }))

    expect(await screen.findByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Return to The Blind One' }))

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        '/velkhar/aveugle?campaign=nouvelle-chronique&character=ready'
      )
    })

    const storedResult = window.localStorage.getItem(CHARACTER_RESULT_STORAGE_KEY)
    expect(storedResult).toContain('Amani')
    expect(storedResult).not.toContain('stats')
  })

  it('restores a versioned draft after hydration', async () => {
    window.sessionStorage.setItem(
      'grimoire.character-create.draft.v1',
      JSON.stringify({
        version: 1,
        name: 'Kael',
        peopleId: 'rivain',
        vocationPath: 'preset',
        vocationId: '',
        freeConcept: '',
        backstory: '',
        historyReviewed: false,
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
    await user.click(screen.getByRole('button', { name: 'Back to The Blind One' }))

    expect(confirmMock).toHaveBeenCalledOnce()
    expect(pushMock).not.toHaveBeenCalled()

    confirmMock.mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: 'Back to The Blind One' }))

    expect(pushMock).toHaveBeenCalledWith('/velkhar/aveugle?campaign=nouvelle-chronique')
    confirmMock.mockRestore()
  })
})
