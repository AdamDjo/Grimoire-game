import { PEOPLES, VOCATIONS } from '@grimoire/shared'

import type { GameIconName } from '@/components/ui/grimoire/GameIcon/GameIcon'

export interface CharacterPeopleOption {
  description: string
  icon: GameIconName
  id: string
  name: string
}

export interface CharacterVocationOption {
  description: string
  eyebrow: string
  guidance: string
  id: string
  imageSrc: string
  name: string
}

const PEOPLE_ICONS: Record<string, GameIconName> = {
  sahelin: 'wind',
  rivain: 'coins',
  therien: 'shield',
  cendreur: 'fire',
  changepeau: 'moon',
}

const VOCATION_GUIDANCE: Record<string, string> = {
  'salt-walker':
    'Choisis cette voie si tu veux jouer un voyageur qui survit grâce à son expérience du désert, des caravanes et du commerce.',
  'shadow-blade':
    'Choisis cette voie pour jouer la discrétion, la précision et les secrets. Une Lame-Ombre n’est pas forcément sans cœur.',
  watcher:
    'Choisis cette voie si tu veux explorer des ruines, étudier des objets anciens et comprendre le danger avant d’agir.',
  'word-weaver':
    'Choisis cette voie pour approcher la Cendre par les mots et le savoir. Son pouvoir est utile, mais jamais sans risque.',
}

const VOCATION_IMAGES: Record<string, string> = {
  'salt-walker': '/characters/vocations/marcheur-du-sel.webp',
  'shadow-blade': '/characters/vocations/lame-ombre.webp',
  watcher: '/characters/vocations/veilleur.webp',
  'word-weaver': '/characters/vocations/tisse-verbe.webp',
}

const VOCATION_EYEBROWS: Record<string, string> = {
  'salt-walker': 'Voyage · survie · négoce',
  'shadow-blade': 'Discrétion · contrats · secrets',
  watcher: 'Ruines · artefacts · savoir',
  'word-weaver': 'Cendre · langage · maîtrise',
}

export const CHARACTER_PEOPLE_OPTIONS: CharacterPeopleOption[] = PEOPLES.map((people) => ({
  description: people.description.fr,
  icon: PEOPLE_ICONS[people.id] ?? 'stranger',
  id: people.id,
  name: people.name.fr,
}))

export const CHARACTER_VOCATION_OPTIONS: CharacterVocationOption[] = VOCATIONS.map((vocation) => ({
  description: vocation.description.fr,
  eyebrow: VOCATION_EYEBROWS[vocation.id] ?? 'Voie de Velkhar',
  guidance: VOCATION_GUIDANCE[vocation.id] ?? vocation.description.fr,
  id: vocation.id,
  imageSrc: VOCATION_IMAGES[vocation.id] ?? '/characters/vocations/veilleur.webp',
  name: vocation.name.fr,
}))

/** Canonical fears from raw/05-VOCATIONS, isolated until a narrative contract exists. */
export const CHARACTER_HISTORY_OPTIONS: Record<string, string[]> = {
  'salt-walker': [
    'Une caravane entière a péri par ta faute.',
    'Une dette d’hospitalité n’a jamais été honorée.',
    'Tu cherches encore un proche perdu dans le désert.',
  ],
  'shadow-blade': [
    'Une cible a survécu et te traque.',
    'Tu as tué la mauvaise personne.',
    'Ton ancien mentor t’a trahi.',
  ],
  watcher: [
    'Un artefact a tué l’un de tes compagnons.',
    'Un partenaire est resté enseveli dans une ruine.',
    'Tu recherches un artefact précis depuis des années.',
  ],
  'word-weaver': [
    'La Calamine progresse déjà sous ta peau.',
    'Un Inquisiteur a vu tes mains grises.',
    'Un artefact hors de contrôle a blessé un innocent.',
  ],
}

export function getPeopleOption(id: string): CharacterPeopleOption | undefined {
  return CHARACTER_PEOPLE_OPTIONS.find((people) => people.id === id)
}

export function getVocationOption(id: string): CharacterVocationOption | undefined {
  return CHARACTER_VOCATION_OPTIONS.find((vocation) => vocation.id === id)
}
