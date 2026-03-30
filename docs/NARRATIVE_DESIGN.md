# Narrative Design - Scene Writing Standards (Multi-Universe)

**Purpose**: Define how scenes should be written by the AI to be rich, engaging, AND easy to read.
**Architecture**: Standards adapted to the 3 universes (Fantasy, Apocalypse, Sci-Fi)

---

## Core Principles

### 1. **Rich Narrative + Simple Language**
```
❌ BAD (too complex):
"The ethereal emanations of chromatic refraction precipitated
an ambrosial confluence of synaptic perturbations..."

✅ GOOD (rich but clear):
"A blue light bathes the room. The air smells of ancient magic.
You hear a strange noise - like trembling glass."
```

### 2. **Immersion Through Senses**
Every scene should engage multiple senses:
- **Sight**: Colors, movement, details
- **Sound**: Ambient noise, dialogue, warnings
- **Smell**: Locations smells
- **Touch**: Textures, temperatures (optional)
- **Taste**: Rarely, but can be memorable

### 3. **Brevity with Impact**
```
Ideal scene length: 400-600 words (about 2-3 paragraphs)

Structure:
1. Setting (150 words) - Where are you, what do you see?
2. Situation (200 words) - What's happening, what's at stake?
3. Choices setup (100 words) - Why these 4 choices matter?
```

### 4. **Show, Don't Tell**
```
❌ "You feel scared"
✅ "Your hand trembles as you grip the sword.
    Cold sweat drips down your neck."

❌ "The forest is beautiful"
✅ "Ancient trees tower above you, their bark twisted and ancient.
    Shafts of golden sunlight pierce through the canopy."
```

---

## Scene Template for AI Prompting (Multi-Universe)

### Universal Prompt Structure (for Claude/Gemini)

**IMPORTANT**: This template adapts based on the universe. Replace `{universeType}` with 'fantasy', 'apocalypse', or 'scifi'.

```
You are a {universeType} RPG narrative engine. Generate ONE immersive scene
for the player character. Follow these rules EXACTLY:

WORLD CONTEXT:
- Universe: {universeName} ({universeType} - {universeDescription})
- Character: {character.name}, {class}
- Stats: HP {hp}/{maxHp}, Mana {mana}/{maxMana}, Str {str}, Agi {agi}, Int {int}, Cha {cha}, Luck {luck}
- Current inventory: {items}
- Reputation: {faction_name}: {reputation_value}

LAST ACTION:
- Player chose: "{previous_choice_text}"
- Result: {consequences}

SCENE REQUIREMENTS:
1. IMMERSION: Engage all senses (sight, sound, smell, maybe touch)
2. CLARITY: Use simple, direct language (no fancy vocabulary)
3. RICHNESS: Describe specific details (colors, sounds, feelings)
4. BREVITY: 400-600 words exactly (NOT MORE)
5. CONSEQUENCE: Reflect previous choice in this scene
6. CHOICE SETUP: Make all 4 choices feel meaningful and different

SCENE STRUCTURE:
- Opening (2-3 sentences): Hook attention immediately
- Setting details (3-4 sentences): Paint vivid picture
- Situation (4-5 sentences): What's happening, what's at stake?
- NPC interaction or challenge (if relevant)
- Closing (1-2 sentences): Lead naturally into choices

NPC CONTINUITY:
- If Tormund the Blacksmith was in scene 3, reference him if relevant
  Example: "You see Tormund watching you intently from across the room"
- Make NPCs have consistent personalities and relationships to player

DANGER/CHALLENGE:
- Every few scenes, present real danger (stat checks required)
- Make some challenges avoidable, others unavoidable
- Consequences should be VISIBLE (lose HP, gain condition, etc)

TONE ADJUSTMENT:
- Keep tone consistent with character choices so far
- Dark path → darker scenes
- Heroic path → triumphant scenes
- Funny moments → reward clever builds (rogue, bard-like)

FORMAT:
Return ONLY valid JSON (no markdown, no explanation):
{
  "title": "Scene 7: The Sanctuary's Secret",
  "description": "[Full scene text here - 400-600 words]",
  "ambiance": "[One-line atmospheric description for UI]",
  "choices": [
    {
      "id": "choice_1",
      "text": "[Short choice option - 5-10 words]",
      "description": "[Why this choice matters - 15-20 words]",
      "statCheck": {
        "stat": "intellect",
        "difficulty": 12,
        "onSuccess": "You understand the riddle",
        "onFailure": "The riddle confuses you"
      },
      "consequences": {
        "xp": 100,
        "health": 0,
        "inventory": [],
        "events": ["You gained insight"]
      }
    },
    ... (3 more choices)
  ]
}
```

---

## Scene Examples (Good vs Bad)

### Example 1: Tavern Scene

#### ❌ BAD (Too simple, not engaging):
```
You're in a tavern. There are people here. You can drink, talk,
or leave. What do you do?
```

#### ✅ GOOD (Rich, clear, engaging):
```
SCENE 5: The Crimson Flagon

The tavern reeks of spilled ale and roasted meat. A thick fog
of pipe smoke hangs over the room. The wooden floors creak
beneath your boots. A massive fireplace crackles in the corner,
casting dancing shadows across weathered faces.

At the bar, the barkeep - a gruff man with a scarred face -
wipes glasses methodically. His eyes flick toward you, measuring.
In the corner, three hooded figures huddle over a table, their
voices too low to hear. A bard strums a sad melody on a worn
lute. Few listen.

You find a table in the shadows. A serving girl brings you
food without asking - "House special," she mutters. Steam rises
from the bowl. Your stomach rumbles.

Then you notice: One of the hooded figures keeps glancing
at you. Their hand rests on something at their belt. Could be
a weapon. Could be nothing. Your instincts prickle with
uncertainty.

What do you do?
```

### Example 2: Combat Scene

#### ❌ BAD (No tension, unclear stakes):
```
A goblin attacks you. Fight it.
```

#### ✅ GOOD (Tense, visceral, clear):
```
SCENE 12: The Bridge Ambush

Three shadows drop from the stone bridge above. They land in
a crouch, daggers gleaming in moonlight.

Goblins. Their yellow eyes lock onto yours. They grin -
exposing sharp teeth stained with something dark.

"Well, well," the largest hisses in broken Common. "Another
fool wandering the Blackwood alone."

Your hand instinctively goes to your weapon. The tallest goblin
- the leader - rises slowly. Scars crisscross his green skin.
This one has killed before.

Blood pounds in your ears. You're outnumbered. The bridge is
narrow - you could be pushed off. Drop thirty feet into rapids
below. Or you could stand and fight. Or run back the way you came.

The goblin leader takes a step closer. His two companions spread
out, circling. They're toying with you, confident.

"Last chance, human. Drop your coin purse, walk away, and we
don't spill your blood tonight."

What do you do?
```

---

## Multi-Universe Scene Examples 🆕

### Fantasy (Valorain) - Example Scene
```
SCENE 8: The Arcane Library

Dust motes dance in shafts of blue light filtering through stained glass.
The library stretches endlessly - towering shelves packed with ancient
tomes, their spines cracked and faded. The air smells of old parchment
and something else... ozone, like after a lightning strike.

A robed figure stands at a massive lectern, fingers tracing glowing
runes that hover above an open book. They don't look up as you enter,
but their voice echoes: "Another seeker of forbidden knowledge. How
predictable."

Your hand moves to your sword. This could be a test - or a trap.

What do you do?
```

### Apocalypse (Terre Desolee) - Example Scene
```
SCENE 12: The Dead Zone Crossing

Radiation warning signs hang crooked on rusted poles. Your Geiger
counter clicks steadily - not deadly yet, but getting there. The
highway stretches ahead, cracked asphalt swallowed by dead grass.

Abandoned cars form a metal graveyard. Most have been picked clean,
but you spot fresh boot prints in the dust. Someone passed through
recently. Alive, from the look of it.

Then you hear it: engines. Raiders. Two motorcycles, maybe three,
coming fast from the east. You have maybe thirty seconds before
they see you.

Your supplies are low. Fighting means risking injury. But running
means leaving potential loot behind.

What do you do?
```

### Sci-Fi (Nova Galaxia) - Example Scene
```
SCENE 15: Docking Bay 7-Alpha

Warning klaxons blare red across the station's viewport. Outside,
three Syndicate fighters drift in formation, weapons hot. Your
ship's AI chimes: "Hostile scan detected. Recommend immediate
departure."

The docking clamps release with a hiss. Around you, other ships
scramble for launch clearance. Panic spreads through the bay like
wildfire.

A transmission cuts through the chaos - encrypted, but your hacker
implant decodes it instantly: "Prototype in Bay 7. Secure it. No
witnesses."

That's YOUR bay. They're here for YOU.

What do you do?
```

---

## Engagement Mechanics in Narrative

### 1. **Foreshadowing**
```
Subtle hints of future events keep players engaged:

Scene 5: "An old woman watches you with knowing eyes.
         She whispers something you can't quite hear."

Scene 15: "That same woman appears again, now leading
          a group of cult members."

Player thinks: "OH! That was important!"
Result: Replay wanting to investigate more.
```

### 2. **Named NPCs That Matter**
```
NOT: "A merchant offers you a deal"
YES: "Tormund the Blacksmith, who saved you in Act 1,
     now refuses to meet your eyes. What happened?"

This creates:
- Continuity between scenes
- Emotional investment
- Consequences that feel REAL
- Reason to replay to make different choices
```

### 3. **Branching Through Stat Checks**
```
Scene shows same situation, but different outcomes:

Strength 15: "You effortlessly move the boulder aside."
Strength 8:  "You strain, but the boulder barely budges."
Intellect 12: "You notice the boulder isn't load-bearing."
Intellect 6:  "You wonder if this rock matters at all."

RESULT: Same scene, 4+ different experiences!
REPLAYABILITY: Player wants to replay with different stats.
```

### 4. **Permanent Consequences**
```
Scene 8: "You poison the well."

Scene 25+ (if reached): "The village is dying. Tormund's
daughter is ill. People stare at you with hollow eyes.
'Why didn't you stop the poison?' they ask."

Result: Player feels the WEIGHT of their choice.
        Wants to replay to fix it.
```

### 5. **Secrets & Discovery**
```
Hidden choices not mentioned explicitly:

Scene 10: "The guard's armor has a flaw - a gap at the
shoulder. You could try to exploit it."

NOT presented as choice, but observant players find it.
RESULT: "I discovered something the AI didn't tell me!"
        Huge engagement boost.
```

---

## Replayability Through Narrative

### Multiple Paths to Same Goal
```
Goal: Cross the river

Path A (Warrior): Fight the trolls guarding the bridge
Path B (Mage): Solve the ancient riddle
Path C (Rogue): Sneak past the guards at night
Path D (Priest): Negotiate with the troll chief
Path E (Diplomat): Bribe the guard captain

Same scene outcome, WILDLY different narrative experiences.
```

### Dynamic NPC Reactions
```
Scene 6: Meet Sorceress Lyra

If you're honorable: "She nods respectfully. 'Finally,
someone with integrity.'
  She might help you."

If you're chaotic: "She laughs coldly. 'Another fool who thinks
  they can change the world.'
  She might betray you."

Result: Same NPC, completely different relationship.
        Replayability: "What if I was nice to her?"
```

### Hidden Endings Based on Dialogue Choices
```
Ending A: Hero (mostly good choices)
Ending B: Dark Lord (mostly evil choices)
Ending C: Sacrifice (chose specific selfless acts)
Ending D: Trickster (mixed chaos throughout)
Ending E: Redemption (evil → good arc)
Ending F: True Hidden (specific rare dialogue + actions)

Player beats game, realizes there were 5 more endings.
They WANT to replay to find them all.
```

---

## AI Prompt Anti-Patterns (What NOT to Do)

### ❌ Don't:
- Use overly complex vocabulary ("perspicacious," "obfuscate")
- Write scenes > 700 words (too much to read)
- Ignore previous scenes (NPCs should remember)
- Make all choices equally good (some should fail)
- Describe stats/mechanics (show consequences, not numbers)
- Use player name in every sentence (feels artificial)
- Make NPCs feel generic ("A warrior stands before you")
- Forget about player's inventory/abilities
- Ignore Reputation impacts
- Make every scene combat (vary scene types)

### ✅ Do:
- Use clear, direct language
- Keep scenes 400-600 words
- Reference previous NPCs when relevant
- Make some choices risky/likely to fail
- Show consequences through narrative
- Use player name sparingly, meaningfully
- Give NPCs unique personalities/quirks
- Reference player's items, spells, stats
- Let reputation change NPC reactions
- Vary scene types (exploration, dialogue, combat, puzzle)

---

## Scene Pacing & Variety

### Scene Type Rotation (Recommended)
```
Scene 1: Introduction (set tone, introduce character)
Scene 2: Exploration (world-building, discovery)
Scene 3: Social (NPC interaction, dialogue)
Scene 4: Challenge (stat check, risk)
Scene 5: Exploration (new area)
Scene 6: Combat (action, danger)
Scene 7: Discovery (revelation, plot point)
Scene 8: Social (NPC with history)
Scene 9: Challenge (different type)
Scene 10: Climax or Major Fork

Avoid: 3 combat scenes in a row (boring)
       3 dialogue scenes in a row (feels empty)
       No varied stat checks (Warrior always wins)
```

### Scene Emotion Arc
```
Scenes 1-5:   Build-up (curiosity, small danger)
Scenes 6-10:  Escalation (real stakes, tough choices)
Scenes 11-15: Climax (major consequence, high danger)
Scenes 16-20: Resolution (rewards, betrayals, revelations)
Scenes 21+:   (Endgame, multiple possible endings)
```

---

## Testing Narrative Quality

### Checklist for Each Generated Scene:

- [ ] Is the first sentence a hook? (Makes reader want to continue?)
- [ ] Can a 12-year-old understand it? (Simple language?)
- [ ] Are there specific details? (Not generic?)
- [ ] Do I know what the character sees/hears/smells? (Sensory?)
- [ ] Are the 4 choices all interesting? (None obviously best?)
- [ ] Does this scene reference previous events? (Continuity?)
- [ ] Is it 400-600 words? (Right length?)
- [ ] Could this scene go differently with different stats? (Branching?)
- [ ] Does the NPC feel like a real person? (Personality?)
- [ ] Will I want to replay to make different choices? (Engaging?)

**Goal**: 9/10 or better on this checklist.

---

## Integration with Backend (Multi-Universe)

### AI Prompt Builder (Universe-Aware)

```typescript
// File: apps/backend/src/ai/scene-prompt.builder.ts

export function buildScenePrompt(
  gameState: GameSession,
  previousChoice: Choice,
  universeLore: UniverseLore
): string {
  const { universeType } = gameState.session;

  // Adapt labels based on the universe
  const statLabels = getStatLabelsForUniverse(universeType);

  // Build the universe-specific prompt
  const basePrompt = getUniverseBasePrompt(universeType);

  return `
${basePrompt}

WORLD CONTEXT:
- Universe: ${universeLore.name} (${universeType})
- Setting: ${universeLore.description}
- Factions: ${universeLore.factions.map(f => f.name).join(', ')}

CHARACTER CONTEXT:
- Name: ${gameState.character.name}
- Class: ${gameState.character.class}
- Level: ${gameState.character.level}
- Stats:
  HP ${gameState.character.hp}/${gameState.character.maxHp}
  ${statLabels.resource} ${gameState.character.mana}/${gameState.character.maxMana}
  Strength ${gameState.character.strength}
  Agility ${gameState.character.agility}
  Intelligence ${gameState.character.intelligence}
  Charisma ${gameState.character.charisma}
  Luck ${gameState.character.luck}

INVENTORY:
${gameState.character.inventory.map(item => `- ${item.name}`).join('\n')}

REPUTATION:
${gameState.reputation.map(r => `${r.faction}: ${r.value}`).join('\n')}

RECENT EVENTS:
${gameState.eventLog.slice(-3).map(e => e.description).join('\n')}

LAST ACTION:
Player chose: "${previousChoice.text}"
Result: ${previousChoice.consequences}

UNIVERSE-SPECIFIC TONE:
${getUniverseToneGuidelines(universeType)}

Now generate the next scene following the template structure.
`;
}

// Helper: Labels adapted per universe
function getStatLabelsForUniverse(universeType: UniverseType): StatLabels {
  const labels = {
    fantasy: { resource: 'Mana' },
    apocalypse: { resource: 'Stamina' },
    scifi: { resource: 'Shield Energy' }
  };
  return labels[universeType];
}

// Helper: Base prompt per universe
function getUniverseBasePrompt(universeType: UniverseType): string {
  const prompts = {
    fantasy: `You are a fantasy RPG narrative engine. Generate vivid medieval fantasy scenes with magic, mythical creatures, and ancient lore.`,
    apocalypse: `You are a post-apocalyptic RPG narrative engine. Generate gritty survival scenes with scarce resources, radiation zones, and desperate factions.`,
    scifi: `You are a sci-fi space opera RPG narrative engine. Generate futuristic scenes with advanced technology, alien species, and interstellar politics.`
  };
  return prompts[universeType];
}

// Helper: Tone guidelines per universe
function getUniverseToneGuidelines(universeType: UniverseType): string {
  const guidelines = {
    fantasy: `
- Use medieval/fantasy vocabulary (tavern, castle, magic, runes)
- Creatures: dragons, goblins, undead, fey creatures
- Technology level: swords, bows, potions, scrolls
- Atmosphere: mystical, ancient, magical`,

    apocalypse: `
- Use survival/scavenger vocabulary (scrap, radiation, bunker)
- Threats: raiders, mutants, starvation, disease
- Technology level: salvaged tech, makeshift weapons, jury-rigged gear
- Atmosphere: grim, desperate, claustrophobic`,

    scifi: `
- Use sci-fi vocabulary (starship, AI, plasma, quantum)
- Elements: aliens, androids, corporations, space stations
- Technology level: energy weapons, holograms, FTL travel
- Atmosphere: sleek, advanced, political intrigue`
  };
  return guidelines[universeType];
}
```

### Validation (Backend)

```typescript
// File: apps/backend/src/ai/scene-validator.ts

export function validateScene(scene: Scene): ValidationResult {
  const errors: string[] = [];

  if (scene.description.length < 300)
    errors.push("Scene too short");
  if (scene.description.length > 800)
    errors.push("Scene too long");

  if (!scene.choices || scene.choices.length !== 4)
    errors.push("Must have exactly 4 choices");

  for (const choice of scene.choices) {
    if (choice.text.length > 20)
      errors.push(`Choice too long: "${choice.text}"`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

---

## Conclusion

**The Goal**: Every scene should feel:
- 📖 Rich and engaging (not boring)
- 🧠 Easy to understand (not confusing)
- 🎮 Interactive (choices matter)
- 🔄 Replayable (different outcomes with different builds)
- 📍 Continuous (references previous events)
- 🎯 Varied (not repetitive)

When this works, players **can't stop playing** because every choice feels meaningful, every NPC feels real, and every replay feels different.
