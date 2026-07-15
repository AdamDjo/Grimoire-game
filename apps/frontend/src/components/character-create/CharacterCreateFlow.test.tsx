import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CHARACTER_RESULT_STORAGE_KEY } from './character-create-model'
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
  })

  it('completes the preset path and returns to L’Aveugle', async () => {
    const user = userEvent.setup()

    render(<CharacterCreateFlow campaignId="nouvelle-chronique" />)

    const nameInput = await screen.findByLabelText('Nom du personnage *')
    await user.type(nameInput, 'Amani')
    await user.click(screen.getByRole('button', { name: 'Suivant' }))

    await screen.findByRole('heading', { name: 'Peuple' })
    await user.click(screen.getByRole('button', { name: /Sahélin/ }))

    const vocationHeading = await screen.findByRole('heading', { name: 'Marcheur-du-Sel' })
    const vocationCard = vocationHeading.closest('article')
    expect(vocationCard).not.toBeNull()
    fireEvent.mouseEnter(vocationCard!)
    expect(screen.getAllByText(/Choisis cette voie si tu veux jouer un voyageur/)).not.toHaveLength(
      0
    )
    await user.click(within(vocationCard!).getByRole('button', { name: 'Suivre cette voie' }))

    await screen.findByRole('heading', { name: 'Histoire' })
    await user.click(
      screen.getByRole('button', { name: 'Une caravane entière a péri par ta faute.' })
    )
    await user.click(screen.getByRole('button', { name: 'Retenir cette histoire' }))

    expect(await screen.findByRole('heading', { name: 'Résumé' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Retourner auprès de L’Aveugle' }))

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
    expect(screen.getByText('Brouillon de création repris.')).toBeInTheDocument()
  })

  it('protects a dirty draft before returning to L’Aveugle', async () => {
    const user = userEvent.setup()
    const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<CharacterCreateFlow campaignId="nouvelle-chronique" />)

    await user.type(await screen.findByLabelText('Nom du personnage *'), 'Naïra')
    await user.click(screen.getByRole('button', { name: 'Retour à L’Aveugle' }))

    expect(confirmMock).toHaveBeenCalledOnce()
    expect(pushMock).not.toHaveBeenCalled()

    confirmMock.mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: 'Retour à L’Aveugle' }))

    expect(pushMock).toHaveBeenCalledWith('/velkhar/aveugle?campaign=nouvelle-chronique')
    confirmMock.mockRestore()
  })
})
