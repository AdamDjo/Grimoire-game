import { notFound } from 'next/navigation'

import {
  DialogueChoice,
  DialogueChoiceGroup,
  GameButton,
  GameField,
  GameIcon,
  GameInput,
  GameTextarea,
  NarrativeComposer,
} from '@/components/ui/velkhar'
import { GameHud } from '@/features/game-session/velkhar/GameHud/GameHud'

import './ui-kit-preview.css'

export default function UiKitPreviewPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <main className="primary-ui-preview">
      <header className="primary-ui-preview__header">
        <p>Design system Encre de Sel</p>
        <h1>Contrôles principaux</h1>
        <span>Cette route existe uniquement en développement.</span>
      </header>

      <section className="primary-ui-preview__section" aria-labelledby="preview-buttons">
        <h2 id="preview-buttons">Boutons et liens d’action</h2>
        <div className="primary-ui-preview__grid">
          <PreviewGroup title="Primary">
            <GameButton variant="primary">Entrer dans Velkhar</GameButton>
            <GameButton disabled variant="primary">
              Indisponible
            </GameButton>
            <GameButton loading variant="primary">
              Chargement
            </GameButton>
          </PreviewGroup>
          <PreviewGroup title="Secondary">
            <GameButton variant="secondary">Reprendre la route</GameButton>
            <GameButton tone="danger" variant="secondary">
              Abandonner
            </GameButton>
          </PreviewGroup>
          <PreviewGroup title="Ghost et icon">
            <GameButton variant="ghost">Passer le prologue</GameButton>
            <GameButton aria-label="Continuer" variant="icon">
              <GameIcon decorative name="arrow" size={32} />
            </GameButton>
          </PreviewGroup>
        </div>
      </section>

      <section className="primary-ui-preview__section" aria-labelledby="preview-fields">
        <h2 id="preview-fields">Champs</h2>
        <div className="primary-ui-preview__fields">
          <GameField label="Nom du survivant" hint="Ce nom apparaîtra dans la Chronique.">
            <GameInput placeholder="Entre un nom" />
          </GameField>
          <GameField label="Nom indisponible" error="Choisis un autre nom.">
            <GameInput defaultValue="L'Aveugle" />
          </GameField>
          <GameField label="Champ désactivé">
            <GameInput disabled value="Verrouillé" readOnly />
          </GameField>
          <GameField label="Concept libre" hint="Décris une intention claire.">
            <GameTextarea placeholder="Écris quelques lignes" rows={4} />
          </GameField>
        </div>
      </section>

      <section className="primary-ui-preview__section" aria-labelledby="preview-hud">
        <h2 id="preview-hud">Dock de survie</h2>
        <p className="primary-ui-preview__note">
          Le même dock est utilisé dans la démonstration de l’accueil et dans la session de jeu.
        </p>
        <div className="primary-ui-preview__dock-frame">
          <GameHud
            labels={{
              region: 'État du survivant',
              gauges: {
                blood: 'Sang',
                breath: 'Souffle',
                hunger: 'Faim',
                thirst: 'Soif',
                calamine: 'Calamine',
              },
            }}
            survival={{
              hp: 3,
              maxHp: 5,
              energy: 60,
              hunger: 40,
              thirst: 40,
              calamine: 2,
              isDying: false,
              neglectStreak: 0,
              empriseCharges: 0,
            }}
          />
        </div>
      </section>

      <section className="primary-ui-preview__section" aria-labelledby="preview-narrative">
        <h2 id="preview-narrative">Choix narratifs</h2>
        <DialogueChoiceGroup label="Actions disponibles">
          <DialogueChoice number={1}>Observer la salle en silence</DialogueChoice>
          <DialogueChoice number={2} selected>
            Demander audience à L'Aveugle
          </DialogueChoice>
          <DialogueChoice number={3} disabled>
            Franchir la porte scellée
          </DialogueChoice>
        </DialogueChoiceGroup>
        <NarrativeComposer actionLabel="Agir" aria-label="Action libre" />
      </section>
    </main>
  )
}

function PreviewGroup({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="primary-ui-preview__group">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  )
}
