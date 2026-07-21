'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { ArchetypeCard } from '@/components/ui/grimoire/ArchetypeCard/ArchetypeCard'
import { DialogueChoice } from '@/components/ui/grimoire/DialogueChoice/DialogueChoice'
import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'
import { GameField } from '@/components/ui/grimoire/GameField/GameField'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GameInput } from '@/components/ui/grimoire/GameInput/GameInput'
import { GamePanel } from '@/components/ui/grimoire/GamePanel/GamePanel'
import { GameSectionHeading } from '@/components/ui/grimoire/GameSectionHeading/GameSectionHeading'
import { GameStepper } from '@/components/ui/grimoire/GameStepper/GameStepper'
import { GameTextarea } from '@/components/ui/grimoire/GameTextarea/GameTextarea'
import { ensureAnonymousSession } from '@/lib/supabase/ensure-session'

import { VELKHAR_WORLD } from '../../../_config/velkhar-world'
import {
  CHARACTER_HISTORY_OPTIONS,
  CHARACTER_PEOPLE_OPTIONS,
  CHARACTER_VOCATION_OPTIONS,
  getPeopleOption,
  getVocationOption,
} from '../_data/character-create-options'
import { createCharacter } from '../_lib/api'
import {
  CHARACTER_CREATE_STEPS,
  CHARACTER_DRAFT_STORAGE_KEY,
  CHARACTER_RESULT_STORAGE_KEY,
  EMPTY_CHARACTER_DRAFT,
  backstorySchema,
  characterNameSchema,
  createCharacterResult,
  freeConceptSchema,
  getCompletedSteps,
  getResumeStep,
  parseStoredCharacterDraft,
} from '../_lib/character-create-model'

import type { CharacterCreateDraft, CharacterCreateStep } from '../_lib/character-create-model'
import type { Variants } from 'framer-motion'
import type { FormEvent } from 'react'

import './character-create-flow.css'

interface CharacterCreateFlowProps {
  campaignId?: string
}

const STEP_CONTENT = {
  identity: {
    description: 'Chaque légende commence par un nom.',
    icon: 'stranger',
    label: 'Identité',
  },
  people: {
    description: 'Le sang garde la mémoire des routes anciennes.',
    icon: 'mage',
    label: 'Peuple',
  },
  vocation: {
    description: 'Choisis une lentille sur le monde, ou décris la tienne.',
    icon: 'crossed-swords',
    label: 'Vocation',
  },
  history: {
    description: 'Toute route commence avec une dette, une peur ou une absence.',
    icon: 'journal',
    label: 'Histoire',
  },
  summary: {
    description: 'L’Aveugle relit les traces que tu lui as confiées.',
    icon: 'book',
    label: 'Résumé',
  },
} as const

const STEP_INDEX = new Map(CHARACTER_CREATE_STEPS.map((step, index) => [step, index]))

const STEP_MOTION_VARIANTS: Variants = {
  center: {
    filter: 'blur(0px)',
    opacity: 1,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
    x: 0,
  },
  enter: (direction: number) => ({
    filter: 'blur(2px)',
    opacity: 0,
    x: direction * 16,
  }),
  exit: (direction: number) => ({
    filter: 'blur(2px)',
    opacity: 0,
    transition: { duration: 0.16, ease: 'easeIn' },
    x: direction * -10,
  }),
}

const STEP_GUIDANCE: Record<CharacterCreateStep, { title: string; body: string }> = {
  identity: {
    title: 'Le nom',
    body: 'C’est le nom que L’Aveugle et le récit utiliseront. Il ne change aucune règle du jeu.',
  },
  people: {
    title: 'Le peuple',
    body: 'Ton peuple raconte d’où tu viens. Ce n’est ni une classe ni un métier : choisis surtout l’origine qui t’inspire.',
  },
  vocation: {
    title: 'La vocation',
    body: 'Une vocation décrit ta manière d’affronter le monde. Passe d’une voie à l’autre : ce repère t’explique son rôle avec des mots simples.',
  },
  history: {
    title: 'La trace du passé',
    body: 'Cette réponse donne une prise au récit. Elle est facultative et ne te retire aucun point ni avantage.',
  },
  summary: {
    title: 'La relecture',
    body: 'Vérifie simplement que ce portrait te ressemble. Les règles du personnage seront confirmées plus tard par le jeu.',
  },
}

function buildAveugleHref(campaignId: string | undefined, ready = false): string {
  const params = new URLSearchParams()
  if (campaignId) params.set('campaign', campaignId)
  if (ready) params.set('character', 'ready')
  const query = params.toString()
  return query ? `${VELKHAR_WORLD.routes.aveugle}?${query}` : VELKHAR_WORLD.routes.aveugle
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'issues' in error) {
    const issues = (error as { issues?: { message?: string }[] }).issues
    return issues?.[0]?.message ?? 'Cette réponse ne peut pas être retenue.'
  }

  return 'Cette réponse ne peut pas être retenue.'
}

export function CharacterCreateFlow({ campaignId }: CharacterCreateFlowProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState<CharacterCreateDraft>(EMPTY_CHARACTER_DRAFT)
  const [currentStep, setCurrentStep] = useState<CharacterCreateStep>('identity')
  const [stepDirection, setStepDirection] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [previewedVocationId, setPreviewedVocationId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const completedSteps = useMemo(() => getCompletedSteps(currentStep, draft), [currentStep, draft])
  const currentMeta = STEP_CONTENT[currentStep]
  const people = getPeopleOption(draft.peopleId)
  const vocation = getVocationOption(draft.vocationId)
  const previewedVocation = previewedVocationId ? getVocationOption(previewedVocationId) : undefined
  const guidance = previewedVocation
    ? { title: previewedVocation.name, body: previewedVocation.guidance }
    : STEP_GUIDANCE[currentStep]
  const historyOptions = draft.vocationId ? (CHARACTER_HISTORY_OPTIONS[draft.vocationId] ?? []) : []

  useEffect(() => {
    const storedDraft = parseStoredCharacterDraft(
      window.sessionStorage.getItem(CHARACTER_DRAFT_STORAGE_KEY)
    )

    if (storedDraft) {
      setDraft(storedDraft)
      setCurrentStep(getResumeStep(storedDraft))
      setAnnouncement('Brouillon de création repris.')
    }

    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated || !isDirty) return

    const timeoutId = window.setTimeout(() => {
      window.sessionStorage.setItem(CHARACTER_DRAFT_STORAGE_KEY, JSON.stringify(draft))
    }, 150)

    return () => window.clearTimeout(timeoutId)
  }, [draft, hydrated, isDirty])

  useEffect(() => {
    if (!isDirty) return

    const preventAccidentalExit = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }

    window.addEventListener('beforeunload', preventAccidentalExit)
    return () => window.removeEventListener('beforeunload', preventAccidentalExit)
  }, [isDirty])

  useEffect(() => {
    if (stageRef.current) stageRef.current.scrollTop = 0
  }, [currentStep])

  const updateDraft = (values: Partial<CharacterCreateDraft>) => {
    setDraft((current) => ({ ...current, ...values }))
    setIsDirty(true)
    setError(null)
  }

  const moveToStep = (step: CharacterCreateStep) => {
    const currentIndex = STEP_INDEX.get(currentStep) ?? 0
    const nextIndex = STEP_INDEX.get(step) ?? currentIndex

    setStepDirection(nextIndex >= currentIndex ? 1 : -1)
    setPreviewedVocationId(null)
    setCurrentStep(step)
    setError(null)
    setAnnouncement(`${STEP_CONTENT[step].label}. ${STEP_CONTENT[step].description}`)
  }

  const submitIdentity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const name = characterNameSchema.parse(draft.name)
      updateDraft({ name })
      moveToStep('people')
    } catch (validationError) {
      setError(getErrorMessage(validationError))
    }
  }

  const selectPeople = (peopleId: string) => {
    updateDraft({ peopleId })
    moveToStep('vocation')
  }

  const selectPresetVocation = (vocationId: string) => {
    updateDraft({ freeConcept: '', historyReviewed: false, vocationId, vocationPath: 'preset' })
    moveToStep('history')
  }

  const continueCustomConcept = () => {
    try {
      const freeConcept = freeConceptSchema.parse(draft.freeConcept)
      updateDraft({ freeConcept, historyReviewed: false, vocationId: '', vocationPath: 'custom' })
      moveToStep('history')
    } catch (validationError) {
      setError(getErrorMessage(validationError))
    }
  }

  const continueHistory = () => {
    try {
      const backstory = backstorySchema.parse(draft.backstory)
      updateDraft({ backstory, historyReviewed: true })
      moveToStep('summary')
    } catch (validationError) {
      setError(getErrorMessage(validationError))
    }
  }

  const replayCreation = () => {
    window.sessionStorage.removeItem(CHARACTER_DRAFT_STORAGE_KEY)
    window.localStorage.removeItem(CHARACTER_RESULT_STORAGE_KEY)
    setDraft(EMPTY_CHARACTER_DRAFT)
    setIsDirty(false)
    moveToStep('identity')
  }

  const finishCreation = async () => {
    const result = createCharacterResult(draft)
    setError(null)
    setIsSubmitting(true)

    try {
      // Anonymous visitors reaching the Forge first have no Supabase session
      // yet; without one the `/api/character` proxy sends a tokenless request
      // and the backend rejects it ("Missing bearer token"). Guarantee a
      // session before the protected call.
      await ensureAnonymousSession()
      await createCharacter(result)
      // Kept as the hub's client-side read model (`aveugle-hub-model.ts`) —
      // the backend `Character` created above is now the source of truth,
      // this local copy only drives the Forge/hub display until the hub
      // reads the character from the API too.
      window.localStorage.setItem(CHARACTER_RESULT_STORAGE_KEY, JSON.stringify(result))
      window.sessionStorage.removeItem(CHARACTER_DRAFT_STORAGE_KEY)
      setIsDirty(false)
      router.push(buildAveugleHref(campaignId, true))
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'L’Aveugle n’a pas pu retenir ce portrait. Réessaie.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const leaveCreation = () => {
    if (isDirty && !window.confirm('Quitter la création ? Ton brouillon restera disponible.')) {
      return
    }

    router.push(buildAveugleHref(campaignId))
  }

  const stepperItems = CHARACTER_CREATE_STEPS.map((step) => {
    const meta = STEP_CONTENT[step]
    const currentIndex = STEP_INDEX.get(currentStep) ?? 0
    const stepIndex = STEP_INDEX.get(step) ?? 0

    return {
      disabled: stepIndex > currentIndex && !completedSteps.includes(step),
      icon: <GameIcon decorative name={meta.icon} size={32} />,
      id: step,
      label: meta.label,
    }
  })

  if (!hydrated) {
    return (
      <main className="character-create" aria-busy="true">
        <div className="character-create__scene" aria-hidden="true" />
        <div className="character-create__veil" aria-hidden="true" />
        <GamePanel className="character-create__panel character-create__loading" padding="lg">
          <span className="character-create__skeleton character-create__skeleton--steps" />
          <span className="character-create__skeleton character-create__skeleton--title" />
          <span className="character-create__skeleton character-create__skeleton--field" />
        </GamePanel>
      </main>
    )
  }

  return (
    <main className="character-create">
      <div className="character-create__scene" aria-hidden="true" />
      <div className="character-create__veil" aria-hidden="true" />
      <button className="character-create__exit" type="button" onClick={leaveCreation}>
        <GameIcon decorative name="arrow" size={24} />
        Retour à L’Aveugle
      </button>

      <div className="character-create__composition">
        <GamePanel
          as="aside"
          aria-live="polite"
          className="character-create__heritage"
          key={`${currentStep}-${previewedVocationId ?? 'default'}`}
          padding="none"
          variant="aside-frame"
        >
          <span className="character-create__heritage-medallion" aria-hidden="true">
            <GameIcon decorative name="book" size={32} />
          </span>
          <strong>{guidance.title}</strong>
          <span className="character-create__heritage-divider" aria-hidden="true" />
          <p>{guidance.body}</p>
        </GamePanel>

        <GamePanel
          className="character-create__panel"
          data-step={currentStep}
          padding="none"
          tone="gold"
          variant="form-frame"
        >
          <div className="character-create__stepper-surface">
            <GameStepper
              ariaLabel="Création du personnage"
              completedIds={completedSteps}
              currentId={currentStep}
              items={stepperItems}
              onStepChange={(id) => moveToStep(id as CharacterCreateStep)}
              orientation="horizontal"
              variant="creation"
            />
          </div>

          <div ref={stageRef} className="character-create__stage" aria-live="polite">
            <AnimatePresence custom={stepDirection} initial={false} mode="wait">
              <motion.section
                key={currentStep}
                className="character-create__step"
                aria-labelledby={`character-create-${currentStep}`}
                animate="center"
                custom={stepDirection}
                exit={reduceMotion ? undefined : 'exit'}
                initial={reduceMotion ? false : 'enter'}
                variants={STEP_MOTION_VARIANTS}
              >
                <GameSectionHeading
                  description={currentMeta.description}
                  id={`character-create-${currentStep}`}
                  title={currentMeta.label}
                />

                {currentStep === 'identity' ? (
                  <form className="character-create__form" onSubmit={submitIdentity} noValidate>
                    <GameField error={error ?? undefined} label="Nom du personnage" required>
                      <GameInput
                        autoComplete="off"
                        invalid={Boolean(error)}
                        maxLength={30}
                        onChange={(event) => updateDraft({ name: event.target.value })}
                        placeholder="Entre ton nom…"
                        variant="framed-v2"
                        value={draft.name}
                      />
                    </GameField>
                    <GameButton
                      trailingIcon={<GameIcon decorative name="arrow" size={24} />}
                      type="submit"
                      variant="radiant"
                    >
                      Suivant
                    </GameButton>
                  </form>
                ) : null}

                {currentStep === 'people' ? (
                  <div className="character-create__choice-grid character-create__choice-grid--people">
                    {CHARACTER_PEOPLE_OPTIONS.map((option) => (
                      <DialogueChoice
                        className="character-create__people-choice"
                        icon={<GameIcon decorative name={option.icon} size={32} />}
                        key={option.id}
                        onClick={() => selectPeople(option.id)}
                        selected={draft.peopleId === option.id}
                      >
                        <strong>{option.name}</strong>
                        <span>{option.description}</span>
                      </DialogueChoice>
                    ))}
                  </div>
                ) : null}

                {currentStep === 'vocation' ? (
                  <div className="character-create__vocation-step">
                    <a
                      className="character-create__custom-shortcut"
                      href="#character-custom-concept"
                    >
                      <span className="character-create__custom-shortcut-icon" aria-hidden="true">
                        <GameIcon decorative name="quill" size={24} />
                      </span>
                      <span>
                        <small>Tu as déjà ton idée ?</small>
                        <strong>Écris directement ton propre concept</strong>
                      </span>
                      <span className="character-create__custom-shortcut-action">Commencer</span>
                    </a>

                    <div className="character-create__choice-grid character-create__choice-grid--vocations">
                      {CHARACTER_VOCATION_OPTIONS.map((option) => (
                        <ArchetypeCard
                          actionLabel="Suivre cette voie"
                          description={option.description}
                          eyebrow={option.eyebrow}
                          id={option.id}
                          illustration={
                            <Image
                              alt={`Portrait représentant la voie ${option.name}`}
                              className="character-create__vocation-image"
                              height={640}
                              sizes="(max-width: 640px) 100vw, 22vw"
                              src={option.imageSrc}
                              width={960}
                            />
                          }
                          key={option.id}
                          onPreview={setPreviewedVocationId}
                          onPreviewEnd={() => setPreviewedVocationId(null)}
                          onSelect={selectPresetVocation}
                          selected={
                            draft.vocationPath === 'preset' && draft.vocationId === option.id
                          }
                          title={option.name}
                        />
                      ))}
                    </div>

                    <div className="character-create__custom-path" id="character-custom-concept">
                      <div className="character-create__custom-intro">
                        <span className="character-create__custom-icon" aria-hidden="true">
                          <GameIcon decorative name="quill" size={32} />
                        </span>
                        <div>
                          <span className="character-create__custom-eyebrow">
                            Aucune voie ne te ressemble ?
                          </span>
                          <h3>Écris ton propre concept</h3>
                          <p>
                            Décris ton personnage avec tes mots. L’Aveugle traduira ensuite cette
                            idée dans les règles du jeu.
                          </p>
                        </div>
                      </div>

                      <div className="character-create__custom-form">
                        <GameField
                          error={error ?? undefined}
                          hint="Quelques phrases suffisent : une origine, un talent et ce que ton personnage recherche."
                          label="Ton idée de personnage"
                          required
                        >
                          <GameTextarea
                            invalid={Boolean(error)}
                            maxLength={500}
                            onChange={(event) =>
                              updateDraft({
                                freeConcept: event.target.value,
                                vocationId: '',
                                vocationPath: 'custom',
                              })
                            }
                            placeholder="Une vieille chasseuse de Calcinés qui cherche un dernier monstre…"
                            rows={4}
                            value={draft.freeConcept}
                          />
                        </GameField>
                        <GameButton onClick={continueCustomConcept} size="sm" variant="secondary">
                          Confier ce concept à L’Aveugle
                        </GameButton>
                      </div>
                    </div>
                  </div>
                ) : null}

                {currentStep === 'history' ? (
                  <div className="character-create__history-step">
                    {historyOptions.length > 0 ? (
                      <div className="character-create__history-options">
                        {historyOptions.map((history) => (
                          <DialogueChoice
                            key={history}
                            icon={<GameIcon decorative name="memory" size={32} />}
                            onClick={() => updateDraft({ backstory: history })}
                            selected={draft.backstory === history}
                          >
                            {history}
                          </DialogueChoice>
                        ))}
                      </div>
                    ) : null}

                    <GameField
                      error={error ?? undefined}
                      hint="Facultatif. Tu peux préciser une dette, une peur ou une personne laissée derrière toi."
                      label={
                        historyOptions.length > 0
                          ? 'Ou raconte-le autrement'
                          : 'Ce que tu laisses derrière toi'
                      }
                    >
                      <GameTextarea
                        invalid={Boolean(error)}
                        maxLength={500}
                        onChange={(event) => updateDraft({ backstory: event.target.value })}
                        placeholder="Quelques mots suffisent…"
                        rows={3}
                        value={draft.backstory}
                      />
                    </GameField>
                    <GameButton onClick={continueHistory} variant="radiant">
                      {draft.backstory ? 'Retenir cette histoire' : 'Garder le silence'}
                    </GameButton>
                  </div>
                ) : null}

                {currentStep === 'summary' ? (
                  <div className="character-create__summary">
                    <dl>
                      <div>
                        <dt>Nom</dt>
                        <dd>{draft.name}</dd>
                      </div>
                      <div>
                        <dt>Peuple</dt>
                        <dd>{people?.name ?? 'Non choisi'}</dd>
                      </div>
                      <div>
                        <dt>Voie</dt>
                        <dd>
                          {draft.vocationPath === 'custom'
                            ? 'Concept libre, vocation hôte à confirmer par L’Aveugle'
                            : (vocation?.name ?? 'Non choisie')}
                        </dd>
                      </div>
                      {draft.freeConcept ? (
                        <div>
                          <dt>Concept</dt>
                          <dd>{draft.freeConcept}</dd>
                        </div>
                      ) : null}
                      <div>
                        <dt>Trace</dt>
                        <dd>{draft.backstory || 'Aucune histoire confiée.'}</dd>
                      </div>
                    </dl>

                    <p className="character-create__summary-note">
                      Cette fiche est un récapitulatif. Les règles et le triptyque seront validés
                      hors de cette interface.
                    </p>

                    {error ? (
                      <p className="character-create__summary-error" role="alert">
                        {error}
                      </p>
                    ) : null}

                    <div className="character-create__summary-actions">
                      <GameButton
                        disabled={isSubmitting}
                        onClick={replayCreation}
                        size="sm"
                        variant="ghost"
                      >
                        Rejouer la création
                      </GameButton>
                      <GameButton loading={isSubmitting} onClick={finishCreation} variant="radiant">
                        Retourner auprès de L’Aveugle
                      </GameButton>
                    </div>
                  </div>
                ) : null}
              </motion.section>
            </AnimatePresence>
          </div>
        </GamePanel>
      </div>

      <p className="character-create__announcement" aria-live="polite">
        {announcement}
      </p>
    </main>
  )
}
