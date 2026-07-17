import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '@/stores/session-store'

import { MOCK_CHARACTER } from '../_data/mock-character'

import { VelkharSession } from './VelkharSession'

import type { SceneResponse } from '@grimoire/shared'

const { abandonSessionMock, createSessionMock, postGameActionMock } = vi.hoisted(() => ({
  abandonSessionMock: vi.fn(),
  createSessionMock: vi.fn(),
  postGameActionMock: vi.fn(),
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

vi.mock('@/features/game-session/api/game-session-api', () => ({
  gameSessionApi: {
    abandonSession: abandonSessionMock,
    createSession: createSessionMock,
    postGameAction: postGameActionMock,
  },
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'user-1' } } } }),
      signInAnonymously: vi.fn(),
    },
  }),
}))

const OPENING_RESPONSE: SceneResponse = {
  scene: {
    id: 'scene-1',
    sessionId: 'session-1',
    turnNumber: 1,
    narrative: 'Salt moves across the road.\n\nA stranger waits beside the dry well.',
    choices: [
      {
        id: 'choice-1',
        text: 'Approach the stranger',
        type: 'dialog',
        riskLevel: 'low',
      },
    ],
    sceneType: 'exploration',
    location: 'Salt Road',
    createdAt: '2026-07-16T00:00:00.000Z',
  },
  updatedStats: { ...MOCK_CHARACTER.stats.survival },
  updatedInventory: [
    {
      id: 'item-sabre',
      name: 'Salt sabre',
      quantity: 1,
      category: 'equipment',
      equippedSlot: 'main-hand',
      description: 'A worn blade balanced for the salt roads.',
      allowedActions: ['unequip', 'inspect'],
    },
    {
      id: 'item-water',
      name: 'Waterskin',
      quantity: 2,
      category: 'bag',
      description: 'Enough water for another day.',
      allowedActions: ['use', 'inspect'],
    },
    {
      id: 'item-seal',
      name: 'Sealed letter',
      quantity: 1,
      category: 'bag',
      state: 'locked',
    },
    {
      id: 'item-rations',
      name: 'Travel rations',
      quantity: 1,
      category: 'bag',
      state: 'pending',
    },
    {
      id: 'item-voice',
      name: 'Voice of the Sands',
      quantity: 1,
      category: 'artifact',
    },
  ],
  notifications: [],
  source: 'ai',
}

const NEXT_RESPONSE: SceneResponse = {
  ...OPENING_RESPONSE,
  scene: {
    ...OPENING_RESPONSE.scene,
    id: 'scene-2',
    turnNumber: 2,
    narrative: 'The stranger raises an empty hand.',
    choices: [
      {
        id: 'choice-2',
        text: 'Ask for their name',
        type: 'dialog',
        riskLevel: 'safe',
      },
    ],
  },
}

describe('VelkharSession', () => {
  beforeEach(() => {
    abandonSessionMock.mockReset()
    createSessionMock.mockReset()
    postGameActionMock.mockReset()
    createSessionMock.mockResolvedValue(OPENING_RESPONSE)
    postGameActionMock.mockResolvedValue(NEXT_RESPONSE)
    abandonSessionMock.mockResolvedValue({ status: 'ended', endReason: 'abandon' })
    useSessionStore.setState({
      anonymousRequestCount: 0,
      showSoftPrompt: false,
    })
  })

  it('ouvre une session et rend la fiction, les choix et le HUD compact', async () => {
    render(<VelkharSession initialCharacter={MOCK_CHARACTER} />)

    expect(await screen.findByText('Salt moves across the road.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Approach the stranger/ })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Blood' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Calamine' })).toBeInTheDocument()
  })

  it('envoie un choix une seule fois et affiche la scène suivante', async () => {
    const user = userEvent.setup()
    render(<VelkharSession initialCharacter={MOCK_CHARACTER} />)

    const choice = await screen.findByRole('button', { name: /Approach the stranger/ })
    await user.click(choice)

    expect(postGameActionMock).toHaveBeenCalledTimes(1)
    expect(postGameActionMock).toHaveBeenCalledWith({
      sessionId: 'session-1',
      locale: 'en',
      choiceId: 'choice-1',
      chosenActionText: 'Approach the stranger',
    })
    expect(await screen.findByText('The stranger raises an empty hand.')).toBeInTheDocument()
  })

  it('envoie une action libre et vide le composer après succès', async () => {
    const user = userEvent.setup()
    render(<VelkharSession initialCharacter={MOCK_CHARACTER} />)

    const composer = await screen.findByRole('textbox', { name: 'Describe another action' })
    await waitFor(() => expect(composer).toBeEnabled())
    await user.type(composer, 'I inspect the tracks')
    expect(composer).toHaveValue('I inspect the tracks')
    const actionButton = screen.getByRole('button', { name: 'Attempt this action' })
    expect(actionButton).toBeEnabled()
    await user.click(actionButton)

    await waitFor(() =>
      expect(postGameActionMock).toHaveBeenCalledWith({
        sessionId: 'session-1',
        locale: 'en',
        freeAction: 'I inspect the tracks',
      })
    )
    expect(await screen.findByRole('textbox', { name: 'Describe another action' })).toHaveValue('')
  })

  it('ouvre les outils sans quitter la session', async () => {
    const user = userEvent.setup()
    render(<VelkharSession initialCharacter={MOCK_CHARACTER} />)

    await screen.findByText('Salt moves across the road.')
    await user.click(screen.getByRole('button', { name: 'Open character sheet' }))

    expect(screen.getByRole('dialog', { name: 'Character panel' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: MOCK_CHARACTER.name })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close panel' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('partage la même source entre la quickbar et les 8+12 emplacements détaillés', async () => {
    const user = userEvent.setup()
    render(<VelkharSession initialCharacter={MOCK_CHARACTER} />)

    await screen.findByText('Salt moves across the road.')
    await user.click(screen.getByRole('button', { name: 'Open inventory, 5 items' }))

    expect(screen.getByRole('dialog', { name: 'Inventory panel' })).toBeInTheDocument()
    expect(screen.getByText('8 fixed slots')).toBeInTheDocument()
    expect(screen.getByText('12 slots')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Main hand: Salt sabre, equipped/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: /Bag slot 2: Sealed letter, locked/ })).toBeDisabled()
    expect(
      screen.getByRole('button', { name: /Bag slot 3: Travel rations, pending/ })
    ).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Bag slot 4, empty' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /Bag slot 1: Waterskin/ }))
    expect(screen.getByRole('heading', { name: 'Waterskin' })).toBeInTheDocument()
    expect(screen.getByText('Authorized now: use, inspect')).toBeInTheDocument()
  })

  it('restaure le focus après Escape', async () => {
    const user = userEvent.setup()
    render(<VelkharSession initialCharacter={MOCK_CHARACTER} />)

    await screen.findByText('Salt moves across the road.')
    const trigger = screen.getByRole('button', { name: 'Open character sheet' })
    await user.click(trigger)
    expect(screen.getByRole('button', { name: 'Close panel' })).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('enferme la navigation clavier dans la fenêtre', async () => {
    const user = userEvent.setup()
    render(<VelkharSession initialCharacter={MOCK_CHARACTER} />)

    await screen.findByText('Salt moves across the road.')
    await user.click(screen.getByRole('button', { name: 'Open session menu' }))
    expect(screen.getByRole('button', { name: 'Close panel' })).toHaveFocus()

    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Abandon this run' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close panel' })).toHaveFocus()
  })

  it('demande confirmation avant un abandon et attend le backend', async () => {
    const user = userEvent.setup()
    render(<VelkharSession initialCharacter={MOCK_CHARACTER} />)

    await screen.findByText('Salt moves across the road.')
    await user.click(screen.getByRole('button', { name: 'Open session menu' }))
    await user.click(screen.getByRole('button', { name: 'Abandon this run' }))

    expect(screen.getByRole('alertdialog', { name: 'Confirm abandon run' })).toBeInTheDocument()
    expect(abandonSessionMock).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Confirm abandon' }))

    await waitFor(() => expect(abandonSessionMock).toHaveBeenCalledWith('session-1'))
    expect(await screen.findByText('Quelques pas, pas encore une Chronique')).toBeInTheDocument()
  })
})
