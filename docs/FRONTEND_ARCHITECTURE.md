# Frontend Architecture - RPG Narratif

**Vue**: Structure Next.js 15 (App Router), composants Tailwind, approche "Statique d'abord"

---

## Directory Structure

```
apps/frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (main)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── character-create/
│   │   │   │   └── page.tsx
│   │   │   ├── leaderboard/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (game)/
│   │   │   └── session/
│   │   │       ├── [sessionId]/
│   │   │       │   └── page.tsx (MAIN GAME SCREEN)
│   │   │       └── end/
│   │   │           └── page.tsx (GAME OVER SCREEN)
│   │   │
│   │   ├── layout.tsx (root layout)
│   │   └── page.tsx (landing page)
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── Badge.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   │
│   │   ├── character/
│   │   │   ├── CharacterCreator.tsx
│   │   │   ├── ClassSelector.tsx
│   │   │   ├── StatDistributor.tsx
│   │   │   └── StatPreview.tsx
│   │   │
│   │   ├── game/
│   │   │   ├── SceneDisplay.tsx
│   │   │   ├── ChoiceButton.tsx
│   │   │   ├── ChoicesList.tsx
│   │   │   ├── EventLog.tsx
│   │   │   └── GameOverScreen.tsx
│   │   │
│   │   ├── sidebar/
│   │   │   ├── StatsSidebar.tsx
│   │   │   ├── InventorySidebar.tsx
│   │   │   ├── SkillsSidebar.tsx
│   │   │   └── ReputationBar.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   └── leaderboard/
│   │       ├── LeaderboardTable.tsx
│   │       └── LeaderboardTabs.tsx
│   │
│   ├── hooks/
│   │   ├── useGameState.ts
│   │   ├── useCharacter.ts
│   │   ├── useSession.ts
│   │   └── useAuth.ts
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── api-client.ts
│   │   └── game-constants.ts
│   │
│   ├── types/
│   │   └── index.ts (import from @rpg-game/shared)
│   │
│   └── styles/
│       └── globals.css
```

---

## Pages Détaillées

### 1. Landing Page (`/page.tsx`)

**Purpose**: Première page avant login

**Layout**:
```
┌─────────────────────────────────────────┐
│  RPG Narratif Logo        [Login] [Sign] │
├─────────────────────────────────────────┤
│                                         │
│      HEADER HERO SECTION                │
│  "Univers infini générés par IA"        │
│  "Chaque partie est une histoire unique" │
│                                         │
│      [COMMENCER]                        │
│                                         │
├─────────────────────────────────────────┤
│  FEATURE CARDS:                         │
│  - Progression (levels, loot)           │
│  - Conséquences permanentes             │
│  - Multiple endings                     │
│                                         │
├─────────────────────────────────────────┤
│  Footer                                 │
└─────────────────────────────────────────┘
```

**Components Used**:
- `Header.tsx` (branding, navigation)
- `Card.tsx` (feature cards)
- `Button.tsx` (CTA buttons)

---

### 2. Login Page (`/(auth)/login/page.tsx`)

**Purpose**: Authentification utilisateur

**Layout**:
```
┌─────────────────────────────────────────┐
│  RPG Narratif                           │
├─────────────────────────────────────────┤
│                                         │
│       CONNEXION                         │
│                                         │
│  Email:      [________________]         │
│  Mot de passe: [________________]       │
│                                         │
│           [Se connecter]                │
│                                         │
│  Pas de compte? [S'inscrire]            │
│                                         │
└─────────────────────────────────────────┘
```

**Components Used**:
- `LoginForm.tsx` (form logic)
- `Input.tsx` (form inputs)
- `Button.tsx` (submit)

**Form Validation**:
- Email required, valid email
- Password required, min 6 chars
- Show error messages

---

### 3. Signup Page (`/(auth)/signup/page.tsx`)

**Purpose**: Inscription nouvel utilisateur

**Layout**: Similaire à Login, mais avec confirmation password

**Components Used**:
- `SignupForm.tsx`
- `Input.tsx`
- `Button.tsx`

---

### 4. Dashboard (`/(main)/dashboard/page.tsx`)

**Purpose**: Menu principal après login

**Layout**:
```
┌─────────────────────────────────────────┐
│ Profil: John Doe   [Settings] [Logout] │
├─────────────────────────────────────────┤
│                                         │
│      TABLEAU DE BORD                    │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ ▶ NOUVELLE PARTIE                │  │
│  │   (Créer nouveau personnage)     │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ MES PARTIES EN COURS              │  │
│  │ - Thrall (Guerrier) - 2h45       │  │
│  │   [Reprendre]                     │  │
│  │ - Elara (Magicien) - 45min       │  │
│  │   [Reprendre]                     │  │
│  │ - Kael (Voleur) - 1h23           │  │
│  │   [Reprendre]                     │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ STATISTIQUES GLOBALES             │  │
│  │ - Parties jouées: 12              │  │
│  │ - Heures totales: 47h12min       │  │
│  │ - Best time: 52min                │  │
│  │ - Achievements: 5/20              │  │
│  │                                  │  │
│  │ [Voir leaderboards]              │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Components Used**:
- `Header.tsx` (user info)
- `Card.tsx` (sections)
- `Button.tsx` (actions)

**Data Structure** (Mock pour MVP):
```typescript
interface UserSession {
  characterName: string
  class: string
  level: number
  playtimeSeconds: number
  lastPlayedAt: Date
}

interface UserStats {
  totalSessionsPlayed: number
  totalHoursPlayed: number
  bestCompletionTime: number
  achievementsUnlocked: number
}
```

---

### 5. Character Creator (`/(main)/character-create/page.tsx`)

**Purpose**: Créer un personnage avant de commencer

**Layout**:
```
┌──────────────────────────────────────────┐
│ ◄ Retour              Création Personnage│
├──────────────────────────────────────────┤
│                                          │
│  NOM:                                    │
│  [_____________________________]         │
│  "Thrall" (min 3, max 20 chars)        │
│                                          │
│  CLASSE: (Cards avec sélection)         │
│                                          │
│  ┌─────────────┐  ┌─────────────┐     │
│  │  GUERRIER   │  │  MAGICIEN   │     │
│  │ ♥ Str +2    │  │ ◆ Int +2    │     │
│  │ ♦ Wil +1    │  │ ◆ Agi +1    │     │
│  │             │  │             │     │
│  │  Dégâts élevés │  Énigmes, magie│  │
│  └─────────────┘  └─────────────┘     │
│                                          │
│  ┌─────────────┐  ┌─────────────┐     │
│  │   VOLEUR    │  │   PRÊTRE    │     │
│  │ ◆ Agi +2    │  │ ♥ Emp +2    │     │
│  │ ♥ Emp +1    │  │ ◆ Int +1    │     │
│  │             │  │             │     │
│  │ Stealth     │  │ Parole      │     │
│  └─────────────┘  └─────────────┘     │
│                                          │
│  ┌─────────────┐                        │
│  │  CHEVALIER  │                        │
│  │ ♥ Str +2    │                        │
│  │ ♥ Wil +2    │                        │
│  │ ◆ Agi -1    │                        │
│  │             │                        │
│  │ Honorable   │                        │
│  └─────────────┘                        │
│                                          │
│  DISTRIBUTION DE POINTS (5 points):     │
│  Force:    ●●● [+] [-]  = 13           │
│  Intellect: ●● [+] [-]  = 11           │
│  Agilité:  ●●●●● [+] [-]  = 15         │
│  Empathie: ● [+] [-]  = 8              │
│  Volonté:  ●● [+] [-]  = 10            │
│                                          │
│  BONUS CLASSE (GUERRIER):               │
│  Force: 13 → 15 (+2)                    │
│  Volonté: 10 → 11 (+1)                  │
│                                          │
│  [Annuler]              [Commencer!]    │
│                                          │
└──────────────────────────────────────────┘
```

**Components Used**:
- `CharacterCreator.tsx` (main form)
- `ClassSelector.tsx` (class grid)
- `StatDistributor.tsx` (stat points)
- `StatPreview.tsx` (preview final stats)
- `Button.tsx`
- `Input.tsx`

**State Management** (Zustand):
```typescript
interface CharacterState {
  name: string
  selectedClass: Class
  baseStats: Stats
  addPointToStat: (stat: StatKey) => void
  removePointFromStat: (stat: StatKey) => void
  getFinalStats: () => Stats
  isValid: () => boolean
}
```

---

### 6. Game Session (`/(game)/session/[sessionId]/page.tsx`)

**Purpose**: MAIN GAME SCREEN - 70% du gameplay ici

**Layout**:
```
┌────────────────────────────────────────────────────────┐
│ [Menu] Thrall | HP 85/100 | San 70/100 | Stamina 75/100│
├────────────────────────────────────────────────────────┤
│                                      │                  │
│  SCÈNE DISPLAY (70% width)           │ SIDEBARS (30%)  │
│  ┌──────────────────────────────┐   │ ┌──────────────┐ │
│  │ SCÈNE 7: Sanctuaire Oublié   │   │ │ STATS        │ │
│  │                              │   │ │              │ │
│  │ Vous franchissez les portes  │   │ │ HP: ████░░   │ │
│  │ en ruine du sanctuaire. L'air│   │ │ 85/100       │ │
│  │ est chargé de magie ancienne.│   │ │              │ │
│  │ Au centre brille une sphère  │   │ │ San: ███░░░  │ │
│  │ bleutée...                   │   │ │ 70/100       │ │
│  │                              │   │ │              │ │
│  │ [EVENT LOG]                  │   │ │ Stamina: ███░│ │
│  │ - Vous avez pris la clé doré│   │ │ 75/100       │ │
│  │ - HP -5 par la chute du pont │   │ │              │ │
│  │ - +100 XP                    │   │ │ Level: 5     │ │
│  │                              │   │ │ XP: ██░░░░░░ │ │
│  └──────────────────────────────┘   │ │ 425/1000     │ │
│                                      │ │              │ │
│  CHOICES (4 buttons):                │ │ STR 15 INT 11│ │
│  ┌──────────────────────────────┐   │ │ AGI 15 EMP 8 │ │
│  │ ⊳ Approchez-vous de la sphère│   │ │ WIL 10       │ │
│  │   (Intellect check: 12) ✓    │   │ │              │ │
│  │   "Vous tentez de vérifier"  │   │ │ INVENTORY:   │ │
│  │                              │   │ │ (6/10 slots) │ │
│  │ ⊳ Allez vers la porte        │   │ │              │ │
│  │   (Aucun préalable)          │   │ │ ◀ Épée       │ │
│  │   "Vous vous éloignez"       │   │ │   +2 Str     │ │
│  │                              │   │ │              │ │
│  │ ⊳ Montez l'escalier          │   │ │ ◀ Clé dorée  │ │
│  │   (Agi 10, -2 fatigué) ⚠     │   │ │   Quest item │ │
│  │   "L'escalier craque..."     │   │ │              │ │
│  │                              │   │ │ ◀ Potion x2  │ │
│  │ ⊳ Examinez la statue         │   │ │   Heal 50 HP │ │
│  │   (Str 15) ✓✓✓              │   │ │              │ │
│  │   "Vous soulevez..."         │   │ │ ◀ Livre      │ │
│  │                              │   │ │   Lore       │ │
│  └──────────────────────────────┘   │ └──────────────┘ │
│                                      │                  │
└────────────────────────────────────────────────────────┘
```

**Components Used**:
- `SceneDisplay.tsx` (scene title + description)
- `EventLog.tsx` (last 3-4 events)
- `ChoicesList.tsx` (all 4 choices)
- `ChoiceButton.tsx` (individual choice)
- `StatsSidebar.tsx` (left sidebar stats)
- `InventorySidebar.tsx` (inventaire panel)
- `Header.tsx` (top bar with quick stats)

**Interactions**:
1. User clicks choice button
2. POST `/api/game/action` { sessionId, choiceId }
3. Scene updates with animation
4. Event log updates
5. Stats potentially change

**State Management**:
```typescript
interface GameSessionState {
  sessionId: string
  character: Character
  currentScene: Scene
  eventLog: LogEntry[]
  inventory: InventoryItem[]
  stats: Stats
  level: number
  xp: number

  selectChoice: (choiceId: string) => Promise<void>
  updateFromAPI: (data: APIResponse) => void
}
```

---

### 7. Game Over Screen (`/(game)/session/end/page.tsx`)

**Purpose**: Afficher résumé de partie

**Layout**:
```
┌──────────────────────────────────────────┐
│                                          │
│          VICTOIRE!  🎉                   │
│                                          │
│  Vous avez sauvé le royaume!             │
│                                          │
│  ────────────────────────────────────    │
│  RÉSUMÉ:                                 │
│                                          │
│  Personnage: Thrall (Guerrier Lvl 8)   │
│  Temps: 1h 45min                        │
│  Scènes traversées: 47                  │
│  Ennemis vaincus: 12                    │
│  Items trouvés: 8 (2 Legendary!)        │
│  Réputation: +25 (Order of Honor)       │
│  Achievements: Derrière-garde, Héros   │
│                                          │
│  ────────────────────────────────────    │
│                                          │
│  [Nouvelle Partie]    [Retour Menu]    │
│                                          │
│  Partagez votre victoire: [Twitter]    │
│                                          │
└──────────────────────────────────────────┘
```

**Components Used**:
- `GameOverScreen.tsx` (main)
- `Card.tsx` (summary box)
- `Button.tsx`

---

### 8. Leaderboard (`/(main)/leaderboard/page.tsx`)

**Purpose**: Voir les scores globaux

**Layout**:
```
┌──────────────────────────────────────────┐
│ Leaderboards                             │
├──────────────────────────────────────────┤
│                                          │
│  Tabs: [Temps] [Niveau] [Items] [Score] │
│                                          │
│  TEMPS DE COMPLETION                     │
│  1. 🥇 John - 42min                     │
│  2. 🥈 Alice - 48min                    │
│  3. 🥉 Bob - 51min                      │
│  4. Sarah - 1h02                        │
│  5. Mike - 1h15                         │
│                                          │
└──────────────────────────────────────────┘
```

---

### 9. Settings Page (`/(main)/settings/page.tsx`)

**Purpose**: Paramètres utilisateur

**Options**:
- Sound on/off
- Difficulty (Easy/Normal/Hard)
- Narrative style (Dark/Comedy/Epic)
- Scene length (Short/Normal/Long)
- Theme (Light/Dark)
- Account settings

---

## Component Library (Reusable UI)

### Button.tsx
```typescript
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

### Input.tsx
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}
```

### Card.tsx
```typescript
interface CardProps {
  children: React.ReactNode
  title?: string
  className?: string
  onClick?: () => void
}
```

### Badge.tsx (for rarity)
```typescript
interface BadgeProps {
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  children: React.ReactNode
}
// Colors: white, green, blue, purple, orange
```

---

## Styling Strategy

**Colors (Tailwind)**:
```
Primary: Indigo-600 (buttons, focus)
Secondary: Slate-700 (text, backgrounds)
Success: Green-500 (positive feedback)
Warning: Yellow-500 (caution)
Danger: Red-500 (errors, death)

Rarity Colors:
- Common: White
- Uncommon: Green
- Rare: Blue
- Epic: Purple
- Legendary: Orange
```

**Typography**:
- H1: 3xl bold (page titles)
- H2: 2xl bold (section titles)
- H3: xl bold (subsection titles)
- Body: base regular (text content)
- Small: sm (descriptions)

---

## Phase 1A Milestone (Week 5)

**By end of week 5, DONE**:
- ✅ All 9 pages created + navigable
- ✅ All components built
- ✅ Mock data integrated
- ✅ Responsive design (desktop first)
- ✅ No API calls yet (all static)

**Pages ready to integrate with backend**:
1. Login/Signup (auth endpoints)
2. Dashboard (session list)
3. Character Creator (POST /characters)
4. Game Session (game loop)
5. Game Over (result display)
6. Leaderboard (static data initially)
7. Settings (user prefs)
