import { notFound } from 'next/navigation'

import {
  CalamineMeter,
  DialogueChoice,
  DialogueChoiceGroup,
  GAME_ICON_NAMES,
  GameAvatar,
  GameBrand,
  GameButton,
  GameDivider,
  GameField,
  GameHudDock,
  GameIcon,
  GameInput,
  GameOrnament,
  GamePanel,
  GameProgressRing,
  GameSearchInput,
  GameSceneLayout,
  GameSectionHeading,
  GameStepper,
  GameStepDock,
  GameSurface,
  GameTopBar,
  GameTextarea,
  HudFrame,
  InventoryQuickbar,
  InventorySlot,
  LocationIdentity,
  MemoryBadge,
  NarrativePassage,
  NarrativeComposer,
  PlayerIdentity,
  ResourceCounter,
  StatBar,
  SurvieGauge,
  VocationCard,
  VocationEmblem,
} from '@/components/ui/grimoire'

import './ui-kit-preview.css'

import {
  CharacterFormComposition,
  GameSessionComposition,
  HubComposition,
} from './reference-compositions'

export default function UiKitPreviewPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  const steps = [
    { id: 'identity', label: 'Identité', icon: <GameIcon name="stranger" size={32} decorative /> },
    { id: 'appearance', label: 'Apparence', icon: <GameIcon name="mage" size={32} decorative /> },
    { id: 'class', label: 'Classe', icon: <GameIcon name="crossed-swords" size={32} decorative /> },
    { id: 'history', label: 'Histoire', icon: <GameIcon name="journal" size={32} decorative /> },
    { id: 'summary', label: 'Résumé', icon: <GameIcon name="book" size={32} decorative /> },
  ]

  return (
    <main className="ui-kit-preview">
      <header className="ui-kit-preview__hero">
        <GameBrand decorative size="md" />
        <p>UI KIT · BIBLIOTHÈQUE GLOBALE</p>
        <h1>Atlas des composants</h1>
        <GameDivider variant="celestial" size="lg" />
      </header>

      <section className="ui-kit-preview__section">
        <h2>Marque et ornements</h2>
        <div className="ui-kit-preview__brand-grid">
          <GameBrand decorative size="lg" />
          <GameBrand decorative size="lg" variant="sigil" />
        </div>
        <div className="ui-kit-preview__divider-stack">
          <GameDivider variant="celestial" size="lg" />
          <GameDivider variant="auberge" size="lg" />
          <GameDivider variant="ornate" size="lg" />
          <GameDivider variant="diamond" size="md" />
          <GameDivider variant="simple" size="sm" />
          <GameOrnament decorative name="watcher" size="lg" />
        </div>
      </section>

      <section className="ui-kit-preview__section">
        <h2>Boutons</h2>
        <div className="ui-kit-preview__button-showcase">
          <GameSurface padding="sm" variant="card">
            <h3>Cadre sombre</h3>
            <div className="ui-kit-preview__row">
              <GameButton variant="cinematic">Entrer en campagne</GameButton>
              <GameButton
                leadingIcon={<GameIcon decorative name="compass" size={24} />}
                variant="cinematic"
              >
                Avec icône
              </GameButton>
              <GameButton disabled variant="cinematic">
                Indisponible
              </GameButton>
              <GameButton loading variant="cinematic">
                Chargement
              </GameButton>
            </div>
          </GameSurface>
          <GameSurface padding="sm" variant="card">
            <h3>Cadre doré</h3>
            <div className="ui-kit-preview__row">
              <GameButton variant="radiant">Sceller le choix</GameButton>
              <GameButton disabled variant="radiant">
                Indisponible
              </GameButton>
              <GameButton loading variant="radiant">
                Chargement
              </GameButton>
              <GameButton variant="icon" aria-label="Valider l’action">
                <GameIcon name="arrow" size={24} decorative />
              </GameButton>
            </div>
          </GameSurface>
        </div>
      </section>

      <section className="ui-kit-preview__section">
        <h2>Panels et saisie</h2>
        <div className="ui-kit-preview__panels">
          <GamePanel variant="main">
            <GameField label="Nom du personnage" hint="Ce nom apparaîtra dans votre chronique.">
              <GameInput placeholder="Entrez votre nom…" />
            </GameField>
            <GameField label="Recherche">
              <GameSearchInput placeholder="Rechercher un souvenir…" />
            </GameField>
            <GameField label="Histoire" error="Votre histoire doit être plus détaillée.">
              <GameTextarea placeholder="Écrivez votre légende…" />
            </GameField>
          </GamePanel>
          <GamePanel variant="sidebar" tone="cendre" padding="sm">
            <h3>Héritage</h3>
            <p>Votre passé forge votre destinée, mais vos choix écriront votre légende.</p>
          </GamePanel>
        </div>
      </section>

      <section className="ui-kit-preview__section">
        <h2>Surfaces</h2>
        <div className="ui-kit-preview__surfaces">
          <GameSurface variant="card">
            <h3>Carte sombre</h3>
            <p>Surface narrative globale pour les contenus denses.</p>
          </GameSurface>
          <GameSurface variant="parchment">
            <h3>Note de chronique</h3>
            <p>Une surface claire pour les indices, lettres et annotations.</p>
          </GameSurface>
          <GameSurface className="ui-kit-preview__stats-surface" variant="stats">
            <span>Vigueur</span>
            <span>Mémoire</span>
            <span>Calamine</span>
          </GameSurface>
        </div>
      </section>

      <section className="ui-kit-preview__section">
        <h2>Narration et choix</h2>
        <GameSurface className="ui-kit-preview__narrative" padding="lg" variant="card">
          <GameSectionHeading
            description="Chaque légende commence par un nom."
            ornament="watcher"
            title="Identité"
          />
          <NarrativePassage align="center" dropCap>
            <p>
              Tu entres dans la taverne du Doigt-Cassé. Les conversations se taisent autour de toi,
              tandis qu’un regard inconnu mesure chacun de tes pas.
            </p>
          </NarrativePassage>
          <DialogueChoiceGroup className="ui-kit-preview__choices" label="Actions disponibles">
            <DialogueChoice icon={<GameIcon decorative name="eye" size={32} />}>
              Observer la salle et chercher une sortie discrète
            </DialogueChoice>
            <DialogueChoice icon={<GameIcon decorative name="coin" size={32} />}>
              Aller au bar et commander un verre
            </DialogueChoice>
            <DialogueChoice disabled icon={<GameIcon decorative name="quill" size={32} />}>
              Cette voie n’est pas encore disponible
            </DialogueChoice>
          </DialogueChoiceGroup>
          <NarrativeComposer />
        </GameSurface>
      </section>

      <section className="ui-kit-preview__section">
        <h2>Avatars et progression</h2>
        <div className="ui-kit-preview__row">
          <GameAvatar src="/ui-kit/icons/stranger.webp" alt="Étranger" size="lg" />
          <GameAvatar src="/ui-kit/icons/mage.webp" alt="Mage" size="lg" state="active" />
          <GameAvatar src="/ui-kit/icons/helmet.webp" alt="Guerrier" size="lg" state="selected" />
          <GameAvatar src="/ui-kit/icons/crown.webp" alt="Prestige" size="lg" state="prestige" />
        </div>
        <GameStepper
          items={steps}
          currentId="class"
          completedIds={['identity', 'appearance']}
          ariaLabel="Création du personnage"
        />
      </section>

      <section className="ui-kit-preview__section">
        <h2>Structure et navigation</h2>
        <GameSceneLayout
          className="ui-kit-preview__scene"
          variant="sidebar"
          top={
            <GameTopBar
              start={
                <LocationIdentity
                  icon={<GameIcon decorative name="compass" size={32} />}
                  place="Tissan"
                  world="Velkhar"
                />
              }
              center={
                <PlayerIdentity
                  avatar={<GameAvatar alt="Aerion" size="sm" src="/ui-kit/icons/stranger.webp" />}
                  name="Aerion"
                  subtitle="Tisse-Verbe"
                />
              }
              end={
                <ResourceCounter
                  compact
                  icon={<GameIcon decorative name="coin" size={24} />}
                  label="Sceaux"
                  value={125}
                />
              }
            />
          }
          main={
            <GameSurface padding="md" variant="card">
              <NarrativePassage dropCap>
                <p>Le refuge bruisse de voix étouffées tandis que la nuit descend sur Tissan.</p>
              </NarrativePassage>
            </GameSurface>
          }
          sidebar={
            <GameSurface padding="sm" variant="card">
              <h3>Souvenirs</h3>
              <div className="ui-kit-preview__memories">
                <MemoryBadge
                  title="Le serment du Sel"
                  visual={<GameAvatar alt="Souvenir" size="lg" src="/ui-kit/icons/memory.webp" />}
                />
                <MemoryBadge
                  title="Le rêve archonique"
                  visual={<GameAvatar alt="Rêve" size="lg" src="/ui-kit/icons/moon.webp" />}
                />
              </div>
            </GameSurface>
          }
          bottom={
            <GameStepDock>
              <GameStepper ariaLabel="Progression" currentId="class" items={steps} />
            </GameStepDock>
          }
        />
      </section>

      <section className="ui-kit-preview__section">
        <h2>HUD</h2>
        <div className="ui-kit-preview__hud-grid">
          <HudFrame variant="horizontal">
            <StatBar label="Sang" value={12} max={14} tone="sang" />
          </HudFrame>
          <SurvieGauge
            soif={{ value: 8, max: 10 }}
            faim={{ value: 6, max: 10 }}
            fatigue={{ value: 4, max: 10 }}
          />
          <CalamineMeter value={22} max={100} />
        </div>
        <GameHudDock className="ui-kit-preview__dock">
          <div className="ui-kit-preview__rings">
            <GameProgressRing
              icon={<GameIcon decorative name="water" size={24} />}
              label="Soif"
              max={100}
              tone="souffle"
              value={78}
            />
            <GameProgressRing
              icon={<GameIcon decorative name="hunger" size={24} />}
              label="Faim"
              max={100}
              tone="cendre"
              value={60}
            />
            <GameProgressRing
              icon={<GameIcon decorative name="moon" size={24} />}
              label="Fatigue"
              max={100}
              value={45}
            />
          </div>
          <ResourceCounter
            compact
            icon={<GameIcon decorative name="coin" size={32} />}
            label="Sceaux"
            value={127}
          />
          <InventoryQuickbar>
            <InventorySlot
              icon={<GameIcon decorative name="potion" size={48} />}
              label="Potion"
              quantity={2}
            />
            <InventorySlot
              icon={<GameIcon decorative name="key" size={48} />}
              label="Clé"
              selected
            />
            <InventorySlot
              icon={<GameIcon decorative name="envelope" size={48} />}
              label="Lettre scellée"
            />
          </InventoryQuickbar>
        </GameHudDock>
      </section>

      <section className="ui-kit-preview__section">
        <h2>Vocations</h2>
        <div className="ui-kit-preview__cards">
          <VocationCard
            description="Lit les routes, le vent et les dettes d’hospitalité."
            id="marcheur-du-sel"
            illustration={<VocationEmblem decorative name="marcheur-du-sel" />}
            title="Marcheur-du-Sel"
          />
          <VocationCard
            description="Traverse les secrets, les contrats et les ombres sans laisser de trace."
            id="lame-ombre"
            illustration={<VocationEmblem decorative name="lame-ombre" />}
            title="Lame-Ombre"
          />
          <VocationCard
            id="veilleur"
            title="Le Veilleur"
            description="Déchiffre les ruines, les glyphes et le savoir archontique enfoui."
            illustration={<VocationEmblem decorative name="veilleur" />}
            selected
          />
          <VocationCard
            id="tisse-verbe"
            title="Le Tisse-Verbe"
            description="Éveille les artefacts par les mots et accepte le prix de la Cendre."
            illustration={<VocationEmblem decorative name="tisse-verbe" />}
          />
        </div>
      </section>

      <section className="ui-kit-preview__section ui-kit-preview__section--wide">
        <h2>Compositions de référence</h2>
        <div className="ui-kit-preview__proof-stack">
          <article id="proof-form">
            <h3>Création de personnage</h3>
            <CharacterFormComposition />
          </article>
          <article id="proof-hub">
            <h3>Hub narratif</h3>
            <HubComposition />
          </article>
          <article id="proof-session">
            <h3>Session de jeu</h3>
            <GameSessionComposition />
          </article>
        </div>
      </section>

      <section className="ui-kit-preview__section">
        <h2>Bibliothèque d’icônes · {GAME_ICON_NAMES.length}</h2>
        <div className="ui-kit-preview__icons">
          {GAME_ICON_NAMES.map((name) => (
            <figure key={name}>
              <GameIcon name={name} size={64} label={name} />
              <figcaption>{name}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  )
}
