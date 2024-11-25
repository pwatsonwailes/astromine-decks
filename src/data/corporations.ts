import { Corporation, DiplomaticStatus } from '../types/game';
import { createShip } from './ships';
import { equipmentList } from './equipment';

const corporationNames = [
  'Stellar Dynamics',
  'Nova Industries',
  'Orion Mining Co.',
  'Asteroid Technologies',
  'Cosmic Resources Ltd.',
  'Nebula Enterprises',
  'Galactic Mining Corp',
  'Deep Space Industries'
];

export const generateCorporation = (
  id: string,
  isPlayer: boolean = false,
  otherCorpIds: string[] = []
): Corporation => {
  const name = isPlayer 
    ? 'Terra Mining Corp' 
    : corporationNames[Math.floor(Math.random() * corporationNames.length)];

  // Create initial diplomatic status
  const diplomaticStatus: Record<string, DiplomaticStatus> = {};
  otherCorpIds.forEach(corpId => {
    diplomaticStatus[corpId] = 'neutral';
  });

  // Generate personality traits for AI corporations
  const personality = !isPlayer ? {
    aggression: Math.random(),
    cooperation: Math.random(),
    greed: Math.random()
  } : undefined;

  // Create basic ship with mining equipment
  const basicShip = createShip('prospector', id, name);
  const basicLaser = equipmentList.find(eq => eq.id === 'basic-mining-laser')!;

  return {
    id,
    name,
    health: 80,
    maxHealth: 80,
    credits: 200,
    shield: 0,
    resources: {
      silicates: 0,
      oxides: 0,
      sulfides: 0,
      iron: 0,
      nickel: 0,
      silicon: 0,
      magnesium: 0
    },
    equippedMiningTypes: ['C'],
    ships: [{
      ...basicShip,
      equipment: {
        ...basicShip.equipment,
        mining: [basicLaser]
      }
    }],
    hasAdvancedSpaceDock: false,
    diplomaticStatus,
    agreements: [],
    isPlayer,
    personality
  };
};