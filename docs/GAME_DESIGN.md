# Game Design — Grimoire

**Version**: 5.0 (The Reliable AI Game Master)
**Status**: Ready to Develop
**Scope of this doc**: The **WHAT** — vision, the world of Valorain (fixed canon), JdR rules, UI/look, narrative standards, RP features, phases. For the **HOW** (stack, lore/memory system, AI prompts, Ollama, endpoints, validation), see `TECH_STACK.md`. For current status, see `MEMORY.md`.

> **Single source of truth.** Anything about _what the game is, how its world works, how it looks and plays_ lives here. Anything about _how it's coded_ lives in `TECH_STACK.md`. Stats, the scene JSON schema, AI prompts, and the lore/memory engine are documented **once** — in `TECH_STACK.md` — and only referenced here.

---

## 1. The Pitch

> **Grimoire is the AI Game Master that finally works: it remembers, it doesn't cheat, and your choices change the world for good.**

That one sentence is the whole product. Everything below serves it.

### Why this, why now

The dream of an infinite AI roleplaying game already exists — and it's broken:

- **AI Dungeon** gives total freedom but no memory and no rules. The AI invents a king in scene 2 and forgets him by scene 5. Players leave frustrated.
- **Character.AI / SillyTavern** are great at _talking to a character_ but have no adventure, no stakes, no consequences.
- **Roadwarden / hand-written narrative games** are beautiful but finite, written by hand, with no real replayability.

Grimoire takes the **freedom of AI Dungeon** and adds **a real Game Master that doesn't cheat**: the backend owns the rules, the memory, and the world-state; the AI only writes the prose. That division is the entire moat. It's the AI roleplaying game that roleplayers have been waiting for since 2019.

### The three promises

1. **It remembers.** The MJ knows the bandit you spared in scene 3, and brings him back in scene 40 — because the backend recorded him as canon, not because the AI happened to recall it.
2. **It doesn't cheat.** Dice rolls, stat checks, success and failure are resolved by the backend. The AI never decides whether you win — it only narrates what the result feels like.
3. **The world changes for good.** Poison the well and the village is still dying twenty scenes later. Consequences are stored as world-state, not improvised.

### Core experience

- 🎭 **Be the author of your actions** — type _anything_; the MJ figures out the stat, rolls, and continues (§5). Buttons are training wheels, not a cage.
- 🧠 **A world with a memory** — persistent NPCs, kept promises, lasting consequences (§4, §6).
- 🎲 **Tabletop stakes** — visible dice, real failure, a creeping threat that advances while you hesitate.
- 📖 **Living lore** — a small fixed canon you can trust, plus an emergent canon the game writes as you play (§4).
- 🔄 **True replayability** — same fixed world, radically different emergent story each run.

### Example session (Valorain)

```
1. Create Vael, a Thief — write a backstory + pick a flaw ("Haunted by a betrayal")
2. The MJ opens on the corruption-scarred road to Greymoor
3. You type: "I lie about my name and watch the innkeeper's eyes for a tell."
4. A D20 rolls for a Charisma check — you needed 12, you rolled 11. Drama.
5. The innkeeper, Tormund, half-believes you — the backend saves him as canon
6. Scene 30: Tormund reappears. He remembers your lie. The relationship has weight.
7. The Shadow Circle has taken another village while you delayed — the world moved.
8. Death, a hard victory, or a secret ending. Export your chronicle, share your seed.
```

---

## 2. Scope Discipline (read this before adding anything)

Grimoire wins on **depth in one direction**, not breadth. The temptation is to build wide (many universes, streamer tools, dozens of classes). That dilutes the only thing that matters: _a Game Master that remembers and doesn't cheat._

**Therefore:**

- **The MVP is Valorain only.** One world, deep, that roleplayers know by heart — beats three shallow ones.
- **Memory & world-state come first**, before cosmetics like 3D dice. The memory is what beats AI Dungeon; the dice are a flourish.
- **Streamer/Twitch voting is cut.** A chat poll deciding A/B/C/D is the _opposite_ of roleplay incarnation — it's anti-RP. We keep what makes the game _naturally_ streamable (beautiful chronicle export, visible dice drama, shareable seeds) but build no Twitch machinery.
- **Apocalypse & Sci-Fi are deferred and de-emphasized.** The architecture stays multi-universe-ready, but we don't let two unbuilt worlds pull focus from Valorain's depth.

---

## 3. Pillars of Play

### 3.1 Free Action first, buttons as suggestions

The **free-text input is the primary interface** — the cursor blinks, that's where the eye goes. The **4 choices are the MJ's suggestions**, exactly like a tabletop GM saying _"You could negotiate, attack, flee… or something else entirely?"_ A beginner clicks a suggestion; a roleplayer types their own scheme. Nobody is excluded, and the design quietly tells the player: _the buttons are kindly training wheels, not prison bars._

### 3.2 The backend is the Game Master; the AI is its voice

The backend owns stats, dice, inventory, consequences, NPCs, and world-state. The AI receives a fresh, complete dossier every turn and writes only the narrative. The AI is never asked to _remember_ or to _decide outcomes_ — that is what makes the MJ reliable (technical detail in `TECH_STACK.md`).

### 3.3 Living lore in two layers

The world is real because it has a fixed spine **and** grows as you play:

- **Fixed Canon** (§4) — a small, inviolable constitution of Valorain the MJ may never contradict.
- **Emergent Canon** — anything the MJ creates (an NPC, a promise, a ruined village) is immediately recorded by the backend and becomes permanent for the rest of that run. The lore _builds itself while you play_ and stays coherent (engine in `TECH_STACK.md`).

### 3.4 Real stakes, your way

Dice can fail. The threat advances. But the player sets the dial: tone (grim / heroic / wry) and **lethality** (a roleplayer sometimes wants real danger, sometimes safe narration). Stat checks are **negotiable** — the player can justify a different approach (_"I'll use Charisma instead of Strength"_) and the MJ honors it, like a good GM at the table.

---

## 4. The World of Valorain — Fixed Canon

**Tone**: _Dark fantasy, measured._ A hard world of grey choices and real consequences — never grimdark for shock's sake. Think The Witcher / Roadwarden. Hope exists, but it costs something.

**This section is the MJ's constitution.** The AI generates freely _on top_ of it but may never contradict it. Keep it small on purpose — a page, not a bible.

### 4.1 The Laws of the World

- **Magic** is real but **rare, costly, and distrusted.** It draws on the Aether; overuse marks the caster (physically or mentally). Common folk fear mages. There are no casual fireballs at the tavern.
- **Death** is permanent and means something. There is no convenient resurrection; the dead stay dead, and grief drives many quests.
- **The Aether** is the source of both magic and the Corruption. It is not good or evil — it amplifies what touches it.
- **Power is human.** Kings, guild masters, and warlords rule; the gods (if they exist) are silent. No deus ex machina saves you.

### 4.2 The Central Conflict — The Rising Corruption

A blight called the **Corruption** seeps out of **Shadowveil**, twisting land, beasts, and people into **Voidborn**. It does not march like an army — it _creeps_, village by village, while the living argue. The **Order of Honor** holds the line and is slowly losing. This is the world's clock: **it advances while the player hesitates.** Delay has a cost; the map gets worse. That ticking threat is the spine that gives every choice weight.

### 4.3 The Five Regions

- **Valorheim** — northern stone holds, warriors, the Order's heartland (relatively safe, grim, dutiful).
- **Shadowveil** — corrupted lands, undead, the source of the blight (deadly).
- **Sanctum** — mage towers and enchanted forests, keepers of dangerous knowledge (secretive).
- **Verdantis** — dense wild jungle, primitive creatures, beyond most laws (lawless).
- **Skybound** — floating islands and celestial mystery (remote, strange).

### 4.4 The Four Factions

| Faction            | Alignment | Goal                                 | Plays as                   |
| ------------------ | --------- | ------------------------------------ | -------------------------- |
| **Order of Honor** | Good      | Hold the line against the Corruption | Duty, sacrifice, rigidity  |
| **Shadow Circle**  | Evil      | Embrace the Corruption as power      | Temptation, ambition, ruin |
| **Wild Kin**       | Neutral   | Freedom and nature above all         | Independence, survival     |
| **Mage Council**   | Neutral   | Knowledge at any cost                | Curiosity, secrets, hubris |

### 4.5 Original Creatures

Valorrim (Nordic humanoids) · Aether-touched (those marked by magic) · **Voidborn** (the corrupted — the face of the threat) · Feylins (forest folk) · Drakonir (scaled humanoids).

### 4.6 The Pillar NPCs (pre-written, the world's backbone)

These four exist in every run. The MJ weaves them in and the backend keeps them consistent. They give Valorain a spine before the emergent canon fills in the rest.

- **Ser Aldric Voss** — _the Mentor._ Aging knight of the Order of Honor. Believes in the line even as it breaks. Honest, weary, fatherly. Likely the player's first real ally.
- **The Hollow King** — _the Antagonist._ Once a great ruler of Valorheim, now half-consumed by the Corruption he sought to control. Not a cartoon villain — a warning of what ambition costs. The shadow over the whole run.
- **Mistress Caelith** — _the Tempter._ A Shadow Circle agent who offers power without lies about its price. Charismatic, patient, never cruel for its own sake. The seductive grey path.
- **Old Brenna** — _the Keeper._ A Mage Council outcast who hides in the wilds, knows the world's true history, and trades knowledge for favors. The source of lore and uncomfortable truths.

> Everyone else — Tormund the innkeeper, the bandit you spared — is **emergent**: invented by the MJ in play and made canon by the backend.

---

## 5. Hardcore RP Features 🎭

Design and rationale here; technical contracts in `TECH_STACK.md` → "Hardcore RP — Technical Specs". Ordered by importance to a roleplayer.

### 5.1 Free Action ("Action Libre") — the heart of the game

A text input _above_ the suggested choices. The player types anything — _"I pretend to faint so the guard approaches, then steal his keys with my foot."_ The MJ parses the intent, the **backend** picks the relevant stat, rolls the check, and the narrative continues from success or failure. This is the salt of tabletop JdR and Discord RP, and it is **MVP-core**, not a bonus. (Phase 2.)

### 5.2 Action vs Dialogue (the Discord-RP native language)

The heart of Discord roleplay is the distinction between **action** and **in-character dialogue**. Grimoire speaks it natively, with **auto-detection** in a single input — no separate fields, no friction:

- **Dialogue** — text in quotes (`"Qui va là ?"`) → **no dice by default**. It colors the NPC's reaction through affinity. A check (Persuasion / Lie / Barter) fires _only_ when the MJ identifies a real stake. Most speech is just speech — that restraint is what real RP feels like.
- **Action** — text in asterisks (`*je dégaine lentement*`) or plain text → the MJ decides if a check is needed; the **backend** resolves it.
- **Plain, unmarked text** → treated as a narrated action, so a beginner is never blocked.
- **Mixed** — `"Recule !" *je lève mon épée*` → split and handled on both sides (social + a check).

**The UX teaches the convention invisibly** (no tutorial popup), in three light layers:

1. **Pedagogical placeholder** (seen on arrival): a concrete in-world example that shows the syntax _and_ the dark-fantasy tone, e.g. `"Qui va là ?" *je dégaine lentement*…` — the player imitates it instinctively.
2. **Persistent hint under the field** (tiny, grey, stays while typing): `"…" parle · *…* agis · texte libre = action`.
3. **Live detection chip** while typing (`💬 Dialogue` · `⚔ Action` · `💬+⚔ Mixte`) — reassures the player the MJ understood _before_ they submit, reinforcing the convention by repetition.

The hardcore roleplayer marks up out of habit; the beginner writes in plain words and it still works. (Phase 2.)

### 5.3 IC / OOC — talk _in_ the story, or _to_ the MJ

The most sacred line in Discord RP: **In-Character vs Out-Of-Character**. A small **IC/OOC toggle** sits on the action field, and a message starting with `//` forces OOC (the convention every roleplayer knows):

- **IC** → your text is action/dialogue in the story (the normal flow).
- **OOC** → you talk _to the MJ out of fiction_: _"résume-moi la situation", "je peux retenter ce jet ?", "on évite ce thème"_. The MJ answers **without advancing the story or rolling** — the way you'd lean over and ask a human GM a question mid-game.

This is what turns Grimoire from "a game" into _a conversation with a Game Master_. A human GM understands the meta; an AI doesn't — unless you give it an explicit OOC channel. (Phase 2 — MVP-core, cheap, high value.)

### 5.4 Slash commands ("/") — Discord muscle memory

Roleplayers type `/` all day on Discord. Typing `/` opens a command palette. **MVP set**: `/roll 2d6+3`, `/recap` (an OOC summary), `/inventaire`. **Extended (2B)**: `/regarder`, `/repos`, `/sauvegarder`, etc. Most of these are just fast shortcuts to things the MJ already does in plain language — a comfort layer on top of OOC, not a separate system. (Phase 2 core / 2B extended.)

### 5.5 Character Backstory + Flaws/Qualities

At creation, beyond class and stats: a **"Traits & Past"** box (≤ 300 chars) and a pick of **Flaws / Qualities** (e.g. _Haunted by a betrayal, Fear of the Corruption, Fallen noble_). These are injected into the MJ's system prompt and the **backend** applies their mechanical effects (a _Fear of the Corruption_ character takes −2 on checks inside Shadowveil). Roleplayers spend hours on backstories; honoring the past is what hooks them. **MVP-core.** (Phase 2.)

### 5.6 Persistent NPCs with memory & affinity — _do not defer this_

Named NPCs (the four Pillars + emergent ones) have a fixed personality, a memory of the player, and a **visible affinity gauge** (trust/hostility). They reappear, react to your history, and can ally or betray. A roleplayer falls in love with NPCs — this is near the core of the experience, **not a Phase 2B luxury.** Basic persistent NPCs ship in the MVP; deeper relationship arcs deepen in 2B. NPC avatars are generated from initials + color at MVP; real portraits are Phase 3. (Phase 2 → 2B.)

### 5.7 World-state consequences

Choices change the world durably and visibly, stored as world-state the MJ must respect: a poisoned well, a saved or lost village, a faction turned against you, the Corruption's advancing frontier. (Phase 2.)

### 5.8 Quiet moments & the mundane

Not every scene is a crisis. Roleplayers treasure low-stakes beats — chatting in a tavern, examining an heirloom, writing a letter. The game lets scenes breathe; the free input shines here. The MJ is instructed to vary pacing and allow stillness. (Phase 2.)

### 5.9 Visible D20 roll, dice journal, free rolls & Inspiration

- **Visible roll (crit success/failure)** — on a stat check, a D20 rolls visibly: `die + stat modifier vs difficulty`, with **critical success (nat 20)** and **critical failure (nat 1)** — the salt of tabletop drama. The result is passed to the MJ so it narrates a coherent triumph / failure / critical. **Phase 2**: visible text resolution; **Phase 3**: 3D animated die (cosmetic, after memory is solid).
- **Dice journal** — every roll of the session is logged so the player can re-read their nat 20s. Rôlistes adore this. (Phase 2, trivial.)
- **Free dice box** — a `2d6+3` field + quick `d4 d6 d8 d20 d100` buttons for off-system rolls (home-brew damage, personal rolls). Cosmetic/optional; never feeds the authoritative engine. (Phase 2B.)
- **Inspiration token** — **1 free re-roll per scene**, granted at scene start. Turns failure into a _choice_ ("re-roll or accept fate?") without removing stakes — very D&D 5e / BG3. (Phase 2B.)

### 5.10 The Chronicle (in-game + exportable) — "Le Grimoire du Voyageur"

The full narrative is **scrollable during the run** (not just at the end) — a living record the player can reread mid-session. A button compiles it — narrative, choices, items, key world-facts — into a beautiful themed document (aged parchment for Valorain) as a **Discord-formatted post** (Phase 2) or **PDF** (Phase 3). Players post their unique stories — free, viral word-of-mouth.

### 5.11 Emergent quest journal

The MJ-detected objectives ("find Brenna," "stop the well's poison") are auto-logged into a journal the player can reread — a record of their unique, emergent story. (Phase 2B.)

### 5.12 Session seeds ("Destin Croisé")

Each run yields a shareable **Seed** (e.g. `GREYMOOR-42`): same fixed canon and starting character, divergent emergent stories. A **per-seed leaderboard** ranks how far players got. Solo play becomes communal and competitive. The seed value is generated/shown from Phase 2; the leaderboard ships Phase 3.

### 5.13 Narrative Titles — _achievements as story, not a Steam checklist_

Roleplayers don't play to tick boxes — they play for the story and their character. So **no Steam-style completion list** ("kill 50 goblins", "reach level 10"): that signals "this is a game to optimize" and attracts the optimizer, not the roleplayer, diluting Grimoire's identity. Instead, **Narrative Titles** earned by _how you played_: _"The Oathbreaker"_ (you betrayed a key ally), _"Hope of Greymoor"_ (you saved the doomed village), _"Tempted but Unbroken"_ (you refused Caelith's bargain). They're **labels of your story**, displayed in your Chronicle and shareable — they reward roleplay, not grind. (Phase 2B.)

> **On retention / how a player stops:** the goal isn't to prevent stopping — it's to make every stop a _good_ stop that calls a return. The real levers (all already designed): **endings** (§8.4 — "there were 5 more endings, I'll replay"), the **shareable Chronicle** (§5.10 — viral pride), **seeds** (§5.12 — "beat my run"), the **advancing Corruption** (§4.2 — urgency), the **cliffhanger** (§8.2 — "one more turn"), and **Narrative Titles** above. Together these turn an arrest into a relaunch — and bring friends.

### 5.14 Narrative travel map — _deferred (Phase 2B/3)_

**Not a tactical radar** (an XY grid fights the free fiction and would lie ~80% of the time). Instead, a **chain of visited places** in order — `Pont de Greymoor → Sanctuaire en ruine → Hameau flétri → ( ? )` — drawn from the Emergent Canon (§3.3). It gives a sense of journey and progression without faking geography. **Linear at first** (honest, simple); branching is intentionally avoided (the MJ never truly "planned" the paths not taken). _Deferred: it's valuable but not what beats AI Dungeon — memory and free action are. (Phase 2B/3.)_

### 5.15 Table safety — Lines & Veils — _deferred (Phase 2B/3)_

Serious RP tables use safety tools. Because the MJ is an AI that _can generate anything_ (unlike a human GM with judgment), this is doubly necessary — both a credibility signal to the audience and a product guardrail against an unwanted generation going viral the wrong way. At session start (or in Settings), the player names topics to **avoid** (Lines) or keep **off-screen** (Veils); these are injected into the system prompt. It's **personalization, not censorship** — the world stays dark, grey, and lethal; only _this player's_ unwanted topics are removed. A discreet, dismissable option. _Deferred to keep the MVP focused. (Phase 2B/3.)_

### 5.16 RP Features — summary

| Feature                               | Player value                                | Phase                |
| ------------------------------------- | ------------------------------------------- | -------------------- |
| Free Action input (primary interface) | Total freedom (JdR salt)                    | 2                    |
| **Action vs Dialogue (auto-detect)**  | **Speaks the Discord-RP language**          | **2**                |
| **IC / OOC toggle (`//`)**            | **Talk to the MJ without breaking fiction** | **2**                |
| Slash commands `/`                    | Discord muscle memory                       | 2 (core) / 2B        |
| Backstory + Flaws/Qualities           | Immersion, MJ memory                        | 2                    |
| Persistent NPCs + affinity            | Emotional investment                        | 2 → 2B               |
| World-state consequences              | Choices that last                           | 2                    |
| Quiet moments / pacing                | Real roleplay breathing room                | 2                    |
| Visible D20 roll (crit success/fail)  | Live drama                                  | 2 (text) / 3 (3D)    |
| Dice journal                          | Re-read your nat 20s                        | 2                    |
| Free dice box                         | Off-system rolls                            | 2B                   |
| Inspiration token (1 re-roll/scene)   | Failure becomes a choice                    | 2B                   |
| In-game + exportable Chronicle        | Reread mid-run + viral sharing              | 2 (md) / 3 (PDF)     |
| Emergent quest journal                | Record of your story                        | 2B                   |
| Narrative Titles (story, not grind)   | Reward roleplay, shareable                  | 2B                   |
| Session seeds + leaderboard           | Community challenges                        | 2 (seed) / 3 (board) |
| Narrative travel map                  | Sense of journey (honest, no XY)            | 2B/3                 |
| Table safety (Lines & Veils)          | Credibility + guardrail                     | 2B/3                 |

> **Cut on purpose:** Twitch voting / streamer mode (anti-RP; see §2).

---

## 6. Stats & Classes

### 6.1 Universal Stats System

All classes use the same 7 stats; only labels change per universe for flavor. Canonical type + stat-check rules live in `TECH_STACK.md` (single source of truth).

| Stat             | Fantasy (Valorain) | Apocalypse     | Sci-Fi              |
| ---------------- | ------------------ | -------------- | ------------------- |
| **HP**           | Hit points         | Health         | Body integrity      |
| **Mana**         | Magical energy     | Stamina        | Shield energy       |
| **Strength**     | Physical strength  | Raw strength   | Gravitational force |
| **Agility**      | Combat agility     | Speed, dodge   | Piloting reflexes   |
| **Intelligence** | Magic knowledge    | Engineering    | Hacking, tech       |
| **Charisma**     | Persuasion         | Leadership     | Alien diplomacy     |
| **Luck**         | Loot chance        | Scavenge bonus | Rare encounters     |

### 6.2 Valorain — the 5 MVP classes

| Class       | Bonus                        | Playstyle                                | Starting Skills           | Unique                      |
| ----------- | ---------------------------- | ---------------------------------------- | ------------------------- | --------------------------- |
| **Warrior** | +3 Str, +15 Max HP, −1 Int   | Melee, tanking                           | Power Strike, War Cry     | Breaks doors, intimidates   |
| **Mage**    | +3 Int, +20 Max Mana, −1 Str | Spells, puzzles (magic is feared — §4.1) | Fireball, Arcane Shield   | Deciphers runes, levitation |
| **Thief**   | +3 Agi, +2 Luck, −5 Max HP   | Stealth, theft, dodge                    | Sneak Attack, Lockpicking | Detects traps, pickpockets  |
| **Healer**  | +2 Int, +2 Cha, +15 Max Mana | Support, healing                         | Minor Heal, Purification  | Cures disease, calms NPCs   |
| **Ranger**  | +2 Agi, +1 Str, +1 Luck      | Archery, survival                        | Precise Shot, Tracking    | Tames creatures, survival   |

> Apocalypse (Terre Desolee, 4 classes) and Sci-Fi (Nova Galaxia, 5 classes) are designed but **deferred** (§2). Their full rosters live in version control history / will be re-documented when 2B begins; they are intentionally not detailed here to keep focus on Valorain.

---

## 7. UI & Look

Frontend is **display-only** (logic lives backend-side — see `TECH_STACK.md`). This is the visual/UX spec; file paths and state shapes are in `TECH_STACK.md`.

### 7.1 Pages

| #   | Page             | Route                         | Purpose                                                 |
| --- | ---------------- | ----------------------------- | ------------------------------------------------------- |
| 1   | Landing          | `/`                           | Pitch (§1), feature cards, CTA                          |
| 2   | Login            | `/(auth)/login`               | Email/password                                          |
| 3   | Signup           | `/(auth)/signup`              | Registration                                            |
| 4   | Dashboard        | `/(main)/dashboard`           | New game, ongoing games, stats                          |
| 5   | Universe Select  | `/(main)/universe-select`     | Valorain active; others 🔒 ("later")                    |
| 6   | Character Create | `/(main)/character-create`    | Name, class, stats, **backstory & flaws** (§5.5)        |
| 7   | Game Session     | `/(game)/session/[sessionId]` | **Main screen** (§7.2)                                  |
| 8   | Game Over        | `/(game)/session/end`         | Summary, export chronicle, share seed                   |
| 9   | Leaderboard      | `/(main)/leaderboard`         | Global + per-seed                                       |
| 10  | Settings         | `/(main)/settings`            | Sound, **tone**, **lethality**, narrative length, theme |

### 7.2 Game Session Layout

```
┌────────────────────────────────────────────────────────┐
│ [Menu] Vael | HP 85/100 | Mana 40/100 | Lvl 5          │
├────────────────────────────────────────────────────────┤
│  SCENE (70%)                          │ SIDEBARS (30%)  │
│  ┌──────────────────────────────┐     │ STATS           │
│  │ SCENE 7: The Wilting Hamlet  │     │ HP ████░ 85     │
│  │ [400–600 word MJ narrative,  │     │ Mana ██░░ 40    │
│  │  dark-fantasy, measured]     │     │ Lvl 5  XP ██    │
│  │ [EVENT LOG — last 3-4]       │     │ STR 15 AGI 15   │
│  └──────────────────────────────┘     │ INT 11 CHA 8    │
│                                        │                 │
│  ┌──────────────────────────────┐     │ NPCS (affinity) │
│  │ TON ACTION — LIBRE           │ ←   │ Tormund  ▓▓░ +2 │
│  │ "Qui va là ?" *je dégaine…*  │     │ Aldric   ▓▓▓ +5 │
│  │  💬+⚔ Mixte          [AGIR]  │     │                 │
│  └──────────────────────────────┘     │ INVENTORY (6/10)│
│  "…" parle · *…* agis · libre=action  │ Sword +2 Str    │
│  — or pick a suggestion —             │ Golden Key      │
│  ⊳ Reason with the elder (Cha 12)     │ REPUTATION      │
│  ⊳ Force the door (Str 15) ✓✓✓        │ Order +25       │
│  ⊳ Slip away into the dark (Agi 10)   │ Corruption ▲    │
└────────────────────────────────────────────────────────┘
```

The **free input sits above the suggestions** (§3.1) and carries the arcane-violet accent (the MJ's voice). Note the **pedagogical placeholder**, the **persistent hint** beneath it, and the **live detection chip** (`💬 / ⚔ / 💬+⚔`) — see §5.2. A discreet **Corruption ▲** indicator shows the world's clock ticking (§4.2). On a stat check, the D20 resolves visibly (§5.9).

### 7.3 Visual Direction — "Arcane Grimoire by Candlelight" (UI canon)

This is the locked visual identity (validated via the hi-fi mockup). Grimoire must feel like **a game client, not a website** — a dark, warm, premium old tome with modern legibility.

**Palette**:

- **Ink** — very dark warm ink background (`#0F0C08` family), parchment/bone text (`#FAF9F5`).
- **Ember/Gold** — primary accent (`#D97757` ember) for actions, the player's agency, loot highlights.
- **Arcane Violet** — the MJ's voice & magic: the free-action block border, the "echo" of the player's action, spell/Aether moments.
- **Rarity**: Common White · Uncommon Green · Rare Blue · Epic Purple · Legendary Orange.

**Typography**:

- **Cinzel** — ornamental titles, chapter headers, logo.
- **EB Garamond** — the MJ's narrative prose (immersive, book-like — _not_ a UI font).
- **Outfit** (or similar clean sans) — UI chrome, stats, buttons, labels.

**Texture & mood**: subtle paper grain, candle-lit warmth, muted and cold elsewhere to sell the dark-fantasy-measured tone. Respect `prefers-reduced-motion` (entry animations gated; base state always visible). Chronicle export themed as aged parchment.

> The hi-fi mockup (`Grimoire — Session`) is the reference for this direction; the frontend should match it, not re-invent it.

---

## 8. Narrative Standards

Design rules for what a good scene reads like. The AI **prompt template, scene JSON schema, and validation** are technical → `TECH_STACK.md`.

### 8.1 Principles

1. **Rich but simple** — vivid imagery, plain language a 12-year-old understands.
2. **Senses** — sight, sound, smell (touch/taste when memorable).
3. **Brevity with impact** — 400–600 words. Setting (~150) → Situation (~200) → Choice setup (~100).
4. **Show, don't tell** — "Your hand trembles on the hilt," not "You feel scared."
5. **Honor the canon & the tone** — never contradict §4; keep the dark-fantasy-measured register.

### 8.2 Engagement mechanics

- **Foreshadowing** — plant hints that pay off later.
- **Persistent NPCs that matter** — the same NPC remembers you, allies or betrays (§5.3).
- **Branching by stat** — Str 15 moves the boulder; Str 8 strains.
- **Lasting consequences** — world-state returns scenes later (§5.7).
- **Secrets** — observant players find unlisted options.
- **The advancing threat** — reference the Corruption's progress to sustain pressure (§4.2).
- **The cliffhanger** — rarely end a scene on calm. The MJ is instructed to close most scenes on an open tension (a door creaking open, a name whispered, a choice looming) so the player wants "one more turn" — and when they _do_ stop, they stop on an open question that pulls them back. This is the single cheapest retention lever (a system-prompt rule, see `TECH_STACK.md`).

### 8.3 Variety & pacing

Rotate scene types — exploration, social, **quiet/mundane (§5.5)**, challenge, combat, discovery — never 3 of the same in a row. Arc: build-up (1–5) → escalation (6–10) → climax (11–15) → resolution (16–20) → endgame (21+).

### 8.4 Endings

5+ endings driven by accumulated choices and the Corruption's state: hold the line, fall to temptation, sacrifice, flee, redeem — plus rare hidden endings. Players learn there were more and replay to find them.

---

## 9. Phases & Timeline

| Phase                          | Weeks | Deliverable                                                                                                                                                                                                                         |
| ------------------------------ | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1A — Frontend UI**           | 1–5   | All Valorain pages static, dark-fantasy UI, no API                                                                                                                                                                                  |
| **1B — Backend Foundation**    | 4–6   | DB schema, auth, game-engine skeleton, **lore/memory tables**, Ollama AI test                                                                                                                                                       |
| **2 — MVP: the reliable MJ**   | 7–12  | Valorain playable end-to-end + **Free Action** + **action/dialogue** + **IC/OOC** + core **slash commands** + **Flaws** + **persistent NPCs** + **world-state** + visible dice + dice journal + seed value + in-game/text chronicle |
| **2B — Depth & Replayability** | 13–18 | NPC relationship arcs, world events, build diversity, achievements, quest journal, _then_ Apocalypse & Sci-Fi                                                                                                                       |
| **3 — Community & Polish**     | 19+   | 3D D20, PDF export, per-seed leaderboard, custom universe creator, cosmetics, NG+                                                                                                                                                   |

> The MVP timeline is deliberately longer than the old 10 weeks: persistent memory, world-state, and free action are the product, and they take the time they take. Better to ship the thing that beats AI Dungeon than to ship fast and shallow.

---

## 10. Success Criteria

### MVP (end of Phase 2)

- ✅ Valorain fully playable; 5 classes work
- ✅ **Free Action is the primary interface and works reliably**
- ✅ **NPCs persist and remember across a full run (tested 30+ scenes)**
- ✅ **World-state consequences are visible scenes later**
- ✅ Backstory/flaws measurably change the MJ's narration and the dice
- ✅ Dice/checks resolved by backend; AI never decides outcomes
- ✅ The Corruption advances and is felt
- ✅ Session playable 50–70 min, 0 game-breaking bugs, seed + text export work

### The roleplayer test (the only metric that matters)

A roleplayer plays 40 scenes and says: _"It remembered. It didn't cheat. My choices mattered."_ If they say that, we've beaten AI Dungeon. If they don't, nothing else we built matters.

---

## 11. Competitive Position & Key Decisions

**Position**: _the freedom of AI Dungeon with a Game Master that remembers and doesn't cheat._ The backend-authoritative architecture (rules + memory + world-state on the server, prose from the AI) is the moat — it's intrinsically the answer to AI Dungeon's incoherence and Character.AI's lack of stakes.

**Decisions:**

- ✅ Recenter the whole pitch on _reliable MJ + memory + consequences_ (multiverse is a bonus, not the title)
- ✅ MVP = Valorain only, deep; Apocalypse/Sci-Fi deferred (§2)
- ✅ Free Action is the primary interface; buttons are suggestions (§3.1)
- ✅ Persistent NPCs & world-state are MVP-core, not 2B luxuries (§5.6, §5.7)
- ✅ Living lore in two layers: small Fixed Canon + Emergent Canon stored by the backend (§3.3, §4)
- ✅ Dark-fantasy-measured tone; central conflict = the Rising Corruption as a ticking clock (§4.2)
- ✅ Player-set tone & lethality; negotiable stat checks (§3.4)
- ✅ Twitch/streamer voting **cut**; keep naturally-streamable export, dice drama, seeds (§2)
- ✅ Free, local-first AI in dev via Ollama, behind the provider abstraction (see `TECH_STACK.md`)
- ✅ Memory/world-state prioritized over cosmetic 3D dice
