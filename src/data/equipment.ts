import { Equipment, ShipClass } from '../types/game';

export const equipmentList: Equipment[] = [
  {
    id: 'basic-mining-laser',
    name: 'Basic Mining Laser',
    type: 'mining',
    description: 'Standard mining equipment for basic operations.',
    cost: 50,
    requiredClass: ['basic', 'medium', 'large'],
    miningPower: 10
  },
  {
    id: 'advanced-mining-laser',
    name: 'Advanced Mining Laser',
    type: 'mining',
    description: 'Higher efficiency mining equipment.',
    cost: 150,
    requiredClass: ['medium', 'large'],
    miningPower: 25
  },
  {
    id: 'quantum-drill',
    name: 'Quantum Drill',
    type: 'mining',
    description: 'Top-tier mining equipment.',
    cost: 300,
    requiredClass: ['large'],
    miningPower: 50
  },
  {
    id: 'basic-shield',
    name: 'Basic Shield Generator',
    type: 'defense',
    description: 'Provides basic protection.',
    cost: 100,
    requiredClass: ['medium', 'large'],
    shieldPower: 20
  },
  {
    id: 'advanced-shield',
    name: 'Advanced Shield Generator',
    type: 'defense',
    description: 'Superior protection system.',
    cost: 250,
    requiredClass: ['large'],
    shieldPower: 50
  },
  {
    id: 'point-defense',
    name: 'Point Defense System',
    type: 'weapon',
    description: 'Basic defensive weaponry.',
    cost: 100,
    requiredClass: ['medium', 'large'],
    weaponPower: 15
  },
  {
    id: 'plasma-cannon',
    name: 'Plasma Cannon',
    type: 'weapon',
    description: 'Heavy offensive weapon.',
    cost: 300,
    requiredClass: ['large'],
    weaponPower: 40
  }
];