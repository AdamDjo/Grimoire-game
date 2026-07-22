import { z } from 'zod'

export const CHARACTER_CREATE_STEPS = [
  'identity',
  'people',
  'vocation',
  'history',
  'summary',
] as const

export type CharacterCreateStep = (typeof CHARACTER_CREATE_STEPS)[number]
export type VocationPath = 'preset' | 'custom'

export interface CharacterCreateDraft {
  version: 1
  name: string
  peopleId: string
  vocationPath: VocationPath
  vocationId: string
  freeConcept: string
  backstory: string
  historyReviewed: boolean
}

export const EMPTY_CHARACTER_DRAFT: CharacterCreateDraft = {
  version: 1,
  name: '',
  peopleId: '',
  vocationPath: 'preset',
  vocationId: '',
  freeConcept: '',
  backstory: '',
  historyReviewed: false,
}

const storedDraftSchema = z.object({
  version: z.literal(1),
  name: z.string().max(30),
  peopleId: z.string().max(40),
  vocationPath: z.enum(['preset', 'custom']),
  vocationId: z.string().max(40),
  freeConcept: z.string().max(500),
  backstory: z.string().max(500),
  historyReviewed: z.boolean(),
})

interface CharacterValidationMessages {
  backstoryTooLong: string
  conceptTooLong: string
  conceptTooShort: string
  nameRequired: string
  nameTooLong: string
}

const DEFAULT_VALIDATION_MESSAGES: CharacterValidationMessages = {
  backstoryTooLong: 'This history must fit within 500 characters.',
  conceptTooLong: 'The concept must fit within 500 characters.',
  conceptTooShort: 'Describe your concept in a few more words.',
  nameRequired: 'The Blind One is waiting for a name.',
  nameTooLong: 'The name must fit within 30 characters.',
}

export function createCharacterSchemas(
  messages: CharacterValidationMessages = DEFAULT_VALIDATION_MESSAGES
) {
  return {
    backstory: z.string().trim().max(500, messages.backstoryTooLong),
    freeConcept: z
      .string()
      .trim()
      .min(12, messages.conceptTooShort)
      .max(500, messages.conceptTooLong),
    name: z.string().trim().min(1, messages.nameRequired).max(30, messages.nameTooLong),
  }
}

export const {
  backstory: backstorySchema,
  freeConcept: freeConceptSchema,
  name: characterNameSchema,
} = createCharacterSchemas()

export const CHARACTER_DRAFT_STORAGE_KEY = 'grimoire.character-create.draft.v1'
export const CHARACTER_RESULT_STORAGE_KEY = 'grimoire.character-create.result.v1'

export function parseStoredCharacterDraft(value: string | null): CharacterCreateDraft | null {
  if (!value) return null

  try {
    const result = storedDraftSchema.safeParse(JSON.parse(value))
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export function parseStoredCharacterResult(value: string | null): CharacterCreateDraft | null {
  return parseStoredCharacterDraft(value)
}

export function getResumeStep(draft: CharacterCreateDraft): CharacterCreateStep {
  if (!characterNameSchema.safeParse(draft.name).success) return 'identity'
  if (!draft.peopleId) return 'people'
  if (draft.vocationPath === 'custom') {
    if (!freeConceptSchema.safeParse(draft.freeConcept).success) return 'vocation'
    return draft.historyReviewed ? 'summary' : 'history'
  }
  if (!draft.vocationId) return 'vocation'
  return draft.historyReviewed ? 'summary' : 'history'
}

export function getCompletedSteps(
  currentStep: CharacterCreateStep,
  draft: CharacterCreateDraft
): CharacterCreateStep[] {
  const currentIndex = CHARACTER_CREATE_STEPS.indexOf(currentStep)
  const completed = CHARACTER_CREATE_STEPS.filter((_, index) => index < currentIndex)

  if (draft.backstory || currentStep === 'summary') {
    return completed
  }

  return completed.filter((step) => step !== 'history')
}

export function createCharacterResult(draft: CharacterCreateDraft): CharacterCreateDraft {
  return {
    ...draft,
    name: characterNameSchema.parse(draft.name),
    freeConcept: draft.freeConcept.trim(),
    backstory: draft.backstory.trim(),
  }
}
