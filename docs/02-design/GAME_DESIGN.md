# Game Design — GRIMOIRE: Of Ash and Salt

**Version**: 8.0 (Velkhar-aligned — passe sync 2026-06-28)
**Status**: Ready to Develop
**Scope of this doc**: The **WHAT** — vision, the world of **Velkhar** (fixed canon), JdR rules, UI/look, narrative standards, RP features, phases. For the **HOW** (stack, lore/memory system, AI via OpenRouter, endpoints, validation), see `TECH_STACK.md`. For current status, see `MEMORY.md`.

> ⚠️ **Source de vérité produit** : `docs/raw/` (GDD Velkhar, 25 fichiers, gitignored — physiquement dans le repo). Si divergence avec ce fichier → `docs/raw/` gagne. Index : [`docs/wiki/index.md`](../wiki/index.md).

> **Single source of truth.** Anything about _what the game is, how its world works, how it looks and plays_ lives here. Anything about _how it's coded_ lives in `TECH_STACK.md`. Stats, the scene JSON schema, AI prompts, and the lore/memory engine are documented **once** — in `TECH_STACK.md` — and only referenced here.

---

## 1. The Pitch

> **GRIMOIRE — Of Ash and Salt. Des Cendres et du Sel.**
> _A narrative roguelike where every run is a complete story — and the world remembers._

GRIMOIRE is an AI-powered narrative roguelike set in **Velkhar**, a dark fantasy desert continent. The player picks a **vocation** (Marcheur-du-Sel, Lame-Ombre, Veilleur, or Tisse-Verbe) and lives a complete adventure (3–15 hours). Death is permanent — but it is never sterile. A Chronicle is generated, the meta-world changes, and the next run tells a different story.

**Every run begins in the same place** : the Auberge de **L'Aveugle**, the keeper of thresholds, who sells lore for **Souvenirs** (meta-currency). From there, the player leaves into the world.

### Why this, why now

The dream of an infinite AI roleplaying game already exists — and it's broken:

- **AI Dungeon** gives total freedom but no memory and no rules. The AI invents a king in scene 2 and forgets him by scene 5.
- **Character.AI / SillyTavern** are great at _talking to a character_ but have no adventure, no stakes, no consequences.
- **Roadwarden / hand-written narrative games** are beautiful but finite.

GRIMOIRE takes the **freedom of AI-driven narrative** and adds **a real Game Master that doesn't cheat**: the backend owns the rules, the memory, and the world-state; the AI only writes the prose. That division is the entire moat.

### The three promises

1. **It remembers.** The MJ knows the Marcheur you spared in scene 3, and brings him back in scene 40 — because the backend recorded him as canon.
2. **It doesn't cheat.** Dice rolls (d20 + triptyque mod + skill) at **pivots only**, stat checks, success and failure are resolved by the backend.
3. **The world changes for good.** Poison the well and the village is still dying twenty scenes later. Consequences are stored as world-state.

### Core experience

- 🎭 **Be the author of your actions** — type _anything_; the MJ figures out the attribute (SANG/SOUFFLE/CENDRE) + difficulty, rolls at pivots, continues.
- 🧠 **A world with a memory** — persistent NPCs, kept promises, lasting consequences.
- 🎲 **Tabletop stakes** — visible d20 at pivot moments, real failure, but failure is always fertile (never a dead-end).
- 📖 **Living lore** — a small fixed canon (Velkhar) + emergent canon the game writes as you play.
- 🔄 **True replayability** — same fixed world, radically different emergent story each run. Meta-world evolves between runs.
- ☠️ **Death is not sterile** — your artifact is inherited, your Chronicle endures.
- 🏛️ **L'Aveugle** — every run starts in his auberge. He remembers you, sells lore for Souvenirs, explains your artefacts.

### Example session (Velkhar)

```
1. Create Kessa, a Lame-Ombre — write a backstory + pick a fear
2. The run opens at L'Aveugle's inn — he asks her name, she answers
3. The modal opens — Kessa picks her stats (triptyque) and confirms
4. The MJ (via OpenRouter) reacts — "Ah, a shadow in the sand. Let's see how long you last."
5. Kessa leaves the auberge — the run begins
6. Scene 30: A salt merchant Kessa helped earlier reappears at a different oasis. He recognizes her.
7. Her thirst is at 30% — the desert is killing her. She accepts a dangerous contract just to reach a well.
8. Death, a hard victory, or a secret ending. Export the Chronicle.
9. Run 2: Kessa's artifact (a faded dagger) is inherited. Souvenirs accumulate. L'Aveugle greets her by name.
```

---

## 2. Scope Discipline (read this before adding anything)

GRIMOIRE wins on **depth in one direction**, not breadth. Temptation = build wide (multi-univers, streamer tools, dozens of classes). That dilutes the only thing that matters: _a Game Master that remembers and doesn't cheat._

**Therefore:**

- **Velkhar only.** One desert world, deep, with 4 vocations that each see the world differently.
- **Memory & world-state come first**, before cosmetics like 3D dice.
- **Streamer/Twitch voting is cut.** A chat poll deciding A/B/C/D is anti-RP.
- **Multi-univers is cut.** No Valorain, no Apocalypse, no Sci-Fi. **GRIMOIRE = Velkhar.** The architecture stays clean for one world.

---

## 3. The Five Pillars of Design

Non-negotiable. Every design decision must serve at least one. **Détail complet : `docs/raw/01-PILLARS.md`.**

🌊 **Survie** · 🎲 **Choix & Dés** (d20 aux pivots seulement) · 📖 **Lentille Narrative** (vocation filtre tout) · 🔄 **Rejouabilité** (meta-monde vivant) · 🏺 **Héritage** (mort non stérile — artefact + écho)

> **North Star** : Completion ≥ 40% + 2nd run J+7 ≥ 25% (lancement). Mature : ≥ 60% / ≥ 45%.

---

## 4. The World of Velkhar — Fixed Canon

**Tone**: _Dark fantasy desert, measured._ A hard world of grey choices and real consequences — never grimdark for shock's sake. Hope exists, but it costs something.

**This section is the MJ's constitution.** The AI generates freely _on top_ of it but may never contradict it. Keep it small on purpose — a page, not a bible.

> **Source de vérité complète** : `docs/raw/02-WORLD-BIBLE.md`, `docs/raw/03-FACTIONS.md`, `docs/raw/03-BESTIARY.md`. Cette section en est le résumé d'implémentation.

### 4.1 The Laws of the World (GDD L3, L11)

- **Magic is unified.** The **Archontes** forged **artefacts** in a single cataclysm. Those artefacts are the only source of magical power. Each artefact is unique. **The Cendre** is the dispersed residue of that magic — a golden dust that covers the world. **The Calamine** is the universal cost of using magic: it corrupts the user, body and mind.
- **Only the Tisse-Verbe can awaken artefacts.** No one else can push an artefact past dormancy. This makes them rare, feared, and indispensable.
- **Death is permanent.** There is no resurrection. The dead stay dead.
- **The Cendre corrupts.** Concentrated Cendre (the **brume dorée**) is lethal. Long exposure corrupts flesh (Calcinés) and mind.
- **No gods answer.** Power is human — kings, warlords, guild masters, cult leaders. No deus ex machina.

### 4.2 The Central Cataclysm — The Archonte Overflow (GDD L1)

A single event defines the world. The **Archontes** — ancient, unnamed — forged artefacts whose magic **overflowed** their making. The overflow is the desert itself: a continent of golden ash, the **Cendre**, with occasional dunes of dangerous concentrated mist. This is the world's history — and its ongoing threat. The Cendre drifts, the Calamine rises with use, the Calcinés multiply in forgotten places.

### 4.3 The 4 Open Quests (GDD L6)

**No quest is canonical.** The player constructs _their_ truth by their acts. The MJ observes and reflects their choice:

| Quête              | What the player seeks                                   |
| ------------------ | ------------------------------------------------------- |
| 🔮 **Pouvoir**     | Maîtriser les artefacts, devenir plus fort que le monde |
| 💡 **Vérité**      | Comprendre le cataclysme, rassembler les fragments      |
| 🛡️ **Survie**      | Durer, fonder quelque chose, laisser une trace          |
| 💀 **Destruction** | Briser les artefacts, empêcher que ça recommence        |

The MJ never assigns a quest — it surfaces from the player's accumulated choices. The ending follows.

### 4.4 The Regions of the Makhzen

The Makhzen is the desert continent. Regions are documented in `docs/raw/02-WORLD-BIBLE.md`. The MVP launches with **Les Cendres de Velkhar** as the starting region; others unlock through story progression or are reserved for V2.

| Region                      | Status at launch     | Type                                     |
| --------------------------- | -------------------- | ---------------------------------------- |
| **Les Cendres de Velkhar**  | ● Current (starting) | Désert de cendre dorée, ruines Archontes |
| **La Route du Sel**         | Unlockable           | Caravanes, oasis, dangers du désert      |
| **Les Doigts**              | Unlockable           | Montagnes, sources de Cendre concentrée  |
| **Le Bassin des Souvenirs** | Unlockable (story)   | Lieu sacré, lié aux Souvenirs méta       |
| **Les Catacombes**          | Sealed (story)       | Donjons profonds, artefacts endormis     |
| Premium regions             | Premium              | V2+                                      |

> **MVP = Les Cendres de Velkhar only** (§2). Other regions are locked at launch — their existence creates horizon without scope bloat.

### 4.5 The 4 Major Factions (GDD L7)

| Faction                | Goal                                     | Plays as                      |
| ---------------------- | ---------------------------------------- | ----------------------------- |
| **Culte de la Cendre** | Embracer la Cendre comme transcendance   | Foi, fanatisme, transmutation |
| **Guilde du Sel**      | Contrôler les routes commerciales        | Commerce, survie, neutralité  |
| **Main d'Ombre**       | Contrats, secrets, équilibre par l'ombre | Espionnage, manipulation      |
| **Éveilleurs**         | Comprendre et cataloguer les artefacts   | Savoir, prudence, arrogance   |

Plus 5-6 minor factions mentioned in lore but not detailed at MVP. Full system in V2.

### 4.6 The Calcinés — Central Threat (GDD L4)

The **Calcinés** are the face of the threat. They were humans — or human-adjacent — who overused Cendre, or were exposed to concentrated brume dorée. Their flesh is gilded, their minds fractured. They are the central bestiary category, organized in 4 tiers of danger. The MJ must place them in forgotten ruins, in desert storms, near ancient artefacts. They are the world clock: where they multiply, the Cendre spreads. (Full bestiary in `docs/raw/03-BESTIARY.md` — 18 creatures, 4 tiers, per biome.)

### 4.7 L'Aveugle — The Sole Pillar NPC (GDD L8, #15, #23)

> **L'Aveugle** is the **sole pre-written Pillar NPC** of Velkhar. He is the **hub** of every roguelike run.

- **Role** : Aubergiste, gardien du seuil, maître des seuils. Il tient l'auberge située à la lisière des Cendres.
- **What he sells** : **lore only** — explanations of the world, the Archontes, the Calcinés, the artefacts. **Never equipment, never combat help.**
- **Currency** : **Souvenirs** (meta-currency). 1 Souvenir free per run + bonuses for performance. Only place Souvenirs are spent.
- **What he knows** : He explains the artefacts the player brings back. He knows things about the cataclysm that no one else does.
- **At each run opening** : He greets the player, asks their name, watches them create their character, reacts. If run ≥ 2, he remembers them, references previous exploits, and offers lore for Souvenirs.
- **Tutorial role** : The auberge is the **implicit tutorial**. No popup, no help screen. The Aveugle teaches through conversation.

**Everyone else is emergent** : invented by the MJ in play and made canon by the backend. There are no other Pillar NPCs — Aldric / Hollow King / Caelith / Brenna (Valorain-era Pillar NPCs) are **removed** from this design.

---

## 5. Hardcore RP Features 🎭

Design and rationale here; technical contracts in `TECH_STACK.md` → "Hardcore RP". Ordered by importance to a roleplayer.

### 5.1 Free Action ("Action Libre") — the heart of the game

A text input _above_ the suggested choices. The player types anything. The MJ parses the intent, the **backend** picks the relevant stat (SANG/SOUFFLE/CENDRE), rolls **only at pivot moments**, and the narrative continues. (Phase 2.)

### 5.2 Action vs Dialogue (the Discord-RP native language)

Auto-detection in a single input — no separate fields:

- **Dialogue** — text in quotes (`"Qui va là ?"`) → **no dice by default**. Colors the NPC's reaction. A check fires only when MJ identifies a real stake.
- **Action** — text in asterisks (`*je dégaine lentement*`) or plain text → MJ decides if a check is needed; backend resolves.
- **Plain, unmarked text** → treated as a narrated action (beginner-safe).
- **Mixed** → `"Recule !" *je lève mon épée*` → split, handled both sides.

UX teaches the convention invisibly (placeholder, hint, live chip). (Phase 2.)

### 5.3 IC / OOC — talk _in_ the story, or _to_ the MJ

A small **IC/OOC toggle** on the action field. `//` prefix forces OOC.

- **IC** → normal flow (segment, analyze, roll at pivot, advance).
- **OOC** → "talk to the MJ out of fiction" : recap, rules questions, retry, safety asks. No world-state mutation. (Phase 2.)

### 5.4 Slash commands ("/")

Roleplayers type `/` all day. Palette opens.

- **MVP** : `/roll`, `/recap`, `/inventaire`, `/statut`
- **V2B** : `/regarder`, `/repos`, `/sauvegarder`, `/partager`

Most are fast shortcuts to existing flows.

### 5.5 Character Backstory + Flaws/Qualities

At creation: a **"Traits & Past"** box + pick of **Flaws / Qualities** (e.g. _Haunted by a betrayal, Fear of the Cendre, Fallen salt-merchant_). Injected into MJ system prompt. **Backend** applies mechanical effects (a _Fear of the Cendre_ character takes −2 on checks inside brume dorée zones).

### 5.6 Persistent NPCs with memory & affinity — _do not defer_

Named NPCs (L'Aveugle + emergent ones) have fixed personality, memory of the player, and a **visible affinity gauge**. They reappear, react, ally or betray. NPC avatars = generated from initials + color at MVP; real portraits Phase 3.

### 5.7 World-state consequences

Choices change the world durably and visibly. A poisoned well, a saved or lost village, a faction turned against you, a rising Calamine clock. (Phase 2.)

### 5.8 Quiet moments & the mundane

Not every scene is a crisis. Roleplayers treasure low-stakes beats. Free input shines here. (Phase 2.)

### 5.9 Visible D20 — at pivots only, with dice journal

- **Visible roll** at pivot moments only. Nat 20 / nat 1 = memorable. Phase 2 : visible text resolution; Phase 3 : 3D die (cosmetic, after memory solid).
- **Dice journal** — every roll logged. (Phase 2.)
- **Inspiration token** — 1 free re-roll per scene. Turns failure into choice. (Phase 2B.)

### 5.10 The Chronicle (in-game + exportable)

Full narrative scrollable in-session. Button compiles it — markdown (Phase 2) or PDF (Phase 3, parchment-aged theme).

### 5.11 Emergent quest journal

MJ-detected objectives auto-logged into a journal.

### 5.12 Session seeds

Shareable **Seed** (e.g. `VELKHAR-42`) : same canon + starting character, divergent emergent stories. Per-seed leaderboard (Phase 3).

### 5.13 Narrative Titles — _achievements as story, not a Steam checklist_

No Steam-style completion list. **Narrative Titles** earned by _how you played_: _"The Salt Survivor"_, _"Hope of the Caravan"_, _"Tempted but Unbroken"_. Labels of your story, displayed in Chronicle.

### 5.14 Table safety — Lines & Veils

A `SafetySettings` object (avoided topics) injected into every system prompt with a hard instruction. Personalization, not censorship. (Phase 2B/3.)

### 5.15 The L'Aveugle Loop — opening scene, fixed

Every run opens in L'Aveugle's auberge. Always. The sequence (GDD #23) :

```
1. Auberge de L'Aveugle (image plein écran, ambiance désertique)
2. L'Aveugle demande le nom
3. Modal de création (4 vocations OU concept libre)
4. IA (via OpenRouter) réagit — première salutation personnalisée
5. Si run ≥ 2 : L'Aveugle vend infos lore contre Souvenirs
6. Joueur quitte → run commence
```

This is the **hub of the roguelike** — the only scene guaranteed identical run-over-run. L'Aveugle accumulates meta-knowledge between runs (Souvenirs spent, lore unlocked, artefacts explained).

### 5.16 RP Features — summary

| Feature                               | Player value                              | Phase                |
| ------------------------------------- | ----------------------------------------- | -------------------- |
| **L'Aveugle opening (fixed)**         | **Hub roguelike, recognized across runs** | **1A (frontend)**    |
| **Souvenirs meta-currency**           | **Progress that persists across deaths**  | **2**                |
| Free Action input (primary interface) | Total freedom (JdR salt)                  | 2                    |
| Action vs Dialogue (auto-detect)      | Discord-RP language                       | 2                    |
| IC / OOC toggle (`//`)                | Talk to the MJ                            | 2                    |
| Slash commands `/`                    | Discord muscle memory                     | 2 (core) / 2B        |
| Backstory + Flaws                     | Immersion, MJ memory                      | 2                    |
| Persistent NPCs + affinity            | Emotional investment                      | 2 → 2B               |
| World-state consequences              | Choices that last                         | 2                    |
| Quiet moments / pacing                | Real roleplay breathing room              | 2                    |
| Visible D20 roll (pivots only)        | Live drama                                | 2 (text) / 3 (3D)    |
| Dice journal                          | Re-read your nat 20s                      | 2                    |
| Inspiration token (1 re-roll/scene)   | Failure becomes a choice                  | 2B                   |
| In-game + exportable Chronicle        | Reread mid-run + viral sharing            | 2 (md) / 3 (PDF)     |
| Emergent quest journal                | Record of your story                      | 2B                   |
| Narrative Titles                      | Reward roleplay, shareable                | 2B                   |
| Session seeds + leaderboard           | Community challenges                      | 2 (seed) / 3 (board) |
| Table safety (Lines & Veils)          | Credibility + guardrail                   | 2B/3                 |

> **Cut on purpose** : Twitch voting / streamer mode (anti-RP). Multi-univers (anti-Velkhar).

---

## 6. Stats & Vocation (Velkhar)

### 6.1 The Triptyque — SANG · SOUFFLE · CENDRE

The only stats in Velkhar. Single source of truth, no D&D-style multi-stat block.

| Attribut       | Pilote                                               | Mod range |
| -------------- | ---------------------------------------------------- | --------- |
| 🩸 **SANG**    | combat, survie, force, intimidation                  | −3 à +4   |
| 💨 **SOUFFLE** | précision, furtivité, artisanat, éveil des artefacts | −3 à +4   |
| 🔥 **CENDRE**  | charisme, foi, commandement, résistance magique      | −3 à +4   |

**Derived** :

- **PV = 10 + SANG** (PV max, la vie du personnage)
- **Calamine** : 0-100, monte avec usage magique (coût universel)
- **Faim / Soif / Fatigue** : 0-100 (100 = plein, 0 = critique)

### 6.2 Character Creation — Stat Allocation

- **Base** : 0 dans chaque attribut
- **Pool** : 5 points à distribuer librement entre les 3 attributs
- **Mod final** : alloc + bonus racial (cf. peuples §6.5)
- **Cap** : mod final entre −3 et +4

> Le backend (`game-rules/stats.ts`) applique les bonus raciaux au moment de la création.

### 6.3 Vocations V1 (4) — les lentilles narratives

Chaque vocation voit le monde à travers un prisme unique. Le MJ adapte scènes, rencontres, dilemmes à la vocation.

| Vocation               | SANG | SOUFFLE | CENDRE | Angle                                                    | Faction liée  |
| ---------------------- | ---- | ------- | ------ | -------------------------------------------------------- | ------------- |
| 🐫 **Marcheur-du-Sel** | +2   | 0       | 0      | Commerce, survie, routes du désert                       | Guilde du Sel |
| 🗡️ **Lame-Ombre**      | 0    | +2      | 0      | Contrats, secrets, ombres                                | Main d'Ombre  |
| 🏛️ **Veilleur**        | 0    | +2      | 0      | Ruines Archontes, savoir, prudence                       | Éveilleurs    |
| 🔥 **Tisse-Verbe**     | −1   | +2      | +1     | Éveille les artefacts, risque Calamine maximum           | Rénovateurs   |
| ✍️ **Concept libre**   | —    | —       | —      | Le joueur écrit son concept ; le système dérive les mods | —             |

> ⚠️ **TODO post-sync** : le `CharacterCreate` actuel dans `packages/shared/src/types/character.types.ts` utilise encore les anciennes classes D&D (Guerrier/Mage/Paladin…) et peuples (Humain/Elfe/Nain…). À refondre aux 4 vocations V1 + concept libre — **hors scope de cette passe doc**.

### 6.4 Vocations V2 (3 supplémentaires — backlog)

- **Changepeau** — se fond dans les ruines Calcinées, +1 SOUFFLE / −1 CENDRE
- **Chasseur-de-Revenants** — traque les Calcinés, +1 SANG / +1 SOUFFLE
- **Contrebandier** — réseaux parallèles, +1 CENDRE / −1 SANG

### 6.5 Peuples de Velkhar (5)

| Peuple         | Glyph | Tag                     | Bonus racial           |
| -------------- | ----- | ----------------------- | ---------------------- |
| **Sahélin**    | 🐪    | Nomades du désert, durs | +1 SANG                |
| **Rivain**     | 🌊    | Cités-oasis, lettrés    | +1 CENDRE              |
| **Thérien**    | 🐺    | Chasseurs des dunes     | +1 SANG                |
| **Cendreur**   | ✨    | Marqués par la Cendre   | +1 SOUFFLE             |
| **Changepeau** | 🦎    | Métamorphes, marginaux  | +1 SOUFFLE / −1 CENDRE |

> ⚠️ **TODO post-sync** : refondre le type `people` dans `packages/shared/src/types/character.types.ts` (anciens : humain/elfe/nain/orsang/sangmaud/feerin).

### 6.6 Monnaies — Or (in-game) + Souvenirs (méta)

- 🪙 **L'or** — Achat/revente d'équipement dans le run. **Perdu à la mort.**
- 💎 **Les Souvenirs** — Méta-currency. **1 gratuit par run** + bonus selon performance (victoire, exploits, fin atteinte). **Dépensés uniquement chez L'Aveugle** contre du lore.

---

## 7. UI & Look

Frontend is **display-only** (logic lives backend-side — see `TECH_STACK.md`). This is the visual/UX spec; file paths and state shapes are in `TECH_STACK.md`.

### 7.1 Palette désertique (Velkhar)

Dark fantasy désertique — or brûlé, ocre, sable, cendre dorée. **Tokens complets + OKLCH + polices : [`docs/02-design/DESIGN_TOKENS.md`](DESIGN_TOKENS.md).** `globals.css` implémente les variables CSS ; atmosphere (`body::before/::after`) = radial gradient + SVG fractalNoise grain.

### 7.2 Pages principales

| #   | Page                     | Route                              | But                                                         |
| --- | ------------------------ | ---------------------------------- | ----------------------------------------------------------- |
| 1   | Landing                  | `/`                                | Pitch, ouverture sur Velkhar, CTA                           |
| 2   | Login                    | `/(auth)/login`                    | Email/password                                              |
| 3   | Signup                   | `/(auth)/signup`                   | Inscription                                                 |
| 4   | **Auberge de L'Aveugle** | `/(main)/velkhar/aveugle`          | **Hub roguelike** — opening scene fixe de chaque run        |
| 5   | Forge personnage         | `/(main)/velkhar/character-create` | 4 vocations OU concept libre + triptyque + peuples          |
| 6   | Campagne hub             | `/(main)/velkhar/campaign/[id]`    | Resume, chronicle in-game, factions, NPCs log, dice journal |
| 7   | Carte du Makhzen         | `/(main)/velkhar/world`            | Carte interactive des régions                               |
| 8   | Session de jeu           | `/(game)/velkhar/session/[id]`     | **Main screen** — narration + free action + IC/OOC          |
| 9   | Fin de run               | `/(game)/velkhar/session/end`      | Summary, export Chronique, partage seed                     |
| 10  | Leaderboard              | `/(main)/leaderboard`              | Global + per-seed                                           |
| 11  | Settings                 | `/(main)/velkhar/settings`         | Tone, lethality, sécurité (Lines & Veils)                   |

### 7.3 Page "Auberge de L'Aveugle" — main scene d'entrée

> C'est la **seule scène identique d'un run à l'autre**. Le hub du roguelike.

**Layout** (image plein écran, ambiance désertique) :

- Background : image plein écran de l'auberge, ambiance cendre dorée
- Au centre : L'Aveugle (buste, regard tourné vers le joueur) + bulle de dialogue
- En bas : zone d'interaction (champ texte IC/OOC pour converser)
- Si première visite du run : modal de création superposé
- Si run ≥ 2 : panneau latéral "Souvenirs" avec les options d'achat lore

**Composants** (`apps/frontend/src/components/aveugle/`) :

- `AubergeScene.tsx` — image + ambiance
- `AveugleDialogue.tsx` — bulle + salutation IA
- `VocationPicker.tsx` — 4 vocations OU concept libre
- `ConceptLibreInput.tsx` — textarea pour concept écrit
- `SouvenirsExchange.tsx` — interface d'achat lore
- `ArtefactExplanation.tsx` — explication des artefacts rapportés

**Interactions** :

- Conversation libre (IC/OOC, slash commands) → backend `/api/aveugle/dialogue`
- Achat lore contre Souvenirs → backend `/api/aveugle/buy`
- Quitter l'auberge → démarre le run → redirection vers `/session/[id]`

### 7.4 Session Layout — `Grimoire - Session.html`

Deux colonnes (`grid: 1fr 360px`), sticky topbar.

```
┌─────────────────────────────────────────────────────────────────────┐
│ TOPBAR (sticky)                                                      │
│ ❖ GRIMOIRE · VELKHAR │ ▸ Reprendre · 🗺 Le Makhzen · ❖ Campagne · ⚔│
│                        │ ⏱ 01:24 · Recommencer · ⚙ · [avatar]      │
├──────────────────────────────────────┬──────────────────────────────┤
│  TOME (centre — flex 1)              │  CODEX (droite — 360px)      │
│                                      │                               │
│  [Image de scène cinématique]        │  ┌─ Personnage ────────────┐  │
│  [hero-scrim + titre + chapitre]     │  │ Portrait · Vocation     │  │
│                                      │  │ PV ██████░ (10 + SANG)   │  │
│  ✦ Le Maître du Jeu                  │  │ Calamine ███░░ 35/100   │  │
│  [Narration EB Garamond 20px]        │  │ Soif ██░░░ 30/100       │  │
│  [Event pills: +XP · item · −PV]    │  └─────────────────────────┘  │
│                                      │  ┌─ Triptyque ────────────┐  │
│  [Thinking indicator]                │  │ SANG ████░ +2          │  │
│                                      │  │ SOUFFLE ███░░ +1       │  │
│  QUE FAIS-TU ?                       │  │ CENDRE ██░░░ +0        │  │
│  [Choice A]  [Choice B]              │  └─────────────────────────┘  │
│  [Choice C]  [Choice D]              │  ┌─ Inventaire ───────────┐  │
│                                      │  │ [⚔][🔑][…][…][ ]      │  │
│  ╔═ IC/OOC toggle ══════════════╗   │  └─────────────────────────┘  │
│  ║ [IC] [OOC]   Slash palette ║   │  ┌─ Souvenirs ────────────┐  │
│  ║ [Textarea — EB Garamond]    ║   │  │ 💎 5 · échanges L'Aveugle│  │
│  ║              [AGIR ▸]       ║   │  └─────────────────────────┘  │
│  ╚══════════════════════════════╝   │  ┌─ Réputation ────────────┐  │
│                                      │  │ Culte ████░ · Guilde...│  │
│  [Dice overlay — pivot seulement]   │  └─────────────────────────┘  │
└──────────────────────────────────────┴──────────────────────────────┘
```

### 7.5 Character Creation — Forge (4 vocations OU concept libre)

Stepper avec sticky top progress. Chaque step est un panel animé.

| Step | Label          | Key content                                               |
| ---- | -------------- | --------------------------------------------------------- |
| 1    | Identité       | Name, epithet, pronouns, pitch (≤ 300 chars)              |
| 2    | Vocation       | 4 vocations V1 OU concept libre                           |
| 3    | Peuple         | 5 peuples Velkhar + bonus racial                          |
| 4    | Triptyque      | 3 sliders SANG/SOUFFLE/CENDRE — base 0, pool 5, cap −3/+4 |
| 5    | Histoire & âme | Backstory, traits (max 3), bond, flaw                     |
| 6    | Voix & confort | Tone, dice preference, 5 safety cursors                   |
| 7    | Le Pacte       | Recap complet + confirm                                   |

### 7.6 Visual Tokens

**Source unique : [`docs/02-design/DESIGN_TOKENS.md`](DESIGN_TOKENS.md)** — palette OKLCH complète, polices (Cinzel/EB Garamond/Outfit), tokens CSS. Ne jamais dupliquer ici.

---

## 8. Narrative Standards

Design rules for what a good scene reads like. AI prompt template, scene JSON schema, validation → `TECH_STACK.md`.

### 8.1 Principles

1. **Rich but simple** — vivid imagery, plain language a 12-year-old understands.
2. **Senses** — sight, sound, smell (touch/taste when memorable).
3. **Brevity with impact** — 400-600 words. Setting (~150) → Situation (~200) → Choice setup (~100).
4. **Show, don't tell** — "Your hand trembles on the hilt," not "You feel scared."
5. **Honor the canon & the tone** — never contradict §4; keep dark-fantasy-measured register.

### 8.2 Engagement mechanics

- **Foreshadowing** — plant hints that pay off later.
- **Persistent NPCs that matter** — same NPC remembers you, allies or betrays.
- **Branching by stat** — SANG 2 brute-forces the door; SOUFFLE 2 picks the lock quietly.
- **Lasting consequences** — world-state returns scenes later.
- **The advancing threat** — reference Calamine's progress to sustain pressure.
- **The cliffhanger** — rarely end on calm.

### 8.3 Variety & pacing

Rotate scene types — exploration, social, quiet/mundane, challenge, combat, discovery — never 3 of the same in a row. Arc: build-up (1-5) → escalation (6-10) → climax (11-15) → resolution (16-20) → endgame (21+).

### 8.4 Endings — 5+ endings

5+ endings driven by accumulated choices and the Calamine's state:

- 🛡️ **Hold the line** — tu dresses la ligne contre les Calcinés
- 💀 **Fall to temptation** — le Culte te gagne
- ⚖️ **Sacrifice** — tu donnes ta vie pour sceller un artefact
- 🏃 **Flee** — tu quittes Velkhar, vivant mais marqué
- 🌅 **Redeem** — tu réveilles l'artefact juste, le monde respire
- 💎 **Hidden endings** — déclenchés par combinaisons rares (4 quêtes ouvertes)

La mort n'est pas un échec narratif — c'est un ending. La Chronique persiste.

### 8.5 The 4 Open Quests — non canoniques

Aucune quête n'est assignée par le MJ. Elles **émergent** des choix accumulés du joueur. La fin atteinte reflète la quête du joueur (Pouvoir/Vérité/Survie/Destruction). Le backend trace les actes qui penchent vers chaque quête.

---

## 9. Phases & Timeline

| Phase                          | Weeks         | Deliverable                                                                                                                                                |
| ------------------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0 — Sync docs GDD**          | ✅ 2026-06-28 | Documentation alignée Velkhar (passe sync + migration GDD dans `docs/raw/`)                                                                                |
| **1A — Frontend UI (Velkhar)** | 1-5           | Pages désertiques : landing, forge (4 vocations), **Auberge L'Aveugle**, campagne, Makhzen, session. Pas d'API encore.                                     |
| **1B — Backend Foundation**    | 4-6           | DB Velkhar + artefacts + Calamine, auth, **lore/velkhar/ canon**, **OpenRouter provider**, hub L'Aveugle                                                   |
| **2 — MVP Roguelike**          | 7-12          | Run 3-15h playable end-to-end + Free Action + IC/OOC + **d20 aux pivots** + **Souvenirs + L'Aveugle** + persistent NPCs + world-state + Chronicle markdown |
| **2B — Méta-monde & Héritage** | 13-18         | Méta-monde vivant entre runs, héritage artefact (3-4 transmissions), ancêtre cité, vocations V2, co-op V2                                                  |
| **3 — Polish**                 | 19+           | 3D D20, PDF parchemin, per-seed leaderboard, Lines & Veils, animations                                                                                     |

> The MVP timeline is deliberately longer than a typical hackathon: persistent memory, world-state, and free action are the product. Better to ship the thing that beats AI Dungeon than to ship fast and shallow.

---

## 10. Success Criteria

### MVP (end of Phase 2)

- ✅ Les Cendres de Velkhar fully playable; 4 vocations + concept libre
- ✅ **Every run opens at L'Aveugle** (image plein écran, dialogue IA, achat Souvenirs)
- ✅ **Free Action is the primary interface and works reliably**
- ✅ **NPCs persist and remember across a full run (tested 30+ scenes)**
- ✅ **World-state consequences are visible scenes later**
- ✅ Backstory/flaws measurably change the MJ's narration and the dice
- ✅ **d20 only at pivots** (not every action); backend decides; AI never decides outcomes
- ✅ The Calamine advances and is felt
- ✅ Souvenirs persist cross-run; L'Aveugle recognizes the player
- ✅ Session playable 50-70 min, 0 game-breaking bugs, seed + text export work

### The roleplayer test

A roleplayer plays 40 scenes and says: _"It remembered. It didn't cheat. L'Aveugle knew my name. My choices mattered."_ If they say that, we've beaten AI Dungeon. If they don't, nothing else we built matters.
