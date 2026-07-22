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

    expect(await screen.findByRole('heading', { name: 'The Blind One' })).toBeInTheDocument()
    expect(screen.getByText(/Before the road, give me your name/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Answer/ })).toHaveAttribute(
      'href',
      '/velkhar/aveugle?flow=character-create&campaign=nouvelle-chronique'
    )
    expect(
      screen.queryByRole('group', { name: 'Topics to discuss with The Blind One' })
    ).not.toBeInTheDocument()
  })

  it('ouvre la Forge au second temps du flow sans personnage', async () => {
    render(<AveugleHub campaignId="nouvelle-chronique" isCharacterFlow />)

    expect(
      await screen.findByRole('heading', { name: "The Blind One's register" })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Give my name/ })).toHaveAttribute(
      'href',
      '/velkhar/character-create?campaign=nouvelle-chronique'
    )
  })

  it('affiche le personnage et rend les sujets du hub interactifs', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(CHARACTER))

    render(<AveugleHub />)

    expect(await screen.findByLabelText('Character: Amani')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Choose an omen' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /The Calcined Ones/ }))
    expect(screen.getByText(/The Calcined Ones no longer listen to Ash/)).toBeInTheDocument()
    expect(
      screen.queryByRole('group', { name: 'Topics to discuss with The Blind One' })
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Go deeper' }))
    expect(screen.getByText(/When Ash speaks your name/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Other topics' }))
    await user.click(screen.getByRole('button', { name: 'Another question…' }))
    expect(screen.getByPlaceholderText('Ask your question…')).toBeInTheDocument()
  })

  it('lance l’introduction au premier passage même sans personnage', async () => {
    window.sessionStorage.removeItem(AUBERGE_INTRO_STORAGE_KEY)

    render(<AveugleHub previewIntro />)

    expect(
      await screen.findByRole('dialog', { name: "Introduction to The Blind One's Inn" })
    ).toBeInTheDocument()
  })

  it('prépare le prochain run avec un présage explicite', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(CHARACTER))

    render(<AveugleHub />)

    await user.click(await screen.findByRole('button', { name: 'Choose an omen' }))
    await user.click(screen.getByRole('button', { name: /Follow the smoke/ }))

    expect(screen.getByText(/hidden encounter may appear/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Begin the run/ })).toHaveAttribute(
      'href',
      '/velkhar/session/new?omen=follow-smoke'
    )
  })

  it('isole les souvenirs de la conversation principale', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(CHARACTER))

    render(<AveugleHub />)

    await user.click(await screen.findByRole('button', { name: /Memories/ }))
    expect(
      screen.queryByRole('group', { name: 'Topics to discuss with The Blind One' })
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /The night of Vane/ }))
    expect(screen.getByText(/His silence still travels with you/)).toBeInTheDocument()
  })

  it('oriente une session active vers la reprise', async () => {
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(CHARACTER))
    document.cookie = `${ACTIVE_GAME_SESSION_COOKIE}=1; Path=/; SameSite=Lax`

    render(<AveugleHub />)

    expect(await screen.findByText(/Your seat is still warm/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Resume the road/ })).toHaveAttribute(
      'href',
      '/velkhar/session/resume'
    )
  })
})
