import type { AiScenePayload } from './scene-validator'
import type { Character, Locale } from '@grimoire/shared'

/**
 * Deterministic fallback scene — no AI, no API key, no token cost.
 * Used to unblock the session screen and when the AI is unavailable or malformed.
 */
export function buildStubScene(character: Character, locale: Locale): AiScenePayload {
  if (locale === 'fr') {
    return {
      narrative: [
        `Le sel crisse sous les bottes de ${character.name}. Le vent du Makhzen porte une odeur de cendre froide.`,
        'Devant vous, une piste de caravane s’efface dans les dunes. Une silhouette attend, immobile, près d’un puits à sec.',
      ].join('\n\n'),
      sceneType: 'exploration',
      location: 'Route du sel, lisière du Makhzen',
      choices: [
        { text: 'Approcher la silhouette près du puits', type: 'dialog', riskLevel: 'low' },
        { text: 'Fouiller la piste de caravane effacée', type: 'action', riskLevel: 'medium' },
        { text: 'Faire un détour prudent par les dunes', type: 'action', riskLevel: 'safe' },
      ],
    }
  }

  return {
    narrative: [
      `Salt crunches under ${character.name}'s boots. The wind off the Makhzen carries the smell of cold ash.`,
      'Ahead, a caravan track fades into the dunes. A still figure waits beside a dry well.',
    ].join('\n\n'),
    sceneType: 'exploration',
    location: 'Salt road, edge of the Makhzen',
    choices: [
      { text: 'Approach the figure by the well', type: 'dialog', riskLevel: 'low' },
      { text: 'Search the fading caravan track', type: 'action', riskLevel: 'medium' },
      { text: 'Take a careful detour through the dunes', type: 'action', riskLevel: 'safe' },
    ],
  }
}
