'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'

import { ArchetypeCard } from '@/components/ui/grimoire/ArchetypeCard/ArchetypeCard'
import { DialogueChoice } from '@/components/ui/grimoire/DialogueChoice/DialogueChoice'
import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'
import { GameField } from '@/components/ui/grimoire/GameField/GameField'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GameInput } from '@/components/ui/grimoire/GameInput/GameInput'
import { GameSceneLayout } from '@/components/ui/grimoire/GameSceneLayout/GameSceneLayout'
import { GameSectionHeading } from '@/components/ui/grimoire/GameSectionHeading/GameSectionHeading'
import { GameStepper } from '@/components/ui/grimoire/GameStepper/GameStepper'
import { GameTextarea } from '@/components/ui/grimoire/GameTextarea/GameTextarea'
import { ensureAnonymousSession } from '@/lib/supabase/ensure-session'

import {
  VelkharDormantHud,
  VelkharFlowTopBar,
} from '../../../_components/VelkharFlowChrome/VelkharFlowChrome'
import { VELKHAR_WORLD } from '../../../_config/velkhar-world'
import {
  getCharacterHistoryOptions,
  getCharacterPeopleOptions,
  getCharacterVocationOptions,
  getLocalizedHistoryValue,
  getPeopleOption,
  getVocationOption,
  isHistoryOptionSelected,
} from '../_data/character-create-options'
import { createCharacter, resolveVocation } from '../_lib/api'
import {
  CHARACTER_CREATE_STEPS,
  CHARACTER_DRAFT_STORAGE_KEY,
  CHARACTER_RESULT_STORAGE_KEY,
  EMPTY_CHARACTER_DRAFT,
  createCharacterSchemas,
  createCharacterResult,
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

function buildAveugleHref(campaignId: string | undefined): string {
  const params = new URLSearchParams()
  if (campaignId) params.set('campaign', campaignId)
  const query = params.toString()
  return query ? `${VELKHAR_WORLD.routes.aveugle}?${query}` : VELKHAR_WORLD.routes.aveugle
}

function buildPostCreationHref(campaignId: string | undefined): string {
  const params = new URLSearchParams({ character: 'ready' })
  if (campaignId) params.set('campaign', campaignId)
  return `${VELKHAR_WORLD.routes.aveugle}?${params.toString()}`
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'issues' in error) {
    const issues = (error as { issues?: { message?: string }[] }).issues
    return issues?.[0]?.message ?? fallback
  }

  return fallback
}

export function CharacterCreateFlow({ campaignId }: CharacterCreateFlowProps) {
  const locale = useLocale()
  const t = useTranslations('Forge')
  const sessionT = useTranslations('Session')
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
  const [vocationAnnouncement, setVocationAnnouncement] = useState('')
  const schemas = useMemo(
    () =>
      createCharacterSchemas({
        backstoryTooLong: t('backstoryTooLong'),
        conceptTooLong: t('conceptTooLong'),
        conceptTooShort: t('conceptTooShort'),
        nameRequired: t('nameRequired'),
        nameTooLong: t('nameTooLong'),
      }),
    [t]
  )
  const stepContent = {
    identity: {
      description: t('identityDescription'),
      icon: 'stranger' as const,
      label: t('identityLabel'),
    },
    people: {
      description: t('peopleDescription'),
      icon: 'mage' as const,
      label: t('peopleLabel'),
    },
    vocation: {
      description: t('vocationDescription'),
      icon: 'crossed-swords' as const,
      label: t('vocationLabel'),
    },
    history: {
      description: t('historyDescription'),
      icon: 'journal' as const,
      label: t('historyLabel'),
    },
    summary: {
      description: t('summaryDescription'),
      icon: 'book' as const,
      label: t('summaryLabel'),
    },
  }
  const stepGuidance: Record<CharacterCreateStep, { title: string; body: string }> = {
    identity: { title: t('identityGuideTitle'), body: t('identityGuideBody') },
    people: { title: t('peopleGuideTitle'), body: t('peopleGuideBody') },
    vocation: { title: t('vocationGuideTitle'), body: t('vocationGuideBody') },
    history: { title: t('historyGuideTitle'), body: t('historyGuideBody') },
    summary: { title: t('summaryGuideTitle'), body: t('summaryGuideBody') },
  }
  const peopleOptions = getCharacterPeopleOptions(locale)
  const vocationOptions = getCharacterVocationOptions(locale)

  const completedSteps = useMemo(() => getCompletedSteps(currentStep, draft), [currentStep, draft])
  const currentMeta = stepContent[currentStep]
  const people = getPeopleOption(draft.peopleId, locale)
  const vocation = getVocationOption(draft.vocationId, locale)
  const resolvedVocationOption =
    draft.vocationResolutionStatus === 'resolved'
      ? getVocationOption(draft.vocationId, locale)
      : undefined
  const previewedVocation = previewedVocationId
    ? getVocationOption(previewedVocationId, locale)
    : undefined
  const guidance = previewedVocation
    ? { title: previewedVocation.name, body: previewedVocation.guidance }
    : stepGuidance[currentStep]
  const historyOptions = getCharacterHistoryOptions(draft.vocationId, locale)

  useEffect(() => {
    const storedDraft = parseStoredCharacterDraft(
      window.sessionStorage.getItem(CHARACTER_DRAFT_STORAGE_KEY)
    )

    if (storedDraft) {
      setDraft(storedDraft)
      setCurrentStep(getResumeStep(storedDraft))
      setAnnouncement(t('draftResumed'))
    }

    setHydrated(true)
  }, [t])

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
    setAnnouncement(`${stepContent[step].label}. ${stepContent[step].description}`)
  }

  const submitIdentity = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const name = schemas.name.parse(draft.name)
      updateDraft({ name })
      moveToStep('people')
    } catch (validationError) {
      setError(getErrorMessage(validationError, t('invalidAnswer')))
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

  const continueCustomConcept = async () => {
    let freeConcept: string
    try {
      freeConcept = schemas.freeConcept.parse(draft.freeConcept)
    } catch (validationError) {
      setError(getErrorMessage(validationError, t('invalidAnswer')))
      return
    }

    updateDraft({
      customVocationName: '',
      freeConcept,
      narrativeTrait: '',
      shiftedSkills: [],
      vocationId: '',
      vocationPath: 'custom',
      vocationResolutionStatus: 'pending',
    })

    try {
      const result = await resolveVocation(freeConcept)
      if (result.status === 'resolved') {
        updateDraft({
          customVocationName: result.customVocationName,
          narrativeTrait: result.narrativeTrait,
          shiftedSkills: result.shiftedSkills,
          vocationId: result.vocationId,
          vocationResolutionStatus: 'resolved',
        })
        setVocationAnnouncement(result.announcement)
      } else {
        updateDraft({ vocationResolutionStatus: 'fallback' })
      }
    } catch {
      updateDraft({ vocationResolutionStatus: 'error' })
    }
  }

  const acceptResolvedVocation = () => {
    updateDraft({ historyReviewed: false })
    moveToStep('history')
  }

  const rejectResolvedVocation = () => {
    updateDraft({
      customVocationName: '',
      freeConcept: '',
      narrativeTrait: '',
      shiftedSkills: [],
      vocationId: '',
      vocationPath: 'preset',
      vocationResolutionStatus: 'idle',
    })
  }

  const continueHistory = () => {
    try {
      const backstory = schemas.backstory.parse(draft.backstory)
      updateDraft({ backstory, historyReviewed: true })
      moveToStep('summary')
    } catch (validationError) {
      setError(getErrorMessage(validationError, t('invalidAnswer')))
    }
  }

  const reviewCreation = () => {
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
      router.push(buildPostCreationHref(campaignId))
    } catch {
      setError(t('submissionError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const leaveCreation = () => {
    if (isDirty && !window.confirm(t('leaveConfirmation'))) {
      return
    }

    router.push(buildAveugleHref(campaignId))
  }

  const stepperItems = CHARACTER_CREATE_STEPS.map((step) => {
    const meta = stepContent[step]
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
        <GameSceneLayout
          background={
            <>
              <div className="character-create__scene" aria-hidden="true" />
              <div className="character-create__veil" aria-hidden="true" />
            </>
          }
          bottom={<VelkharDormantHud />}
          className="character-create__layout"
          reader={
            <div className="character-create__loading">
              <span className="character-create__skeleton character-create__skeleton--steps" />
              <span className="character-create__skeleton character-create__skeleton--title" />
              <span className="character-create__skeleton character-create__skeleton--field" />
            </div>
          }
          scene={<div />}
          top={<VelkharFlowTopBar location={t('creationLabel')} region={sessionT('regionLabel')} />}
        />
      </main>
    )
  }

  return (
    <main className="character-create">
      <GameSceneLayout
        background={
          <>
            <div className="character-create__scene" aria-hidden="true" />
            <div className="character-create__veil" aria-hidden="true" />
          </>
        }
        bottom={<VelkharDormantHud />}
        className="character-create__layout"
        scene={
          <div className="character-create__scene-content">
            <button className="character-create__exit" type="button" onClick={leaveCreation}>
              <GameIcon decorative name="arrow" size={24} />
              {t('backToInn')}
            </button>
            <aside
              aria-live="polite"
              className="character-create__heritage"
              key={`${currentStep}-${previewedVocationId ?? 'default'}`}
            >
              <span className="character-create__heritage-medallion" aria-hidden="true">
                <GameIcon decorative name="book" size={32} />
              </span>
              <strong>{guidance.title}</strong>
              <span className="character-create__heritage-divider" aria-hidden="true" />
              <p>{guidance.body}</p>
            </aside>
          </div>
        }
        reader={
          <div className="character-create__composition">
            <div className="character-create__panel" data-step={currentStep}>
              <div className="character-create__stepper-surface">
                <GameStepper
                  ariaLabel={t('creationLabel')}
                  completedIds={completedSteps}
                  currentId={currentStep}
                  items={stepperItems}
                  onStepChange={(id) => moveToStep(id as CharacterCreateStep)}
                  orientation="horizontal"
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

                    <div className="character-create__inline-guidance">
                      <GameIcon decorative name="book" size={24} />
                      <p>
                        <strong>{guidance.title}</strong>
                        <span>{guidance.body}</span>
                      </p>
                    </div>

                    {currentStep === 'identity' ? (
                      <form className="character-create__form" onSubmit={submitIdentity} noValidate>
                        <GameField error={error ?? undefined} label={t('nameLabel')} required>
                          <GameInput
                            autoComplete="off"
                            invalid={Boolean(error)}
                            maxLength={30}
                            onChange={(event) => updateDraft({ name: event.target.value })}
                            placeholder={t('namePlaceholder')}
                            value={draft.name}
                          />
                        </GameField>
                        <GameButton
                          trailingIcon={<GameIcon decorative name="arrow" size={24} />}
                          type="submit"
                          variant="radiant"
                        >
                          {t('next')}
                        </GameButton>
                      </form>
                    ) : null}

                    {currentStep === 'people' ? (
                      <div className="character-create__choice-grid character-create__choice-grid--people">
                        {peopleOptions.map((option) => (
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
                          <span
                            className="character-create__custom-shortcut-icon"
                            aria-hidden="true"
                          >
                            <GameIcon decorative name="quill" size={24} />
                          </span>
                          <span>
                            <small>{t('customShortcutEyebrow')}</small>
                            <strong>{t('customShortcutTitle')}</strong>
                          </span>
                          <span className="character-create__custom-shortcut-action">
                            {t('start')}
                          </span>
                        </a>

                        <div className="character-create__choice-grid character-create__choice-grid--vocations">
                          {vocationOptions.map((option) => (
                            <ArchetypeCard
                              actionLabel={t('followPath')}
                              description={option.description}
                              eyebrow={option.eyebrow}
                              id={option.id}
                              illustration={
                                <Image
                                  alt={t('vocationPortrait', { name: option.name })}
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
                              selectedLabel={t('selectedPath')}
                              title={option.name}
                            />
                          ))}
                        </div>

                        <div
                          className="character-create__custom-path"
                          id="character-custom-concept"
                        >
                          <div className="character-create__custom-intro">
                            <span className="character-create__custom-icon" aria-hidden="true">
                              <GameIcon decorative name="quill" size={32} />
                            </span>
                            <div>
                              <span className="character-create__custom-eyebrow">
                                {t('customEyebrow')}
                              </span>
                              <h3>{t('customTitle')}</h3>
                              <p>{t('customDescription')}</p>
                            </div>
                          </div>

                          {draft.vocationPath === 'custom' &&
                          draft.vocationResolutionStatus !== 'idle' ? (
                            <div className="character-create__resolution">
                              {draft.vocationResolutionStatus === 'pending' ? (
                                <div className="character-create__resolution-pending">
                                  <GameButton disabled loading variant="secondary">
                                    {t('resolvingConcept')}
                                  </GameButton>
                                </div>
                              ) : null}

                              {draft.vocationResolutionStatus === 'resolved' &&
                              resolvedVocationOption ? (
                                <div className="character-create__resolution-proposal">
                                  <p className="character-create__resolution-announcement">
                                    {vocationAnnouncement}
                                  </p>
                                  <ArchetypeCard
                                    description={resolvedVocationOption.description}
                                    eyebrow={resolvedVocationOption.eyebrow}
                                    id={resolvedVocationOption.id}
                                    illustration={
                                      <Image
                                        alt={t('vocationPortrait', {
                                          name:
                                            draft.customVocationName || resolvedVocationOption.name,
                                        })}
                                        className="character-create__vocation-image"
                                        height={640}
                                        sizes="(max-width: 640px) 100vw, 22vw"
                                        src={resolvedVocationOption.imageSrc}
                                        width={960}
                                      />
                                    }
                                    selected
                                    selectedLabel={t('selectedPath')}
                                    title={draft.customVocationName || resolvedVocationOption.name}
                                  />
                                  {draft.narrativeTrait ? (
                                    <p className="character-create__resolution-trait">
                                      {draft.narrativeTrait}
                                    </p>
                                  ) : null}
                                  {draft.shiftedSkills.length > 0 ? (
                                    <ul className="character-create__resolution-skills">
                                      {draft.shiftedSkills.map((skill) => (
                                        <li key={skill.shifted}>
                                          <strong>{skill.shifted}</strong>
                                          <span>{skill.original}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : null}
                                  <div className="character-create__resolution-actions">
                                    <GameButton
                                      onClick={rejectResolvedVocation}
                                      size="sm"
                                      variant="ghost"
                                    >
                                      {t('rejectProposal')}
                                    </GameButton>
                                    <GameButton
                                      onClick={acceptResolvedVocation}
                                      size="sm"
                                      variant="radiant"
                                    >
                                      {t('acceptProposal')}
                                    </GameButton>
                                  </div>
                                </div>
                              ) : null}

                              {draft.vocationResolutionStatus === 'fallback' ? (
                                <p className="character-create__resolution-fallback" role="alert">
                                  {t('resolutionFallback')}
                                </p>
                              ) : null}

                              {draft.vocationResolutionStatus === 'error' ? (
                                <div className="character-create__resolution-error" role="alert">
                                  <p>{t('resolutionError')}</p>
                                  <GameButton
                                    onClick={() => void continueCustomConcept()}
                                    size="sm"
                                    variant="secondary"
                                  >
                                    {t('retry')}
                                  </GameButton>
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <div className="character-create__custom-form">
                              <GameField
                                error={error ?? undefined}
                                hint={t('customHint')}
                                label={t('customLabel')}
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
                                  placeholder={t('customPlaceholder')}
                                  rows={4}
                                  value={draft.freeConcept}
                                />
                              </GameField>
                              <GameButton
                                onClick={() => void continueCustomConcept()}
                                size="sm"
                                variant="secondary"
                              >
                                {t('submitConcept')}
                              </GameButton>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}

                    {currentStep === 'history' ? (
                      <div className="character-create__history-step">
                        {historyOptions.length > 0 ? (
                          <div className="character-create__history-options">
                            {historyOptions.map((history) => (
                              <DialogueChoice
                                key={history.id}
                                icon={<GameIcon decorative name="memory" size={32} />}
                                onClick={() => updateDraft({ backstory: history.label })}
                                selected={isHistoryOptionSelected(draft.backstory, history)}
                              >
                                {history.label}
                              </DialogueChoice>
                            ))}
                          </div>
                        ) : null}

                        <GameField
                          error={error ?? undefined}
                          hint={t('historyHint')}
                          label={
                            historyOptions.length > 0
                              ? t('historyAlternativeLabel')
                              : t('historyFreeLabel')
                          }
                        >
                          <GameTextarea
                            invalid={Boolean(error)}
                            maxLength={500}
                            onChange={(event) => updateDraft({ backstory: event.target.value })}
                            placeholder={t('historyPlaceholder')}
                            rows={3}
                            value={draft.backstory}
                          />
                        </GameField>
                        <GameButton onClick={continueHistory} variant="radiant">
                          {draft.backstory ? t('keepHistory') : t('keepSilence')}
                        </GameButton>
                      </div>
                    ) : null}

                    {currentStep === 'summary' ? (
                      <div className="character-create__summary">
                        <dl>
                          <div>
                            <dt>{t('nameSummary')}</dt>
                            <dd>{draft.name}</dd>
                          </div>
                          <div>
                            <dt>{t('peopleSummary')}</dt>
                            <dd>{people?.name ?? t('notChosenMasculine')}</dd>
                          </div>
                          <div>
                            <dt>{t('pathSummary')}</dt>
                            <dd>
                              {draft.vocationPath === 'custom'
                                ? draft.customVocationName.trim() ||
                                  (vocation?.name ?? t('notChosenFeminine'))
                                : (vocation?.name ?? t('notChosenFeminine'))}
                            </dd>
                          </div>
                          {draft.freeConcept ? (
                            <div>
                              <dt>{t('conceptSummary')}</dt>
                              <dd>{draft.freeConcept}</dd>
                            </div>
                          ) : null}
                          {draft.vocationPath === 'custom' && draft.narrativeTrait ? (
                            <div>
                              <dt>{t('narrativeTraitSummary')}</dt>
                              <dd>{draft.narrativeTrait}</dd>
                            </div>
                          ) : null}
                          <div>
                            <dt>{t('traceSummary')}</dt>
                            <dd>
                              {draft.backstory
                                ? getLocalizedHistoryValue(draft.backstory, locale)
                                : t('noHistory')}
                            </dd>
                          </div>
                        </dl>

                        <p className="character-create__summary-note">{t('summaryNote')}</p>

                        {error ? (
                          <p className="character-create__summary-error" role="alert">
                            {error}
                          </p>
                        ) : null}

                        <div className="character-create__summary-actions">
                          <GameButton
                            disabled={isSubmitting}
                            onClick={reviewCreation}
                            size="sm"
                            variant="ghost"
                          >
                            {t('reviewChoices')}
                          </GameButton>
                          <GameButton
                            loading={isSubmitting}
                            onClick={finishCreation}
                            variant="radiant"
                          >
                            {t('createCharacter')}
                          </GameButton>
                        </div>
                      </div>
                    ) : null}
                  </motion.section>
                </AnimatePresence>
              </div>
            </div>
            <p className="character-create__announcement" aria-live="polite">
              {announcement}
            </p>
          </div>
        }
        top={<VelkharFlowTopBar location={currentMeta.label} region={sessionT('regionLabel')} />}
      />
    </main>
  )
}
