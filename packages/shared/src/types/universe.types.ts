export type UniverseType = 'fantasy' | 'apocalypse' | 'scifi' | 'custom';

export interface Region {
  id: string;
  name: string;
  description: string;
  climate: string;
  dangers: string[];
  pointsOfInterest: string[];
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  alignment: string;
  relations: Record<string, 'allied' | 'neutral' | 'hostile'>;
  territory: string;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  personality: string;
  factionId?: string;
  regionId: string;
  dialogue?: string;
  questIds?: string[];
}

export interface UniverseLore {
  name: string;
  description: string;
  history: string;
  regions: Region[];
  factions: Faction[];
  npcs: NPC[];
}

export interface UniverseMechanics {
  primaryResource: string;
  secondaryResource?: string;
  specialMechanics: string[];
  availableRaces: string[];
  availableClasses: string[];
}

export interface Universe {
  id: string;
  userId?: string;
  name: string;
  type: UniverseType;
  lore: UniverseLore;
  mechanics: UniverseMechanics;
  config?: CustomUniverseConfig;
  createdAt: string;
}

export interface CustomUniverseConfig {
  worldType: string;
  factionCount: number;
  raceCount: number;
  questStyle: ('combat' | 'exploration' | 'diplomacy' | 'puzzle')[];
  customDescription?: string;
}

export interface GenerateUniverseInput {
  type: UniverseType;
  config?: CustomUniverseConfig;
}
