import { describe, expect, it } from 'vitest'

import { resolveAveugleHubSnapshot } from './aveugle-hub-model'

import type { CharacterCreateDraft } from '../../character-create/_lib/character-create-model'

const CHARACTER: CharacterCreateDraft = {
  version: 2,
  name: 'Amani',
  peopleId: 'sahelin',
  vocationPath: 'preset',
  vocationId: 'salt-walker',
  freeConcept: '',
  backstory: 'Une caravane entière a péri par sa faute.',
  historyReviewed: true,
  vocationResolutionStatus: 'idle',
  customVocationName: '',
  narrativeTrait: '',
  shiftedSkills: [],
}

describe('aveugle hub model', () => {
  it('oriente un nouveau joueur vers la création de personnage', () => {
    const snapshot = resolveAveugleHubSnapshot({
      campaignId: 'nouvelle chronique',
      character: null,
      hasActiveSession: false,
      isRunReturn: false,
    })

    expect(snapshot.stage).toBe('character-create')
    expect(snapshot.primaryHref).toBe(
      '/velkhar/aveugle?flow=character-create&campaign=nouvelle%20chronique'
    )
  })

  it('oriente un personnage existant vers un nouveau run', () => {
    const snapshot = resolveAveugleHubSnapshot({
      campaignId: 'nouvelle chronique',
      character: CHARACTER,
      hasActiveSession: false,
      isRunReturn: false,
    })

    expect(snapshot.stage).toBe('ready')
    expect(snapshot.character).toMatchObject({
      name: 'Amani',
      people: 'Sahélin',
      vocation: 'Marcheur-du-Sel',
    })
    expect(snapshot.primaryHref).toBe('/velkhar/session/new?campaign=nouvelle%20chronique')
  })

  it('donne la priorité à la reprise d’une session active', () => {
    const snapshot = resolveAveugleHubSnapshot({
      character: CHARACTER,
      hasActiveSession: true,
      isRunReturn: true,
    })

    expect(snapshot.stage).toBe('active-session')
    expect(snapshot.primaryHref).toBe('/velkhar/session/resume')
    expect(snapshot.primaryLabel).toBe('Reprendre la route')
  })

  it('adapte le départ après un retour de run', () => {
    const snapshot = resolveAveugleHubSnapshot({
      character: CHARACTER,
      hasActiveSession: false,
      isRunReturn: true,
    })

    expect(snapshot.stage).toBe('run-return')
    expect(snapshot.primaryLabel).toBe('Préparer un nouveau départ')
  })
})
