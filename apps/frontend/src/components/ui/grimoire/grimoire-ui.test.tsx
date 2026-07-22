import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ArchetypeCard } from './ArchetypeCard/ArchetypeCard'
import { DialogueChoice } from './DialogueChoice/DialogueChoice'
import { DialogueChoiceGroup } from './DialogueChoiceGroup/DialogueChoiceGroup'
import { GameAvatar } from './GameAvatar/GameAvatar'
import { GameBrand } from './GameBrand/GameBrand'
import { GameButton } from './GameButton/GameButton'
import { GameDivider } from './GameDivider/GameDivider'
import { GameField } from './GameField/GameField'
import { GameHudDock } from './GameHudDock/GameHudDock'
import { GameIcon } from './GameIcon/GameIcon'
import { GameInput } from './GameInput/GameInput'
import { GameOrnament } from './GameOrnament/GameOrnament'
import { GamePanel } from './GamePanel/GamePanel'
import { GameProgressRing } from './GameProgressRing/GameProgressRing'
import { GameSceneLayout } from './GameSceneLayout/GameSceneLayout'
import { GameSearchInput } from './GameSearchInput/GameSearchInput'
import { GameSectionHeading } from './GameSectionHeading/GameSectionHeading'
import { GameStepDock } from './GameStepDock/GameStepDock'
import { GameStepper } from './GameStepper/GameStepper'
import { GameSurface } from './GameSurface/GameSurface'
import { GameTextarea } from './GameTextarea/GameTextarea'
import { GameTopBar } from './GameTopBar/GameTopBar'
import { GameWindow } from './GameWindow/GameWindow'
import { HudFrame } from './HudFrame/HudFrame'
import { InventoryQuickbar } from './InventoryQuickbar/InventoryQuickbar'
import { InventorySlot } from './InventorySlot/InventorySlot'
import { LocationIdentity } from './LocationIdentity/LocationIdentity'
import { MemoryBadge } from './MemoryBadge/MemoryBadge'
import { NarrativeComposer } from './NarrativeComposer/NarrativeComposer'
import { NarrativePassage } from './NarrativePassage/NarrativePassage'
import { PlayerIdentity } from './PlayerIdentity/PlayerIdentity'
import { ResourceCounter } from './ResourceCounter/ResourceCounter'
import { StatBar } from './StatBar/StatBar'

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
  }) => (
    // Next Image est réduit à son élément sémantique pour les tests jsdom.
    <img alt={alt} {...props} />
  ),
}))

describe('Grimoire UI primitives', () => {
  it('désactive réellement un GameButton en chargement', () => {
    render(<GameButton loading>Continuer</GameButton>)

    const button = screen.getByRole('button', { name: 'Continuer' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('relie automatiquement GameField à son hint et son erreur', () => {
    render(
      <GameField label="Nom" hint="Trois caractères minimum" error="Nom indisponible" required>
        <GameInput />
      </GameField>
    )

    const input = screen.getByRole('textbox', { name: 'Nom' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input.getAttribute('aria-describedby')).toContain('hint')
    expect(input.getAttribute('aria-describedby')).toContain('error')
    expect(screen.getByRole('alert')).toHaveTextContent('Nom indisponible')
  })

  it('impose une alternative accessible aux GameIcon non décoratives', () => {
    const { rerender } = render(<GameIcon name="key" size={32} label="Clé" />)
    expect(screen.getByRole('img', { name: 'Clé' })).toBeInTheDocument()

    rerender(<GameIcon name="key" size={32} decorative />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('borne la valeur exposée par StatBar', () => {
    render(<StatBar label="Sang" value={18} max={14} tone="danger" />)

    const progressbar = screen.getByRole('progressbar', { name: 'Sang' })
    expect(progressbar).toHaveAttribute('aria-valuenow', '14')
    expect(progressbar).toHaveAttribute('aria-valuemax', '14')
  })

  it('expose l’étape active et déclenche la navigation', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <GameStepper
        currentId="identity"
        completedIds={['intro']}
        onStepChange={handleChange}
        items={[
          { id: 'intro', label: 'Introduction' },
          { id: 'identity', label: 'Identité' },
          { id: 'class', label: 'Classe' },
        ]}
      />
    )

    expect(screen.getByRole('button', { name: 'Identité' })).toHaveAttribute('aria-current', 'step')
    await user.click(screen.getByRole('button', { name: 'Classe' }))
    expect(handleChange).toHaveBeenCalledWith('class')
  })

  it('expose la marque avec une alternative accessible ou décorative', () => {
    const { rerender } = render(<GameBrand variant="lockup" />)
    expect(screen.getByRole('img', { name: 'GRIMOIRE — Of Ash and Salt' })).toBeInTheDocument()

    rerender(<GameBrand decorative variant="sigil" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('applique les variantes illustrées sans changer la sémantique', () => {
    render(
      <>
        <GameDivider variant="celestial" aria-label="Fin de chapitre" />
        <GameSurface as="article" variant="parchment">
          Lettre retrouvée
        </GameSurface>
      </>
    )

    expect(screen.getByRole('separator', { name: 'Fin de chapitre' })).toHaveClass(
      'game-divider--celestial'
    )
    expect(screen.getByRole('article')).toHaveClass('game-surface--parchment')
  })

  it('rend un ornement accessible ou strictement décoratif', () => {
    const { rerender } = render(<GameOrnament label="Œil du Veilleur" name="watcher" />)
    expect(screen.getByRole('img', { name: 'Œil du Veilleur' })).toBeInTheDocument()

    rerender(<GameOrnament decorative name="watcher" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('expose la sélection d’un choix narratif', () => {
    render(
      <DialogueChoiceGroup label="Actions">
        <DialogueChoice selected>Observer</DialogueChoice>
      </DialogueChoiceGroup>
    )
    expect(screen.getByRole('group', { name: 'Actions' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Observer' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('borne les jauges circulaires et expose les slots sélectionnés', () => {
    render(
      <>
        <GameProgressRing label="Soif" max={100} value={140} />
        <InventorySlot label="Clé" selected />
      </>
    )
    expect(screen.getByRole('progressbar', { name: 'Soif' })).toHaveAttribute(
      'aria-valuenow',
      '100'
    )
    expect(screen.getByRole('button', { name: 'Clé' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('conserve les états accessibles des champs composés', () => {
    render(
      <>
        <GameSearchInput aria-label="Rechercher" />
        <GameTextarea aria-label="Histoire" disabled invalid />
        <NarrativeComposer
          actionDisabled
          actionLabel="Valider l’action"
          aria-label="Action libre"
        />
      </>
    )

    expect(screen.getByRole('searchbox', { name: 'Rechercher' })).toHaveAttribute('type', 'search')
    expect(screen.getByRole('textbox', { name: 'Histoire' })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'Histoire' })).toHaveAttribute(
      'aria-invalid',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Valider l’action' })).toBeDisabled()
  })

  it('ferme une GameWindow partagée avec Escape', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()

    render(
      <GameWindow label="Inventaire" onClose={handleClose} title="Sac">
        Contenu
      </GameWindow>
    )

    expect(screen.getByRole('dialog', { name: 'Inventaire' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(handleClose).toHaveBeenCalledOnce()
  })

  it('expose les repères sémantiques de scène et de navigation', () => {
    render(
      <GameSceneLayout
        top={<GameTopBar start="Départ" center="Centre" end="Fin" />}
        main={<PlayerIdentity name="Aerion" subtitle="Niveau 1" />}
        sidebar={<LocationIdentity world="Velkhar" place="Tissan" />}
        bottom={<GameStepDock actions={<GameButton>Suivant</GameButton>}>Étapes</GameStepDock>}
      />
    )

    expect(screen.getByRole('banner', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Character: Aerion' })).toBeInTheDocument()
    expect(screen.getByLabelText('Velkhar, Tissan')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Étapes du parcours' })).toBeInTheDocument()
  })

  it('compose les familles HUD avec des libellés lisibles', () => {
    render(
      <GameHudDock>
        <HudFrame active>État</HudFrame>
        <StatBar label="Vitalité" max={100} tone="danger" value={32} />
        <GameProgressRing label="Fatigue" max={100} tone="ember" value={45} />
        <ResourceCounter label="Cendres" value={127} />
        <InventoryQuickbar>
          <InventorySlot label="Potion" />
        </InventoryQuickbar>
      </GameHudDock>
    )

    expect(screen.getByRole('complementary', { name: 'État du personnage' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Vitalité' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Fatigue' })).toBeInTheDocument()
    expect(screen.getByLabelText('Cendres : 127')).toBeInTheDocument()
    expect(screen.getByRole('toolbar', { name: 'Raccourcis d’inventaire' })).toBeInTheDocument()
  })

  it('rend les contenus éditoriaux et métier sans perdre leur structure', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()

    render(
      <GamePanel aria-label="Contenu éditorial" as="article">
        <GameSectionHeading level={3} title="Héritage" />
        <NarrativePassage dropCap>Ton passé forge ta destinée.</NarrativePassage>
        <MemoryBadge title="Le serment" visual={<span>Souvenir</span>} />
        <ArchetypeCard
          description="Une voie forgée dans les cendres."
          id="sentinelle"
          onSelect={handleSelect}
          title="Sentinelle"
        />
      </GamePanel>
    )

    expect(screen.getByRole('article', { name: 'Contenu éditorial' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Héritage' })).toBeInTheDocument()
    expect(screen.getByText('Ton passé forge ta destinée.')).toHaveClass(
      'narrative-passage--drop-cap'
    )
    expect(screen.getByText('Le serment')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Choose' }))
    expect(handleSelect).toHaveBeenCalledWith('sentinelle')
  })

  it('rend un avatar avec son alternative et son état', () => {
    render(<GameAvatar alt="Portrait d’Aerion" src="/portrait.webp" state="selected" />)

    expect(screen.getByRole('img', { name: 'Portrait d’Aerion' })).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Portrait d’Aerion' }).closest('.game-avatar')
    ).toHaveClass('game-avatar--selected')
  })
})
