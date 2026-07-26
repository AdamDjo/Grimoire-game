import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ACTIVE_GAME_SESSION_COOKIE } from '@/lib/active-game-session'

import { CHARACTER_RESULT_STORAGE_KEY } from '../../character-create/_lib/character-create-model'

import { AUBERGE_INTRO_STORAGE_KEY } from './AubergeIntro'
import { AveugleHub } from './AveugleHub'

const {
  ensureAnonymousSession,
  getAveugleHub,
  getSouvenirs,
  markAveugleTopicSeen,
  spendSouvenir,
  talkToAveugle,
} = vi.hoisted(() => ({
  ensureAnonymousSession: vi.fn(),
  getAveugleHub: vi.fn(),
  getSouvenirs: vi.fn(),
  markAveugleTopicSeen: vi.fn(),
  spendSouvenir: vi.fn(),
  talkToAveugle: vi.fn(),
}))
vi.mock('@/lib/supabase/ensure-session', () => ({ ensureAnonymousSession }))

vi.mock('../_lib/aveugle-api', () => ({
  getAveugleHub,
  getSouvenirs,
  markAveugleTopicSeen,
  spendSouvenir,
  talkToAveugle,
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

const CHARACTER = {
  version: 2,
  name: 'Amani',
  peopleId: 'sahelin',
  vocationPath: 'preset',
  vocationId: 'salt-walker',
  freeConcept: '',
  backstory: '',
  historyReviewed: true,
  vocationResolutionStatus: 'idle',
  customVocationName: '',
  narrativeTrait: '',
  shiftedSkills: [],
}

const NAMED_MEMORY = {
  id: 'named-1',
  userId: 'user-1',
  characterId: 'character-1',
  sessionId: 'session-1',
  title: 'The night of Vane',
  body: 'You spared him that night. His silence still travels with you.',
  type: 'moral-choice' as const,
  anonymous: false,
  sharedWithAveugle: false,
  createdAt: '2026-07-22T00:00:00.000Z',
}

const SPENDABLE_MEMORY = {
  ...NAMED_MEMORY,
  id: 'spendable-1',
  title: 'A nameless fragment',
  anonymous: true,
}

describe('AveugleHub', () => {
  beforeEach(() => {
    ensureAnonymousSession.mockReset()
    getAveugleHub.mockReset()
    getSouvenirs.mockReset()
    markAveugleTopicSeen.mockReset()
    spendSouvenir.mockReset()
    talkToAveugle.mockReset()
    ensureAnonymousSession.mockResolvedValue(undefined)
    getAveugleHub.mockResolvedValue({
      iron: 17,
      spendableSouvenirCount: 1,
      namedSouvenirs: [NAMED_MEMORY],
      seenTopicIds: [],
    })
    getSouvenirs.mockResolvedValue([NAMED_MEMORY, SPENDABLE_MEMORY])
    markAveugleTopicSeen.mockResolvedValue(undefined)
    talkToAveugle.mockResolvedValue({
      reply: 'Ash answers only those who listen.',
      isFallback: false,
    })
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
    expect(screen.getByText('17')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Begin the run/ })).toHaveAttribute(
      'href',
      '/velkhar/session/new'
    )

    await user.click(screen.getByRole('button', { name: /The Calcined Ones/ }))
    expect(await screen.findByText(/Ash answers only those who listen/)).toBeInTheDocument()
    expect(talkToAveugle).toHaveBeenCalledWith('What should I know about the Calcined Ones?')
    expect(markAveugleTopicSeen).toHaveBeenCalledWith('calcines')
    expect(
      screen.queryByRole('group', { name: 'Topics to discuss with The Blind One' })
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Go deeper' }))
    expect(talkToAveugle).toHaveBeenLastCalledWith(
      'What should I know about the Calcined Ones? Tell me more, without hiding behind a proverb.'
    )

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

  it('ne transmet plus de présage mécanique local au prochain run', async () => {
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(CHARACTER))

    render(<AveugleHub />)

    expect(await screen.findByRole('link', { name: /Begin the run/ })).toHaveAttribute(
      'href',
      '/velkhar/session/new'
    )
    expect(screen.queryByRole('button', { name: /Omen/ })).not.toBeInTheDocument()
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

  it('échange un Souvenir réel sans le dépenser si le backend échoue', async () => {
    const user = userEvent.setup()
    spendSouvenir.mockRejectedValueOnce(new Error('ai_generation_failed'))
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(CHARACTER))

    render(<AveugleHub />)

    await user.click(await screen.findByRole('button', { name: /Memories/ }))
    await user.click(screen.getByRole('button', { name: 'A fragment of lore' }))

    expect(await screen.findByText(/Your Memory was not spent/)).toBeInTheDocument()
    expect(spendSouvenir).toHaveBeenCalledWith('spendable-1', 'lore-fragment')
  })

  it('affiche le savoir renvoyé par un échange réussi et actualise le compteur', async () => {
    const user = userEvent.setup()
    spendSouvenir.mockResolvedValueOnce({
      loreResult: 'A buried road still remembers the feet that crossed it.',
      souvenir: { ...SPENDABLE_MEMORY, sharedWithAveugle: true },
    })
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(CHARACTER))

    render(<AveugleHub />)

    await user.click(await screen.findByRole('button', { name: /Memories/ }))
    await user.click(screen.getByRole('button', { name: 'A fragment of lore' }))

    expect(await screen.findByText(/A buried road still remembers/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Review memories' }))
    expect(screen.getByText('You have no Memory to share with The Blind One.')).toBeInTheDocument()
  })

  it('rend les états vides explicites sans charger la liste secondaire', async () => {
    getAveugleHub.mockResolvedValueOnce({
      iron: 0,
      spendableSouvenirCount: 0,
      namedSouvenirs: [],
      seenTopicIds: [],
    })
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(CHARACTER))
    const user = userEvent.setup()

    render(<AveugleHub />)

    await user.click(await screen.findByRole('button', { name: 'Memories' }))
    expect(screen.getByText('No named Memory has crossed this threshold yet.')).toBeInTheDocument()
    expect(screen.getByText('You have no Memory to share with The Blind One.')).toBeInTheDocument()
    expect(getSouvenirs).not.toHaveBeenCalled()
  })

  it('affiche une erreur de hub récupérable puis recharge les contrats', async () => {
    const user = userEvent.setup()
    getAveugleHub.mockRejectedValueOnce(new Error('offline'))
    window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(CHARACTER))

    render(<AveugleHub />)

    expect(await screen.findByRole('alert')).toHaveTextContent('The Inn keeps its door closed')
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByLabelText('Character: Amani')).toBeInTheDocument()
    expect(getAveugleHub).toHaveBeenCalledTimes(2)
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
