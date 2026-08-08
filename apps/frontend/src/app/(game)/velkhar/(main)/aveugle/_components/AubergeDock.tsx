'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useRef, useState } from 'react'

import { DialogueChoice } from '@/components/ui/grimoire/DialogueChoice/DialogueChoice'
import { DialogueChoiceGroup } from '@/components/ui/grimoire/DialogueChoiceGroup/DialogueChoiceGroup'
import { GameButton } from '@/components/ui/grimoire/GameButton/GameButton'
import { GameIcon } from '@/components/ui/grimoire/GameIcon/GameIcon'
import { GamePanel } from '@/components/ui/grimoire/GamePanel/GamePanel'
import { NarrativeComposer } from '@/components/ui/grimoire/NarrativeComposer/NarrativeComposer'
import { gsap, useGSAP } from '@/lib/gsap-init'

import { getAveugleExchanges, getAveugleTopics } from '../_data/aveugle-catalogue'
import { markAveugleTopicSeen, spendSouvenir, talkToAveugle } from '../_lib/aveugle-api'

import type { AveugleTopicId } from '../_data/aveugle-catalogue'
import type {
  AveugleExchangeType,
  AveugleHubState,
  Souvenir,
  SpendSouvenirResponse,
} from '@grimoire/shared'

export type AubergePanel = 'dialogue' | 'memories'

type PendingAction =
  | { kind: 'talk'; message: string; topicId?: AveugleTopicId }
  | { kind: 'spend'; exchangeType: AveugleExchangeType }

interface AubergeDockProps {
  activePanel: AubergePanel
  hubState: AveugleHubState
  onActivePanelChange: (panel: AubergePanel) => void
  onSouvenirSpent: (souvenir: Souvenir) => void
  onTopicSeen: (topicId: string) => void
  openingLine: string
  spendableSouvenirs: Souvenir[]
}

export function AubergeDock({
  activePanel,
  hubState,
  onActivePanelChange,
  onSouvenirSpent,
  onTopicSeen,
  openingLine,
  spendableSouvenirs,
}: AubergeDockProps) {
  const locale = useLocale()
  const t = useTranslations('Auberge')
  const [selectedTopicId, setSelectedTopicId] = useState<AveugleTopicId | null>(null)
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null)
  const [customAction, setCustomAction] = useState('')
  const [dialogueReply, setDialogueReply] = useState<string | null>(null)
  const [loreResult, setLoreResult] = useState<string | null>(null)
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isTopicExpanded, setIsTopicExpanded] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [lastAction, setLastAction] = useState<PendingAction | null>(null)
  const [interactionError, setInteractionError] = useState<string | null>(null)
  const [syncWarning, setSyncWarning] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const emblemRef = useRef<HTMLDivElement>(null)
  const topics = useMemo(() => getAveugleTopics(locale), [locale])
  const exchanges = useMemo(() => getAveugleExchanges(locale), [locale])
  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId)
  const selectedMemory = hubState.namedSouvenirs.find((memory) => memory.id === selectedMemoryId)
  const dialogueMode = dialogueReply ? 'answer' : isComposerOpen ? 'composer' : 'topics'
  const unreadTopicCount = topics.filter(
    (topic) => !hubState.seenTopicIds.includes(topic.id)
  ).length
  const isPending = pendingAction !== null
  const panelMeta =
    activePanel === 'dialogue'
      ? { icon: 'eye' as const, title: t('blindOne') }
      : { icon: 'memory' as const, title: t('memories') }
  const contentKey = [
    activePanel,
    dialogueMode,
    dialogueReply,
    selectedMemoryId,
    loreResult,
    pendingAction?.kind,
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

  const executeTalk = async (action: Extract<PendingAction, { kind: 'talk' }>) => {
    setPendingAction(action)
    setLastAction(action)
    setInteractionError(null)
    setSyncWarning(false)

    const [talkResult, seenResult] = await Promise.allSettled([
      talkToAveugle(action.message),
      action.topicId ? markAveugleTopicSeen(action.topicId) : Promise.resolve(),
    ])

    setPendingAction(null)
    if (talkResult.status === 'rejected') {
      setInteractionError(t('talkError'))
      return
    }

    setDialogueReply(talkResult.value.reply)
    if (action.topicId && seenResult.status === 'fulfilled') {
      onTopicSeen(action.topicId)
    } else if (action.topicId) {
      setSyncWarning(true)
    }
  }

  const executeSpend = async (action: Extract<PendingAction, { kind: 'spend' }>) => {
    const souvenir = spendableSouvenirs[0]
    setLastAction(action)
    setInteractionError(null)
    if (!souvenir) {
      setInteractionError(t('exchangeUnavailable'))
      return
    }

    setPendingAction(action)
    try {
      const result: SpendSouvenirResponse = await spendSouvenir(souvenir.id, action.exchangeType)
      setLoreResult(result.loreResult)
      onSouvenirSpent(result.souvenir)
    } catch {
      setInteractionError(t('exchangeError'))
    } finally {
      setPendingAction(null)
    }
  }

  const runAction = async (action: PendingAction) => {
    if (action.kind === 'talk') {
      await executeTalk(action)
      return
    }
    await executeSpend(action)
  }

  const selectTopic = (topicId: AveugleTopicId) => {
    const topic = topics.find((candidate) => candidate.id === topicId)
    if (!topic) return
    setSelectedTopicId(topicId)
    setDialogueReply(null)
    setIsComposerOpen(false)
    setIsTopicExpanded(false)
    void runAction({ kind: 'talk', message: topic.prompt, topicId })
  }

  const submitCustomAction = () => {
    const message = customAction.trim()
    if (!message) return
    setSelectedTopicId(null)
    setDialogueReply(null)
    setIsComposerOpen(false)
    setCustomAction('')
    void runAction({ kind: 'talk', message })
  }

  const returnToTopics = () => {
    setDialogueReply(null)
    setSelectedTopicId(null)
    setIsComposerOpen(false)
    setIsTopicExpanded(false)
    setInteractionError(null)
    setSyncWarning(false)
  }

  const returnToMemories = () => {
    setSelectedMemoryId(null)
    setLoreResult(null)
    setInteractionError(null)
  }

  const changePanel = (panel: AubergePanel) => {
    setInteractionError(null)
    setSyncWarning(false)
    onActivePanelChange(panel)
  }

  return (
    <div ref={rootRef} className="aveugle-hub__dock">
      <nav className="aveugle-hub__dock-nav" aria-label={t('dockNavigation')}>
        <GameButton
          aria-pressed={activePanel === 'dialogue'}
          leadingIcon={<GameIcon decorative name="dialogue" size={24} />}
          onClick={() => changePanel('dialogue')}
          size="sm"
          variant="ghost"
        >
          {t('talk')}
          {unreadTopicCount > 0 ? ` · ${unreadTopicCount}` : ''}
        </GameButton>
        <GameButton
          aria-pressed={activePanel === 'memories'}
          leadingIcon={<GameIcon decorative name="memory" size={24} />}
          onClick={() => changePanel('memories')}
          size="sm"
          variant="ghost"
        >
          {t('memories')}
          {hubState.namedSouvenirs.length > 0 ? ` · ${hubState.namedSouvenirs.length}` : ''}
        </GameButton>
      </nav>

      <GamePanel
        className="aveugle-hub__dialogue"
        data-auberge-frame
        padding="none"
        variant="dialogue-frame"
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
                <blockquote aria-live="polite">
                  «{' '}
                  {isPending && pendingAction?.kind === 'talk'
                    ? t('blindOneThinking')
                    : (dialogueReply ?? openingLine)}{' '}
                  »
                </blockquote>

                {interactionError ? (
                  <div className="aveugle-hub__interaction-error" role="alert">
                    <p>{interactionError}</p>
                    {lastAction ? (
                      <GameButton
                        loading={isPending}
                        onClick={() => void runAction(lastAction)}
                        size="sm"
                        variant="secondary"
                      >
                        {t('retry')}
                      </GameButton>
                    ) : null}
                  </div>
                ) : null}
                {syncWarning ? <p role="status">{t('topicSyncWarning')}</p> : null}

                {dialogueMode === 'topics' && !interactionError ? (
                  <DialogueChoiceGroup label={t('topicsLabel')}>
                    {topics.map((topic) => {
                      const isUnread = !hubState.seenTopicIds.includes(topic.id)
                      return (
                        <DialogueChoice
                          key={topic.id}
                          aria-label={isUnread ? t('newAria', { label: topic.label }) : topic.label}
                          data-dialogue-action
                          disabled={isPending}
                          icon={<GameIcon decorative name={topic.icon} size={32} />}
                          onClick={() => selectTopic(topic.id)}
                        >
                          <span className="aveugle-hub__choice-copy">
                            <span>{topic.label}</span>
                            {isUnread ? <small>{t('new')}</small> : null}
                          </span>
                        </DialogueChoice>
                      )
                    })}
                  </DialogueChoiceGroup>
                ) : null}

                {dialogueMode === 'topics' && !interactionError ? (
                  <GameButton
                    className="aveugle-hub__other-question"
                    data-dialogue-action
                    disabled={isPending}
                    onClick={() => setIsComposerOpen(true)}
                    size="sm"
                    variant="ghost"
                  >
                    {t('otherQuestion')}
                  </GameButton>
                ) : null}

                {dialogueMode === 'composer' ? (
                  <div className="aveugle-hub__composer" data-dialogue-action>
                    <NarrativeComposer
                      actionDisabled={isPending || !customAction.trim()}
                      actionLabel={t('speak')}
                      onAction={submitCustomAction}
                      onChange={(event) => setCustomAction(event.target.value)}
                      placeholder={t('questionPlaceholder')}
                      value={customAction}
                    />
                    <GameButton onClick={returnToTopics} size="sm" variant="ghost">
                      {t('backToTopics')}
                    </GameButton>
                  </div>
                ) : null}

                {dialogueMode === 'answer' ? (
                  <div className="aveugle-hub__response-actions">
                    {selectedTopic && !isTopicExpanded ? (
                      <GameButton
                        data-dialogue-action
                        disabled={isPending}
                        onClick={() => {
                          setDialogueReply(null)
                          setIsTopicExpanded(true)
                          void runAction({
                            kind: 'talk',
                            message: `${selectedTopic.prompt} ${t('goDeeperPrompt')}`,
                            topicId: selectedTopic.id,
                          })
                        }}
                        size="sm"
                        variant="secondary"
                      >
                        {t('goDeeper')}
                      </GameButton>
                    ) : null}
                    <GameButton
                      data-dialogue-action
                      onClick={returnToTopics}
                      size="sm"
                      variant="ghost"
                    >
                      {t('otherTopics')}
                    </GameButton>
                  </div>
                ) : null}
              </>
            ) : null}

            {activePanel === 'memories' ? (
              selectedMemory ? (
                <>
                  <blockquote aria-live="polite">« {selectedMemory.body} »</blockquote>
                  <GameButton
                    data-dialogue-action
                    onClick={returnToMemories}
                    size="sm"
                    variant="ghost"
                  >
                    {t('reviewMemories')}
                  </GameButton>
                </>
              ) : loreResult ? (
                <>
                  <blockquote aria-live="polite">« {loreResult} »</blockquote>
                  <GameButton
                    data-dialogue-action
                    onClick={returnToMemories}
                    size="sm"
                    variant="ghost"
                  >
                    {t('reviewMemories')}
                  </GameButton>
                </>
              ) : (
                <>
                  <blockquote>« {t('memoryIntro')} »</blockquote>

                  {hubState.namedSouvenirs.length > 0 ? (
                    <DialogueChoiceGroup label={t('memoriesLabel')}>
                      {hubState.namedSouvenirs.map((memory) => (
                        <DialogueChoice
                          key={memory.id}
                          data-dialogue-action
                          icon={<GameIcon decorative name="memory" size={32} />}
                          onClick={() => setSelectedMemoryId(memory.id)}
                        >
                          {memory.title}
                        </DialogueChoice>
                      ))}
                    </DialogueChoiceGroup>
                  ) : (
                    <p className="aveugle-hub__empty" role="status">
                      {t('noNamedMemories')}
                    </p>
                  )}

                  <section
                    className="aveugle-hub__exchange"
                    aria-labelledby="aveugle-exchange-title"
                  >
                    <h2 id="aveugle-exchange-title">{t('exchangeTitle')}</h2>
                    {hubState.spendableSouvenirCount > 0 ? (
                      <>
                        <p>{t('exchangeIntro', { count: hubState.spendableSouvenirCount })}</p>
                        <DialogueChoiceGroup label={t('exchangeLabel')}>
                          {exchanges.map((exchange) => (
                            <DialogueChoice
                              key={exchange.exchangeType}
                              data-dialogue-action
                              disabled={isPending}
                              icon={<GameIcon decorative name={exchange.icon} size={32} />}
                              onClick={() =>
                                void runAction({
                                  kind: 'spend',
                                  exchangeType: exchange.exchangeType,
                                })
                              }
                            >
                              {exchange.label}
                            </DialogueChoice>
                          ))}
                        </DialogueChoiceGroup>
                      </>
                    ) : (
                      <p className="aveugle-hub__empty" role="status">
                        {t('noSpendableMemories')}
                      </p>
                    )}
                  </section>

                  {pendingAction?.kind === 'spend' ? (
                    <p aria-live="polite">{t('exchangePending')}</p>
                  ) : null}
                  {interactionError ? (
                    <div className="aveugle-hub__interaction-error" role="alert">
                      <p>{interactionError}</p>
                      {lastAction ? (
                        <GameButton
                          loading={isPending}
                          onClick={() => void runAction(lastAction)}
                          size="sm"
                          variant="secondary"
                        >
                          {t('retry')}
                        </GameButton>
                      ) : null}
                    </div>
                  ) : null}
                </>
              )
            ) : null}
          </div>
        </div>
      </GamePanel>
    </div>
  )
}
