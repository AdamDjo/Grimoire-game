import Image from 'next/image'

import {
  DialogueChoice,
  DialogueChoiceGroup,
  GameAvatar,
  GameButton,
  GameField,
  GameHudDock,
  GameIcon,
  GameInput,
  GamePanel,
  GameProgressRing,
  GameSectionHeading,
  GameStepDock,
  GameStepper,
  GameSurface,
  GameTopBar,
  InventoryQuickbar,
  InventorySlot,
  LocationIdentity,
  MemoryBadge,
  NarrativeComposer,
  NarrativePassage,
  PlayerIdentity,
  ResourceCounter,
  StatBar,
} from '@/components/ui/grimoire'

const CREATION_STEPS = [
  { id: 'identity', label: 'Identité', icon: <GameIcon name="stranger" size={32} decorative /> },
  { id: 'appearance', label: 'Apparence', icon: <GameIcon name="mage" size={32} decorative /> },
  { id: 'class', label: 'Classe', icon: <GameIcon name="crossed-swords" size={32} decorative /> },
  { id: 'history', label: 'Histoire', icon: <GameIcon name="journal" size={32} decorative /> },
  { id: 'summary', label: 'Résumé', icon: <GameIcon name="book" size={32} decorative /> },
]

function SceneBackground({ src, alt }: { src: string; alt: string }) {
  return <Image alt={alt} fill priority sizes="(max-width: 800px) 100vw, 96rem" src={src} />
}

export function CharacterFormComposition() {
  return (
    <div className="ui-kit-proof ui-kit-proof--form">
      <SceneBackground
        alt="Auberge obscure donnant sur les remparts de Tissan"
        src="/landing/plates/plate-03-auberge-clean.webp"
      />
      <GamePanel className="ui-kit-proof__form-panel" padding="md" variant="main">
        <GameStepper
          ariaLabel="Création du personnage"
          completedIds={[]}
          currentId="identity"
          items={CREATION_STEPS}
        />
        <GameSectionHeading
          description="Chaque légende commence par un nom."
          ornament="watcher"
          title="Identité"
        />
        <GameField label="Nom du personnage" hint="Ce nom suivra toute votre chronique.">
          <GameInput placeholder="Entrez votre nom…" />
        </GameField>
        <GameButton trailingIcon={<GameIcon name="arrow" size={24} decorative />} variant="radiant">
          Suivant
        </GameButton>
      </GamePanel>
      <GamePanel className="ui-kit-proof__heritage" padding="sm" variant="compact">
        <GameIcon name="stranger" size={48} decorative />
        <h3>Héritage</h3>
        <p>Votre passé forge votre destinée, mais vos choix écriront votre légende.</p>
      </GamePanel>
      <GameStepDock className="ui-kit-proof__step-dock">
        <GameStepper
          ariaLabel="Progression de la création"
          currentId="identity"
          items={CREATION_STEPS}
        />
      </GameStepDock>
    </div>
  )
}

export function HubComposition() {
  return (
    <div className="ui-kit-proof ui-kit-proof--hub">
      <div className="ui-kit-proof__hub-scene">
        <SceneBackground
          alt="Deux voyageurs discutent dans une auberge de Tissan"
          src="/scenes/hub-auberge-clean.webp"
        />
        <GameTopBar
          className="ui-kit-proof__hub-top"
          start={
            <PlayerIdentity
              avatar={<GameAvatar alt="Aerion" size="sm" src="/ui-kit/icons/stranger.webp" />}
              name="Aerion"
              subtitle="Niveau 1"
            />
          }
          end={
            <div className="ui-kit-proof__hub-resources">
              <ResourceCounter
                compact
                icon={<GameIcon name="coin" size={24} decorative />}
                label="Sceaux"
                value={125}
              />
              <ResourceCounter
                compact
                icon={<GameIcon name="crown" size={24} decorative />}
                label="Prestige"
                value={0}
              />
              <ResourceCounter
                compact
                icon={<GameIcon name="diamond" size={24} decorative />}
                label="Éclats"
                value={0}
              />
              <ResourceCounter
                compact
                icon={<GameIcon name="book" size={24} decorative />}
                label="Chroniques"
                value={0}
              />
            </div>
          }
        />
        <GameButton className="ui-kit-proof__hub-cta" size="lg" variant="cinematic">
          Quitter l’auberge · Partir en run
        </GameButton>
      </div>

      <aside className="ui-kit-proof__hub-sidebar" aria-label="Dialogue et souvenirs">
        <div className="ui-kit-proof__memory-row" aria-label="Souvenirs récents">
          <MemoryBadge
            title="La nuit où tu as épargné Vane"
            visual={<GameAvatar alt="Souvenir de Vane" src="/ui-kit/icons/stranger.webp" />}
          />
          <MemoryBadge
            title="Le serment du Sel"
            visual={<GameAvatar alt="Souvenir du serment" src="/ui-kit/icons/memory.webp" />}
          />
          <MemoryBadge
            title="Le rêve archonique"
            visual={<GameAvatar alt="Souvenir du rêve" src="/ui-kit/icons/moon.webp" />}
          />
        </div>
        <GameSurface className="ui-kit-proof__dialogue-panel" padding="sm" variant="card">
          <GameSectionHeading level={3} title="L’Aveugle" />
          <NarrativePassage>
            <p>
              Le vent siffle à travers les arches du refuge, portant avec lui les murmures d’un
              monde brisé. L’Aveugle incline la tête vers vous.
            </p>
            <p>« Tu as franchi le seuil, maintenant ton chemin commence vraiment. »</p>
          </NarrativePassage>
          <DialogueChoiceGroup label="Réponses à l’Aveugle">
            <DialogueChoice icon={<GameIcon name="stranger" size={32} decorative />}>
              Parle-moi de la Guilde du Sel.
            </DialogueChoice>
            <DialogueChoice icon={<GameIcon name="warning" size={32} decorative />}>
              Que sais-tu des Calcinés ?
            </DialogueChoice>
            <DialogueChoice icon={<GameIcon name="artifact" size={32} decorative />}>
              Examine cet artefact que j’ai rapporté.
            </DialogueChoice>
          </DialogueChoiceGroup>
          <NarrativeComposer aria-label="Autre réponse" />
        </GameSurface>
      </aside>
    </div>
  )
}

export function GameSessionComposition() {
  return (
    <div className="ui-kit-proof ui-kit-proof--session">
      <SceneBackground
        alt="Salle animée de la taverne du Doigt-Cassé"
        src="/scenes/doigt-casse-session.webp"
      />

      <header className="ui-kit-proof__session-top" aria-label="Contexte de la session">
        <LocationIdentity
          icon={<GameIcon name="compass" size={32} decorative />}
          place="Tissan"
          world="Velkhar"
        />
        <PlayerIdentity
          avatar={<GameAvatar alt="Aerion" size="sm" src="/ui-kit/icons/stranger.webp" />}
          compact
          name="Aerion"
          subtitle="Tisse-Verbe"
        />
        <span className="ui-kit-proof__return-link">Retour chez L’Aveugle →</span>
      </header>

      <div className="ui-kit-proof__session-main">
        <NarrativePassage align="center" dropCap>
          <p>
            Tu entres dans la taverne du Doigt-Cassé. L’air pue la sueur et le sel. Au fond, un
            Inquisiteur t’observe en silence. Sa main repose sur le pommeau d’une dague de Cendre.
            Les conversations se taisent autour de toi. La patronne te jette un regard appuyé.
          </p>
        </NarrativePassage>
        <DialogueChoiceGroup label="Actions disponibles">
          <DialogueChoice icon={<GameIcon name="crossed-swords" size={32} decorative />}>
            Approcher l’Inquisiteur sans baisser les yeux
          </DialogueChoice>
          <DialogueChoice icon={<GameIcon name="coin" size={32} decorative />}>
            Aller au bar, commander un verre, attendre
          </DialogueChoice>
          <DialogueChoice icon={<GameIcon name="eye" size={32} decorative />}>
            Observer la salle, chercher une sortie discrète
          </DialogueChoice>
        </DialogueChoiceGroup>
        <NarrativeComposer aria-label="Action libre" />
      </div>

      <GameHudDock className="ui-kit-proof__session-hud">
        <div className="ui-kit-proof__stats">
          <StatBar label="Sang" max={14} tone="danger" value={12} />
          <StatBar label="Souffle" max={10} tone="aqua" value={8} />
          <StatBar label="Cendre" max={10} tone="ember" value={6} />
        </div>
        <div className="ui-kit-proof__rings">
          <GameProgressRing label="Soif" max={100} tone="aqua" value={78} />
          <GameProgressRing label="Faim" max={100} tone="ember" value={60} />
          <GameProgressRing label="Fatigue" max={100} value={45} />
          <GameProgressRing
            className="ui-kit-proof__calamine-ring"
            label="Calamine"
            max={100}
            value={22}
          />
        </div>
        <ResourceCounter
          compact
          icon={<GameIcon name="coin" size={32} decorative />}
          label="Sceaux"
          value={127}
        />
        <InventoryQuickbar>
          <InventorySlot icon={<GameIcon name="potion" size={48} decorative />} label="Potion" />
          <InventorySlot icon={<GameIcon name="key" size={48} decorative />} label="Clé" />
          <InventorySlot icon={<GameIcon name="envelope" size={48} decorative />} label="Lettre" />
        </InventoryQuickbar>
      </GameHudDock>
    </div>
  )
}
