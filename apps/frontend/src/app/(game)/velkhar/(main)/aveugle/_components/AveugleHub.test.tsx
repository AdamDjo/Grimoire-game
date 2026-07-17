import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ACTIVE_GAME_SESSION_COOKIE } from '@/lib/active-game-session'

import { CHARACTER_RESULT_STORAGE_KEY } from '../../character-create/_lib/character-create-model'

import { AUBERGE_INTRO_STORAGE_KEY } from './AubergeIntro'
import { AveugleHub } from './AveugleHub'

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

const CHARACTER = {
  version: 1,
  name: 'Amani',
  peopleId: 'sahelin',
  vocationPath: 'preset',
  vocationId: 'salt-walker',
  freeConcept: '',
  backstory: '',
  historyReviewed: true,
}

describe('AveugleHub', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
    window.sessionStorage.setItem(AUBERGE_INTRO_STORAGE_KEY, 'seen')
    document.cookie = `${ACTIVE_GAME_SESSION_COOKIE}=; Path=/; Max-Age=0`
  })

  it('conserve le seuil narratif quand aucun personnage n’existe', async () => {
    render(<AveugleHub campaignId="nouvelle-chronique" />)

    expect(await screen.findByRole('heading', { name: 'L’Aveugle' })).toBeInTheDocument()
    expect(screen.getByText(/Avant la route, donne-moi ton nom/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Répondre/ })).toHaveAttribute(
      'href',
      '/velkhar/aveugle?flow=character-create&campaign=nouvelle-chronique'
    )
    expect(
      screen.queryByRole('group', { name: 'Sujets à aborder avec L’Aveugle' })
    ).not.toBeInTheDocument()
  })

  it('ouvre la Forge au second temps du flow sans personnage', async () => {
    render(<AveugleHub campaignId="nouvelle-chronique" isCharacterFlow />)

    expect(
      await screen.findByRole('heading', { name: 'Le registre de L’Aveugle' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Donner mon nom/ })).toHaveAttribute(
      'href',
      '/velkhar/character-create?campaign=nouvelle-chronique'
    )
  })

  it('affiche le personnage et rend les sujets du hub interactifs', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(CHARACTER))

    render(<AveugleHub />)

    expect(await screen.findByLabelText('Personnage : Amani')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Choisir un présage' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Les Calcinés/ }))
    expect(screen.getByText(/Les Calcinés n’écoutent plus la Cendre/)).toBeInTheDocument()
    expect(
      screen.queryByRole('group', { name: 'Sujets à aborder avec L’Aveugle' })
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Approfondir' }))
    expect(screen.getByText(/Quand la Cendre prononce ton nom/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Autres sujets' }))
    await user.click(screen.getByRole('button', { name: 'Autre question…' }))
    expect(screen.getByPlaceholderText('Pose ta question…')).toBeInTheDocument()
  })

  it('lance l’introduction au premier passage même sans personnage', async () => {
    window.sessionStorage.removeItem(AUBERGE_INTRO_STORAGE_KEY)

    render(<AveugleHub previewIntro />)

    expect(
      await screen.findByRole('dialog', { name: 'Introduction à l’Auberge de L’Aveugle' })
    ).toBeInTheDocument()
  })

  it('prépare le prochain run avec un présage explicite', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(CHARACTER))

    render(<AveugleHub />)

    await user.click(await screen.findByRole('button', { name: 'Choisir un présage' }))
    await user.click(screen.getByRole('button', { name: /Suivre la fumée/ }))

    expect(screen.getByText(/rencontre cachée pourra apparaître/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Partir en run/ })).toHaveAttribute(
      'href',
      '/velkhar/session/new?omen=follow-smoke'
    )
  })

  it('isole les souvenirs de la conversation principale', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(CHARACTER))

    render(<AveugleHub />)

    await user.click(await screen.findByRole('button', { name: /Souvenirs/ }))
    expect(
      screen.queryByRole('group', { name: 'Sujets à aborder avec L’Aveugle' })
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /La nuit de Vane/ }))
    expect(screen.getByText(/Son silence voyage encore avec toi/)).toBeInTheDocument()
  })

  it('oriente une session active vers la reprise', async () => {
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(CHARACTER))
    document.cookie = `${ACTIVE_GAME_SESSION_COOKIE}=1; Path=/; SameSite=Lax`

    render(<AveugleHub />)

    expect(await screen.findByText(/Ta place est encore chaude/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Reprendre la route/ })).toHaveAttribute(
      'href',
      '/velkhar/session/resume'
    )
  })
})
