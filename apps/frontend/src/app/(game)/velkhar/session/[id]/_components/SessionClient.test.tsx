import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSessionStore } from '@/stores/session-store'

import { MOCK_CHARACTER } from '../_data/mock-character'

import { SessionClient } from './SessionClient'

import type { SceneResponse } from '@grimoire/shared'

const { createSessionMock, postGameActionMock } = vi.hoisted(() => ({
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

vi.mock('../_lib/api', () => ({
  createSession: createSessionMock,
  postGameAction: postGameActionMock,
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
  updatedInventory: [],
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

describe('SessionClient', () => {
  beforeEach(() => {
    createSessionMock.mockReset()
    postGameActionMock.mockReset()
    createSessionMock.mockResolvedValue(OPENING_RESPONSE)
    postGameActionMock.mockResolvedValue(NEXT_RESPONSE)
    useSessionStore.setState({
      anonymousRequestCount: 0,
      showSoftPrompt: false,
    })
  })

  it('ouvre une session et rend la fiction, les choix et le HUD compact', async () => {
    render(<SessionClient initialCharacter={MOCK_CHARACTER} />)

    expect(await screen.findByText('Salt moves across the road.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Approach the stranger/ })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Blood' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Calamine' })).toBeInTheDocument()
  })

  it('envoie un choix une seule fois et affiche la scène suivante', async () => {
    const user = userEvent.setup()
    render(<SessionClient initialCharacter={MOCK_CHARACTER} />)

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
    render(<SessionClient initialCharacter={MOCK_CHARACTER} />)

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
    render(<SessionClient initialCharacter={MOCK_CHARACTER} />)

    await screen.findByText('Salt moves across the road.')
    await user.click(screen.getByRole('button', { name: 'Open character sheet' }))

    expect(screen.getByRole('dialog', { name: 'character panel' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: MOCK_CHARACTER.name })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close panel' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
