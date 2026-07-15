'use client'

import { useRef, useState } from 'react'

import { DialogueChoice } from '@/components/ui/grimoire/DialogueChoice/DialogueChoice'
import { DialogueChoiceGroup } from '@/components/ui/grimoire/DialogueChoiceGroup/DialogueChoiceGroup'
import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GamePanel } from '@/components/ui/grimoire/GamePanel/GamePanel'
import { NarrativeComposer } from '@/components/ui/grimoire/NarrativeComposer/NarrativeComposer'
import { gsap, useGSAP } from '@/lib/gsap-init'

import { AVEUGLE_MEMORIES, AVEUGLE_OMENS, AVEUGLE_TOPICS } from './_data/aveugle-hub-fixtures'
import { addSeenId, type AubergePreparationState } from './auberge-preparation'

import type { AveugleMemoryId, AveugleOmenId, AveugleTopicId } from './_data/aveugle-hub-fixtures'

export type AubergePanel = 'dialogue' | 'memories' | 'omen'

interface AubergeDockProps {
  activePanel: AubergePanel
  isActiveSession: boolean
  onActivePanelChange: (panel: AubergePanel) => void
  onPreparationChange: (preparation: AubergePreparationState) => void
  openingLine: string
  preparation: AubergePreparationState
}

const PANEL_META = {
  dialogue: { icon: 'eye', title: 'L’Aveugle' },
  memories: { icon: 'memory', title: 'Souvenirs' },
  omen: { icon: 'moon', title: 'Présage' },
} as const

export function AubergeDock({
  activePanel,
  isActiveSession,
  onActivePanelChange,
  onPreparationChange,
  openingLine,
  preparation,
}: AubergeDockProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<AveugleTopicId | null>(null)
  const [selectedMemoryId, setSelectedMemoryId] = useState<AveugleMemoryId | null>(null)
  const [customAction, setCustomAction] = useState('')
  const [customResponse, setCustomResponse] = useState<string | null>(null)
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isTopicExpanded, setIsTopicExpanded] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const emblemRef = useRef<HTMLDivElement>(null)

  const selectedTopic = AVEUGLE_TOPICS.find((topic) => topic.id === selectedTopicId)
  const selectedMemory = AVEUGLE_MEMORIES.find((memory) => memory.id === selectedMemoryId)
  const selectedOmen = AVEUGLE_OMENS.find((omen) => omen.id === preparation.selectedOmenId)
  const dialogueResponse = customResponse ?? selectedTopic?.response ?? openingLine
  const dialogueMode =
    selectedTopic || customResponse ? 'answer' : isComposerOpen ? 'composer' : 'topics'
  const panelMeta = PANEL_META[activePanel]
  const unreadTopicCount = AVEUGLE_TOPICS.filter(
    (topic) => topic.isNew && !preparation.seenTopicIds.includes(topic.id)
  ).length
  const unreadMemoryCount = AVEUGLE_MEMORIES.filter(
    (memory) => memory.isNew && !preparation.seenMemoryIds.includes(memory.id)
  ).length
  const contentKey = [
    activePanel,
    dialogueMode,
    dialogueResponse,
    selectedMemoryId,
    preparation.selectedOmenId,
  ].join(':')

  useGSAP(
    () => {
      const stage = stageRef.current
      const emblem = emblemRef.current
      if (!stage || !emblem) return undefined

      const media = gsap.matchMedia()
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
        timeline
          .fromTo(
            emblem,
            { autoAlpha: 0, filter: 'blur(4px)', scale: 0.25 },
            {
              autoAlpha: 1,
              clearProps: 'filter,opacity,transform,visibility',
              duration: 0.3,
              filter: 'blur(0px)',
              scale: 1,
            },
            0
          )
          .fromTo(
            stage,
            { autoAlpha: 0, y: 12 },
            {
              autoAlpha: 1,
              clearProps: 'opacity,transform,visibility',
              duration: 0.42,
              y: 0,
            },
            0.06
          )

        const actions = stage.querySelectorAll<HTMLElement>('[data-dialogue-action]')
        if (actions.length > 0) {
          timeline.fromTo(
            actions,
            { autoAlpha: 0, y: 8 },
            {
              autoAlpha: 1,
              clearProps: 'opacity,transform,visibility',
              duration: 0.3,
              stagger: 0.05,
              y: 0,
            },
            0.2
          )
        }
      })

      return () => media.revert()
    },
    { dependencies: [contentKey], revertOnUpdate: true, scope: rootRef }
  )

  const updatePreparation = (next: Partial<AubergePreparationState>) => {
    onPreparationChange({ ...preparation, ...next })
  }

  const selectTopic = (topicId: AveugleTopicId) => {
    setCustomResponse(null)
    setSelectedTopicId(topicId)
    setIsTopicExpanded(false)
    updatePreparation({ seenTopicIds: addSeenId(preparation.seenTopicIds, topicId) })
  }

  const selectMemory = (memoryId: AveugleMemoryId) => {
    setSelectedMemoryId(memoryId)
    updatePreparation({ seenMemoryIds: addSeenId(preparation.seenMemoryIds, memoryId) })
  }

  const selectOmen = (omenId: AveugleOmenId) => {
    updatePreparation({ selectedOmenId: omenId })
  }

  const submitCustomAction = () => {
    if (!customAction.trim()) return
    setSelectedTopicId(null)
    setCustomResponse('Garde cette pensée. La route lui donnera un sens.')
    setIsComposerOpen(false)
    setCustomAction('')
  }

  const returnToTopics = () => {
    setCustomResponse(null)
    setSelectedTopicId(null)
    setIsComposerOpen(false)
    setIsTopicExpanded(false)
  }

  return (
    <div ref={rootRef} className="aveugle-hub__dock">
      <nav className="aveugle-hub__dock-nav" aria-label="Espaces de l’auberge">
        <GameButton
          aria-pressed={activePanel === 'dialogue'}
          leadingIcon={<GameIcon decorative name="dialogue" size={24} />}
          onClick={() => onActivePanelChange('dialogue')}
          size="sm"
          variant="ghost"
        >
          Parler{unreadTopicCount > 0 ? ` · ${unreadTopicCount}` : ''}
        </GameButton>
        <GameButton
          aria-pressed={activePanel === 'memories'}
          leadingIcon={<GameIcon decorative name="memory" size={24} />}
          onClick={() => onActivePanelChange('memories')}
          size="sm"
          variant="ghost"
        >
          Souvenirs{unreadMemoryCount > 0 ? ` · ${unreadMemoryCount}` : ''}
        </GameButton>
        {!isActiveSession ? (
          <GameButton
            aria-label={selectedOmen ? 'Présage choisi' : 'Ouvrir les présages'}
            aria-pressed={activePanel === 'omen'}
            leadingIcon={<GameIcon decorative name="moon" size={24} />}
            onClick={() => onActivePanelChange('omen')}
            size="sm"
            variant="ghost"
          >
            Présage
          </GameButton>
        ) : null}
      </nav>

      <GamePanel
        className="aveugle-hub__dialogue"
        data-auberge-frame
        padding="none"
        variant="aveugle-dialogue"
      >
        <div className="aveugle-hub__dialogue-content">
          <header>
            <div ref={emblemRef} className="aveugle-hub__speaker-mark">
              <GameIcon decorative name={panelMeta.icon} size={64} />
            </div>
            <h1>{panelMeta.title}</h1>
          </header>

          <div ref={stageRef} className="aveugle-hub__conversation-stage">
            {activePanel === 'dialogue' ? (
              <>
                <blockquote aria-live="polite">« {dialogueResponse} »</blockquote>

                {dialogueMode === 'topics' ? (
                  <DialogueChoiceGroup label="Sujets à aborder avec L’Aveugle">
                    {AVEUGLE_TOPICS.map((topic) => {
                      const isUnread = Boolean(
                        topic.isNew && !preparation.seenTopicIds.includes(topic.id)
                      )
                      return (
                        <DialogueChoice
                          key={topic.id}
                          aria-label={`${topic.label}${isUnread ? ', nouveau' : ''}`}
                          data-dialogue-action
                          icon={<GameIcon decorative name={topic.icon} size={32} />}
                          onClick={() => selectTopic(topic.id)}
                        >
                          <span className="aveugle-hub__choice-copy">
                            <span>{topic.label}</span>
                            {isUnread ? <small>Nouveau</small> : null}
                          </span>
                        </DialogueChoice>
                      )
                    })}
                  </DialogueChoiceGroup>
                ) : null}

                {dialogueMode === 'topics' ? (
                  <GameButton
                    className="aveugle-hub__other-question"
                    data-dialogue-action
                    onClick={() => setIsComposerOpen(true)}
                    size="sm"
                    variant="ghost"
                  >
                    Autre question…
                  </GameButton>
                ) : null}

                {dialogueMode === 'composer' ? (
                  <div className="aveugle-hub__composer" data-dialogue-action>
                    <NarrativeComposer
                      actionDisabled={!customAction.trim()}
                      actionLabel="Parler"
                      onAction={submitCustomAction}
                      onChange={(event) => setCustomAction(event.target.value)}
                      placeholder="Pose ta question…"
                      value={customAction}
                    />
                    <GameButton onClick={returnToTopics} size="sm" variant="ghost">
                      Revenir aux sujets
                    </GameButton>
                  </div>
                ) : null}

                {dialogueMode === 'answer' ? (
                  <div className="aveugle-hub__response-actions">
                    {selectedTopic && !isTopicExpanded ? (
                      <GameButton
                        data-dialogue-action
                        onClick={() => {
                          setCustomResponse(selectedTopic.followUp)
                          setIsTopicExpanded(true)
                        }}
                        size="sm"
                        variant="secondary"
                      >
                        Approfondir
                      </GameButton>
                    ) : null}
                    <GameButton
                      data-dialogue-action
                      onClick={returnToTopics}
                      size="sm"
                      variant="ghost"
                    >
                      Autres sujets
                    </GameButton>
                  </div>
                ) : null}
              </>
            ) : null}

            {activePanel === 'memories' ? (
              selectedMemory ? (
                <>
                  <blockquote aria-live="polite">« {selectedMemory.response} »</blockquote>
                  <GameButton
                    data-dialogue-action
                    onClick={() => setSelectedMemoryId(null)}
                    size="sm"
                    variant="ghost"
                  >
                    Revoir les souvenirs
                  </GameButton>
                </>
              ) : (
                <>
                  <blockquote>« Ce que tu rapportes ne dort jamais tout à fait. »</blockquote>
                  <DialogueChoiceGroup label="Souvenirs rapportés à l’auberge">
                    {AVEUGLE_MEMORIES.map((memory) => {
                      const isUnread = Boolean(
                        memory.isNew && !preparation.seenMemoryIds.includes(memory.id)
                      )
                      return (
                        <DialogueChoice
                          key={memory.id}
                          aria-label={`${memory.title}${isUnread ? ', nouveau' : ''}`}
                          data-dialogue-action
                          icon={<GameIcon decorative name={memory.icon} size={32} />}
                          onClick={() => selectMemory(memory.id)}
                        >
                          <span className="aveugle-hub__choice-copy">
                            <span>{memory.title}</span>
                            {isUnread ? <small>Nouveau</small> : null}
                          </span>
                        </DialogueChoice>
                      )
                    })}
                  </DialogueChoiceGroup>
                </>
              )
            ) : null}

            {activePanel === 'omen' && !isActiveSession ? (
              selectedOmen ? (
                <>
                  <blockquote aria-live="polite">« {selectedOmen.response} »</blockquote>
                  <p className="aveugle-hub__omen-effect">{selectedOmen.effect}</p>
                  <div className="aveugle-hub__response-actions">
                    <GameButton
                      data-dialogue-action
                      onClick={() => updatePreparation({ selectedOmenId: null })}
                      size="sm"
                      variant="secondary"
                    >
                      Changer de présage
                    </GameButton>
                    <GameButton
                      data-dialogue-action
                      onClick={() => onActivePanelChange('dialogue')}
                      size="sm"
                      variant="ghost"
                    >
                      Parler à L’Aveugle
                    </GameButton>
                  </div>
                </>
              ) : (
                <>
                  <blockquote>
                    « Deux chemins se présentent. Choisis ce que tu veux savoir. »
                  </blockquote>
                  <DialogueChoiceGroup label="Présages du prochain run">
                    {AVEUGLE_OMENS.map((omen) => (
                      <DialogueChoice
                        key={omen.id}
                        data-dialogue-action
                        icon={<GameIcon decorative name={omen.icon} size={32} />}
                        onClick={() => selectOmen(omen.id)}
                      >
                        <span className="aveugle-hub__choice-copy aveugle-hub__choice-copy--omen">
                          <strong>{omen.label}</strong>
                          <small>{omen.effect}</small>
                        </span>
                      </DialogueChoice>
                    ))}
                  </DialogueChoiceGroup>
                </>
              )
            ) : null}
          </div>
        </div>
      </GamePanel>
    </div>
  )
}
