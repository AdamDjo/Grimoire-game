import type { ChronicleView } from './chronicle.types'

/** Local design fixture. It is reachable only through the development-only adapter guard. */
export const CHRONICLE_PREVIEW: ChronicleView = {
  bodyMarkdown: `Le vent avait effacé la route derrière Yarel avant même qu’il comprenne qu’il ne la reprendrait jamais. Devant lui, les pierres du puits sortaient du sel comme les dents d’une bête morte. Il marcha pourtant. Les Sahelins apprennent tôt que l’immobilité tue plus sûrement que la soif, et Yarel avait passé sa vie à avancer quand les autres cherchaient un abri.

La première nuit, il partagea son eau avec une inconnue qui refusait de donner son nom. Elle portait autour du poignet un fil rouge, couleur interdite sous les lunes de Velkhar. Au matin, elle avait disparu. À sa place reposait une pièce de fer noir, encore chaude, marquée d’un œil fermé.

## Là où le sel écoute

Au troisième jour, la Calamine commença à parler avec la voix de ceux qu’il avait laissés derrière lui. Elle ne criait pas. Elle murmurait des souvenirs exacts : l’odeur du pain brûlé dans la maison de sa mère, le poids d’une main sur son épaule, la promesse faite à un frère qui n’avait jamais existé. Yarel serra la pièce jusqu’au sang et poursuivit vers les tours noyées de Tissan.

Dans les ruines, il trouva le veilleur Ors, assis devant une porte sans mur. Le vieil homme connaissait son nom. Il connaissait aussi celui de l’inconnue au fil rouge, mais demanda un souvenir en échange. Yarel offrit le visage de son père. Le marché fut conclu sans lumière ni témoin. Quand la porte s’ouvrit, il ne sut plus pourquoi cette perte lui faisait mal.

De l’autre côté attendait une salle pleine de pluie. L’eau tombait vers le plafond et chaque goutte contenait une scène possible : Yarel rentrant chez lui, Yarel couronné dans une cité étrangère, Yarel mort sous un ciel sans lune. Au centre, l’inconnue tenait une lampe de verre. Elle lui demanda de choisir une vie et d’abandonner toutes les autres.

> Certaines portes ne s’ouvrent qu’une fois. Certaines dettes aussi.

Yarel refusa. Il brisa la lampe avec la pièce de fer noir. Toutes les pluies tombèrent en même temps. La tour trembla, les images éclatèrent, et la Calamine entra en lui comme une marée froide. Il courut tandis que Tissan s’effondrait autour de ses pas. Ors riait quelque part derrière la pierre, ou peut-être était-ce seulement le vent.

Il atteignit le puits au lever du jour. L’inconnue l’y attendait encore, débarrassée de son fil rouge. Elle lui tendit une gourde et Yarel comprit enfin : elle n’avait jamais cherché à le sauver. Elle voulait savoir combien de routes un homme pouvait perdre avant de ne plus reconnaître celle qui le ramenait à lui-même.

Yarel but. L’eau avait le goût du fer et des choses oubliées. Quand il releva les yeux, le désert était vide. Sa vocation de Marcheur du Sel ne signifiait plus rien, sinon cette obstination ancienne : poser un pied devant l’autre jusqu’à ce que le monde cède ou que le corps refuse.

Il fit encore sept pas. Le huitième resta suspendu au-dessus du sel.

Bien plus tard, des voyageurs trouvèrent près du puits une pièce noire, un fil rouge et une suite d’empreintes qui s’arrêtait sans chute ni retour. Aucun corps. Aucun nom. Seulement la certitude qu’un homme avait marché jusque-là pour refuser la vie qu’on voulait choisir à sa place.

Velkhar conserva le reste.`,
  createdAt: '2026-07-17T00:00:00.000Z',
  endReason: 'death',
  keyMoments: [
    { label: 'La pièce à l’œil fermé', sceneRef: 2 },
    { label: 'Le marché du veilleur Ors', sceneRef: 6 },
    { label: 'La lampe des vies possibles', sceneRef: 9 },
    { label: 'Sept pas après le puits', sceneRef: 12 },
  ],
  mood: 'melancholic',
  slug: 'apercu',
  tagline: 'Certaines routes refusent le retour.',
  title: 'Le huitième pas',
}
