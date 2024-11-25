import { Equipment } from '../types/game';

export const equipmentList: Equipment[] = [
  // Mining Equipment
  {
    id: 'basic-mining-laser',
    name: 'Basic Mining Laser',
    type: 'mining',
    description: 'Standard mining equipment for basic operations.',
    cost: 50,
    requiredClass: ['prospector', 'harvester', 'transporter'],
    miningPower: 10
  },
  {
    id: 'advanced-mining-laser',
    name: 'Advanced Mining Laser',
    type: 'mining',
    description: 'Higher efficiency mining equipment.',
    cost: 150,
    requiredClass: ['harvester', 'transporter'],
    miningPower: 25
  },
  {
    id: 'quantum-drill',
    name: 'Quantum Drill',
    type: 'mining',
    description: 'Top-tier mining equipment.',
    cost: 300,
    requiredClass: ['transporter'],
    miningPower: 50
  },

  // Defense Equipment
  {
    id: 'basic-shield',
    name: 'Basic Shield Generator',
    type: 'defense',
    description: 'Provides basic protection.',
    cost: 100,
    requiredClass: ['prospector', 'harvester', 'assault-fighter', 'combat-eagle', 'scoutship'],
    shieldPower: 20
  },
  {
    id: 'advanced-shield',
    name: 'Advanced Shield Generator',
    type: 'defense',
    description: 'Superior protection system.',
    cost: 250,
    requiredClass: ['transporter', 'destructor', 'terminator', 'fleet-battleship', 'command-cruiser'],
    shieldPower: 50
  },
  {
    id: 'quantum-shield',
    name: 'Quantum Shield Matrix',
    type: 'defense',
    description: 'Ultimate defense system.',
    cost: 500,
    requiredClass: ['scoutship', 'terminator', 'fleet-battleship', 'command-cruiser'],
    shieldPower: 100
  },

  // Weapon Equipment
  {
    id: 'point-defense',
    name: 'Point Defense System',
    type: 'weapon',
    description: 'Basic defensive weaponry.',
    cost: 100,
    requiredClass: ['harvester', 'assault-fighter', 'scoutship'],
    weaponPower: 15
  },
  {
    id: 'plasma-cannon',
    name: 'Plasma Cannon',
    type: 'weapon',
    description: 'Medium-range offensive weapon.',
    cost: 200,
    requiredClass: ['combat-eagle', 'destructor', 'terminator'],
    weaponPower: 30
  },
  {
    id: 'ion-beam',
    name: 'Ion Beam Array',
    type: 'weapon',
    description: 'Long-range heavy weapon.',
    cost: 300,
    requiredClass: ['destructor', 'terminator', 'fleet-battleship', 'command-cruiser'],
    weaponPower: 45
  },
  {
    id: 'fusion-lance',
    name: 'Fusion Lance',
    type: 'weapon',
    description: 'Super-heavy ship to ship weapon.',
    cost: 500,
    requiredClass: ['destructor', 'terminator', 'fleet-battleship', 'command-cruiser'],
    weaponPower: 75
  },
  {
    id: 'missile-battery',
    name: 'Missile Battery',
    type: 'weapon',
    description: 'Multi-target weapon system.',
    cost: 250,
    requiredClass: ['combat-eagle', 'destructor', 'terminator', 'fleet-battleship', 'command-cruiser'],
    weaponPower: 35
  }
];