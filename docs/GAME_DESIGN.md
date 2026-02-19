# Game Design - RPG Narratif Multi-Univers

**Version**: 3.0 (Multi-Universe Architecture)
**Status**: Ready to Develop ✅

---

## 📖 Vue d'ensemble

### Concept
**RPG Narratif Web** est un jeu d'aventure généré par IA où chaque partie est unique. Le joueur choisit un **univers** (Fantasy, Apocalypse, ou Sci-Fi), crée un personnage, et explore des histoires générées dynamiquement. Progression visible (leveling, loot) + narrative rich + multi-univers = replayabilité massive.

### Core Hook
- 🎮 **Progression**: Leveling visible, loot drops, skills débloqués
- 📖 **Narrative**: Scènes riches générées par IA, conséquences permanentes
- 🌍 **Multi-Univers**: 3 univers distincts (Fantasy, Apocalypse, Sci-Fi) + custom (Phase 3)
- 🔄 **Replayabilité**: 15+ classes, 5+ endings par univers, expériences uniques
- 🎯 **Engagement**: Le monde se souvient des choix, NPCs réagissent, world change

### Exemple de Session (Fantasy)
```
1. Choisir univers "Valorain" (Fantasy)
2. Créer Thrall, Guerrier (HP 100, Str 15, Agi 11, Int 8, Cha 10, Luck 10)
3. L'IA génère scène 1: Terres Sauvages de Valorain
4. Rencontrer bandits → choisir combat ou négociation
5. Combat gagné → [EPIC] Épée des Anciens (loot!)
6. Level 2! +2 HP, +1 Strength. Skill "Cleave" débloqué!
7. Festival arrive → nouvelles opportunités
8. 1h30+ de gameplay → possible mort, victoire, ou fin secrète
9. Rejouer = même univers, classe différente OU univers différent = expérience totalement unique
```

---

## 🌍 Les 3 Univers de Base

### 1. Valorain (Fantasy WoW-like)

**Theme**: Médiéval fantastique, magie, créatures mythiques
**Inspirations**: World of Warcraft, Skyrim (mais 100% original)

**Geography**:
- **Valorheim**: Terres nordiques, guerriers, châteaux de pierre
- **Shadowveil**: Lands corrompues, undead, darkness
- **Sanctum**: Tours de magie, forêts enchantées, mystères
- **Verdantis**: Jungles denses, nature sauvage, créatures primitives
- **Skybound**: Îles flottantes, êtres célestes, mystère

**Factions**:
| Faction | Alignment | Goal |
|---------|-----------|------|
| **Order of Honor** | Good | Maintenir l'ordre, protéger innocents |
| **Shadow Circle** | Evil | Conquête du pouvoir, corruption |
| **Wild Kin** | Neutral | Liberté, nature, autodétermination |
| **Mage Council** | Neutral | Connaissance, magie, étude |

**Creatures** (Originaux):
- **Valorrim**: Humanoids nordiques
- **Aether-touched**: Êtres magiques
- **Voidborn**: Créatures shadow
- **Feylins**: Folk forestiers
- **Drakonir**: Humanoids écailleux

---

### 2. Terre Désolée (Post-Apocalypse)

**Theme**: Survie, ressources rares, factions humaines hostiles
**Inspirations**: Fallout, The Last of Us, Metro (mais original)

**Geography**:
- **Les Ruines**: Grandes villes effondrées, gratte-ciels en ruine
- **La Zone Verte**: Rares oasis de nature revigorée
- **Le Désert de Cendres**: Wasteland radioactif, danger permanent
- **Les Bunkers**: Réseaux souterrains, civilisation cachée
- **Les Marais Toxiques**: Zones mutantes, créatures étranges

**Factions**:
| Faction | Alignment | Goal |
|---------|-----------|------|
| **Les Éclaireurs** | Good | Reconstruire la civilisation |
| **Les Pillards** | Evil | Survie par la force, vol |
| **Les Nomades** | Neutral | Liberté, commerce itinérant |
| **Le Culte du Renouveau** | Neutral | Mutation = évolution |

**Threats**:
- Radiation zones, mutants, raiders, scarcity

---

### 3. Nova Galaxia (Sci-Fi Space Opera)

**Theme**: Exploration spatiale, technologies avancées, aliens
**Inspirations**: Mass Effect, Star Wars (mais original)

**Geography**:
- **Nexus Prime**: Station spatiale centrale, hub commercial
- **Secteur Frontier**: Planètes colonisées, lawless
- **Le Void**: Espace profond, mystères anciens
- **Ceinture d'Astéroïdes**: Mines, pirates, danger
- **Mondes Xenos**: Planètes aliens, civilisations inconnues

**Factions**:
| Faction | Alignment | Goal |
|---------|-----------|------|
| **Confédération Stellaire** | Good | Ordre, paix galactique |
| **Syndicat Noir** | Evil | Profit, marché noir, crime |
| **Explorateurs Libres** | Neutral | Découverte, liberté |
| **Culte Ancien** | Neutral | Technologie alien ancestrale |

**Species**:
- Humans, Synthetics (AI), Xenos (diverse alien races)

---

## ⚔️ Classes par Univers

### 📖 Système de Stats Universel

**Toutes les classes utilisent ces 7 stats** :

| Stat | Fantasy | Apocalypse | Sci-Fi |
|------|---------|------------|--------|
| **HP** | Points de vie | Santé | Intégrité corporelle |
| **Mana** | Énergie magique | Stamina | Énergie bouclier |
| **Strength** | Force physique | Force brute | Force gravitique |
| **Agility** | Agilité combat | Vitesse, esquive | Réflexes pilotage |
| **Intelligence** | Connaissance magie | Ingénierie, craft | Hacking, tech |
| **Charisma** | Persuasion, social | Leadership | Diplomatie aliens |
| **Luck** | Chance loot | Scavenge bonus | Rencontres rares |

---

### 🏰 Fantasy - Valorain (5 classes)

#### Guerrier
- **Bonus**: +3 Strength, +15 Max HP, -1 Intelligence
- **Playstyle**: Combat rapproché, tanking, dégâts bruts
- **Starting Skills**: Frappe Puissante, Cri de Guerre
- **Unique**: Peut briser portes, intimider ennemis

#### Mage
- **Bonus**: +3 Intelligence, +20 Max Mana, -1 Strength
- **Playstyle**: Sorts élémentaires, résolution d'énigmes
- **Starting Skills**: Boule de Feu, Bouclier Arcanique
- **Unique**: Déchiffre runes anciennes, lévitation

#### Voleur
- **Bonus**: +3 Agility, +2 Luck, -5 Max HP
- **Playstyle**: Stealth, vols, pièges, esquive
- **Starting Skills**: Attaque Sournoise, Crochetage
- **Unique**: Détecte pièges, pickpocket NPCs

#### Guérisseur
- **Bonus**: +2 Intelligence, +2 Charisma, +15 Max Mana
- **Playstyle**: Support, soins, buffs
- **Starting Skills**: Soin Mineur, Purification
- **Unique**: Guérit maladies, calme NPCs hostiles

#### Rôdeur
- **Bonus**: +2 Agility, +1 Strength, +1 Luck
- **Playstyle**: Archerie, nature, survie
- **Starting Skills**: Tir Précis, Pistage
- **Unique**: Apprivoise créatures, survie wilderness

---

### 💀 Apocalypse - Terre Désolée (4 classes)

#### Récupérateur
- **Bonus**: +3 Luck, +1 Intelligence, +1 Agility
- **Playstyle**: Fouille, craft, bricolage
- **Starting Skills**: Fouille Experte, Bricolage
- **Unique**: Trouve ressources rares, répare objets

#### Bagarreur
- **Bonus**: +3 Strength, +10 Max HP, -1 Intelligence
- **Playstyle**: Combat de rue, brutal, résistant
- **Starting Skills**: Coup de Poing, Résistance
- **Unique**: Ignore douleur, combat sans armes

#### Médecin
- **Bonus**: +3 Intelligence, +2 Charisma, -1 Strength
- **Playstyle**: Soins, diagnostics, chimie
- **Starting Skills**: Premiers Soins, Diagnostic
- **Unique**: Créer médicaments, soigner radiation

#### Ingénieur
- **Bonus**: +3 Intelligence, +1 Agility, -1 Charisma
- **Playstyle**: Tech, hacking, pièges
- **Starting Skills**: Réparation, Piège Improvisé
- **Unique**: Hack terminaux, créer explosifs

---

### 🚀 Sci-Fi - Nova Galaxia (5 classes)

#### Pilote
- **Bonus**: +3 Agility, +2 Luck, -1 Strength
- **Playstyle**: Pilotage, manœuvres, vitesse
- **Starting Skills**: Manœuvre Évasive, Navigation Stellaire
- **Unique**: Pilote vaisseaux, évite combats spatiaux

#### Soldat
- **Bonus**: +2 Strength, +10 Max HP, +1 Agility
- **Playstyle**: Combat tactique, armes lourdes
- **Starting Skills**: Tir de Barrage, Couverture Tactique
- **Unique**: Tactiques militaires, résiste blessures

#### Hacker
- **Bonus**: +3 Intelligence, +1 Agility, -2 Strength
- **Playstyle**: Intrusion, contrôle systèmes
- **Starting Skills**: Intrusion Système, Scan de Données
- **Unique**: Hack drones, désactive sécurité

#### Diplomate
- **Bonus**: +3 Charisma, +2 Intelligence, -2 Strength
- **Playstyle**: Négociation, résolution pacifique
- **Starting Skills**: Persuasion, Analyse Culturelle
- **Unique**: Évite combats, accès factions

#### Psionique
- **Bonus**: +2 Intelligence, +20 Max Mana, +1 Charisma
- **Playstyle**: Pouvoirs mentaux, manipulation
- **Starting Skills**: Télékinésie, Lecture Mentale
- **Unique**: Contrôle esprit, détecte mensonges

---

## 🎮 Features par Phase

### Phase 1 - MVP (Week 1-10) ✅
**Goal**: Game is playable and fun
**Universe**: Fantasy (Valorain) UNIQUEMENT

#### Essential Features
| Feature | Why | Example |
|---------|-----|---------|
| **Authentication** | Control access | Login/signup |
| **Universe Selection** | Choose theme | Fantasy visible, autres grisés (Phase 2B) |
| **Character Creation** | Player identity | Choose class (5 fantasy), distribute stats |
| **Scene Generation** | Core gameplay | AI generates narrative (fantasy only) |
| **Choices & Consequences** | Interactivity | Choices affect stats, inventory |
| **Leveling System** | Progression | Visible XP bar, level ups |
| **Loot & Rarity** | Dopamine | Common/Uncommon/Rare/Epic/Legendary items |
| **Stat Checks** | Difficulty | "Intelligence ≥ 12?" success/fail |
| **Multiple Endings** | Replayability | 5+ distinct endings based on choices |
| **Game Over** | Stakes | Possible death, madness, betrayal |

**Code Architecture**:
- ✅ Backend prêt pour multi-univers (types, DB schema)
- ✅ Frontend UI avec sélecteur d'univers (mais 2 univers disabled)
- ✅ AI prompts adaptables par univers
- 🎯 **Exposition**: Fantasy uniquement

#### Not In MVP (But Planned)
- Apocalypse & Sci-Fi universes (Phase 2B)
- Named NPCs with memory (Phase 2B)
- Random world events (Phase 2B)
- Build diversity (class affects narrative) (Phase 2B)
- Achievements & leaderboards (Phase 2B)
- Custom universe creator (Phase 3)

### Phase 2B - Addictive Features + Multi-Universe (Week 11-16)
**Goal**: Game is addictive, highly replayable
**Universe**: Les 3 univers de base activés

| Feature | Addiction | Details |
|---------|-----------|---------|
| **Apocalypse & Sci-Fi** | 3x replayability | Activer les 2 autres univers |
| **Named NPCs** | Emotional investment | Tormund remembers you in scene 5, 12, 18 |
| **World Events** | Surprise, freshness | Random merchants, festivals, rare bosses |
| **Build Diversity** | Class identity | Warrior ≠ Mage experience (30-40% different) |
| **Achievements** | Completionism | "Dragon Slayer", "Speedrunner", etc. |
| **Reputation** | Consequences felt | Factions react to your choices |

**Deliverable**:
- ✅ 3 univers jouables (Fantasy, Apocalypse, Sci-Fi)
- ✅ 14 classes au total (5+4+5)
- ✅ Replayabilité massive (3 univers × 5 classes × 5 endings = 75+ expériences)

### Phase 3 - Polish + Custom Universes (Week 17+)
**Goal**: Community, cosmetics, UGC (User Generated Content)

| Feature | Purpose |
|---------|---------|
| **Custom Universe Creator** | UGC ultimate | Player crée son univers, IA génère classes |
| **Cosmetics** | Portraits, skins, titles |
| **NG+ Mode** | Meta-knowledge rewards |
| **Real Leaderboards** | Competition |
| **Story Export** | PDF, share with friends |
| **Streaming Integration** | Twitch chat affects game |
| **Community Features** | Wiki, fan art, discussions |
| **Universe Sharing** | Players share custom universes |

---

## 📊 Timeline & Phases

### Phase 1A: Frontend UI (Week 1-5)
**Parallel**: Phase 1B Backend starts week 4

```
Week 1:   Setup + Auth pages + Component library
Week 2-3: Character creation + Dashboard UI
Week 4:   Game session screen (complex!)
Week 5:   Polish, testing, responsive design

DELIVERABLE: All frontend pages done, beautiful UI, no API calls yet
```

### Phase 1B: Backend Foundation (Week 4-6)
**Parallel**: While frontend finishing

```
Week 4-5: Database schema + Auth endpoints
Week 6:   Game engine skeleton + AI integration test

DELIVERABLE: Backend structure ready, endpoints stubbed
```

### Phase 2: Integration (Week 7-10)
```
Week 7:   Auth + Character creation live
Week 8-9: Game loop with real AI
Week 10:  Polish, test, fix bugs

DELIVERABLE: MVP fully playable end-to-end ✅
```

### Phase 2B: Addictive Features (Week 11-16)
```
Week 11-12: Named NPCs + relationship tracking
Week 13-14: World events + randomization
Week 15-16: Build diversity + achievements

DELIVERABLE: Game is truly addictive, 5+ playthroughs feel different
```

### Phase 3: Polish (Week 17+)
```
Cosmetics, NG+, leaderboards, streaming, community
```

---

## 🎯 Success Criteria

### MVP Success (Week 10)
- ✅ User creates character (5 fantasy classes work)
- ✅ Fantasy universe fully playable
- ✅ Game generates unique scenes via AI
- ✅ Choices have consequences (visible)
- ✅ Leveling works (XP bar, level ups)
- ✅ Loot drops with rarity colors
- ✅ Session playable 50-70 minutes
- ✅ Multiple endings (5+) exist
- ✅ 0 game-breaking bugs
- ✅ Code prêt pour multi-univers (architecture)

### Phase 2B Success (Week 16)
- ✅ 3 univers jouables (Fantasy, Apocalypse, Sci-Fi)
- ✅ 14 classes total fonctionnelles
- ✅ NPCs appear multiple times, remember you
- ✅ World events add surprise factor
- ✅ Class affects 30-40% of content
- ✅ Achievements motivate replays
- ✅ Player wants to play again immediately

### Addiction Metric
**By MVP (Week 10), players should feel**:
- 🎮 "I want to play again with different class" (5 classes fantasy)
- 📖 "What if I made different choice in scene 5?"
- 🌍 "The world felt different this playthrough"

**By Phase 2B (Week 16), players should feel**:
- 🌍 "I want to try Apocalypse and Sci-Fi universes!"
- 🎮 "14 classes = infinite replayability"
- 🏆 "I need to unlock all achievements"
- 🔄 "Each universe feels completely different"

---

## 🔧 Tech Stack (Quick Reference)

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **State**: Zustand (client state)
- **Server Data**: React Query
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **HTTP**: Axios

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript (strict)
- **ORM**: Prisma
- **Auth**: JWT + bcryptjs
- **Validation**: Zod
- **Logging**: Pino
- **Security**: Rate limiting, CORS

### Database
- **PostgreSQL** (Supabase)

### AI
- **Providers**: Claude, Gemini, Mistral (fallback chain)
- **Prompting**: Structured JSON responses
- **Validation**: Scene validator service

---

## 📋 Why Phase 2B Not In MVP?

### Strategic Reasons

1. **Scope Control**
   - MVP only = 10 weeks (ships!)
   - Everything = 20+ weeks (never ships!)

2. **Testing**
   - MVP tests core loop with users
   - Get feedback before Phase 2B
   - Iterate based on real data

3. **Risk Mitigation**
   - If AI fails, catch it early
   - If UX bad, redesign before Phase 2B
   - If engagement low, debug core loop

4. **Feature Dependencies**
   - NPCs need many scenes (20+) to test
   - World events need randomizer working
   - Build diversity needs class context in every scene

### Better Approach
- ✅ Ship MVP (10 weeks)
- ✅ Get users playing
- ✅ Get feedback
- ✅ Implement Phase 2B (week 11-16)
- ✅ Launch Phase 2B update
- ✅ Game becomes viral (word of mouth)

---

## 🎨 Narrative Standards (High Level)

### Scene Quality
- **Length**: 400-600 words (readable, rich)
- **Clarity**: Simple language, not complex vocabulary
- **Immersion**: All senses (sight, sound, smell)
- **Consequence**: Reflects previous choices
- **Branching**: 4 distinct choices, all meaningful

### NPCs (Phase 2B)
- Same NPC reappears in different contexts
- Remembers previous interaction
- Relationship affects dialogue
- Can ally or betray based on history

### World Events (Phase 2B)
- 30% chance: random encounter
- 10% chance: rare creature
- 5% chance: merchant caravan
- Each has unique loot, story impact

---

## 📊 Addiction Factor Progression

```
MVP (Week 10):        70% addictive
  ✓ Leveling (satisfying)
  ✓ Loot drops (dopamine)
  ✓ Consequences (weight)
  ✓ Multiple endings (replayability)
  ✓ AI generation (novelty)

Phase 2B (Week 16):   90% addictive
  + Named NPCs (emotional)
  + World events (surprise)
  + Build diversity (identity)
  + Achievements (completion)

Phase 3 (Week 17+):   95%+ addictive
  + Cosmetics (self-expression)
  + NG+ (meta-gaming)
  + Leaderboards (competition)
  + Community (social)
```

---

## ❓ Key Decisions Made

✅ **Multi-Univers Architecture** (3 de base + custom en Phase 3)
✅ **Progressive Rollout** (Phase 1 = Fantasy, Phase 2B = 3 univers, Phase 3 = custom)
✅ **14 Classes Total** (5 fantasy, 4 apocalypse, 5 scifi)
✅ **Universal Stats System** (HP/Mana/Str/Agi/Int/Cha/Luck pour tous les univers)
✅ **Frontend-First** (design before backend)
✅ **Multi-AI Provider** (fallback reliability)
✅ **Permanent Consequences** (weight of choices)
✅ **Code Multi-Univers dès Phase 1** (architecture flexible, exposition progressive)

---

## 🚀 Next Step

**When ready to code**: Say "Start Phase 1A"

All spec, architecture, and tech stack documented.
Ready to build the game.
