import { CombatCard } from '../types/game';

export const combatCards: CombatCard[] = [
  // Attack Cards
  {
    id: 'focused-fire',
    name: 'Focused Fire',
    type: 'attack',
    cost: 2,
    description: 'Concentrate fire on a single target for increased damage.',
    rarity: 'common',
    effect: {
      damage: 15
    }
  },
  {
    id: 'missile-barrage',
    name: 'Missile Barrage',
    type: 'attack',
    cost: 3,
    description: 'Launch a devastating missile attack.',
    rarity: 'uncommon',
    effect: {
      damage: 25
    },
    requirements: {
      minWeaponPower: 20
    }
  },
  {
    id: 'ion-cannon',
    name: 'Ion Cannon',
    type: 'attack',
    cost: 4,
    description: 'Disable enemy shields and deal moderate damage.',
    rarity: 'rare',
    effect: {
      damage: 20,
      special: 'disable_shields'
    },
    requirements: {
      shipClass: ['destructor', 'terminator', 'fleet-battleship']
    }
  },

  // Defense Cards
  {
    id: 'emergency-shields',
    name: 'Emergency Shields',
    type: 'defense',
    cost: 2,
    description: 'Quickly raise shields for temporary protection.',
    rarity: 'common',
    effect: {
      shield: 15
    }
  },
  {
    id: 'adaptive-defense',
    name: 'Adaptive Defense',
    type: 'defense',
    cost: 3,
    description: 'Shield strength increases based on incoming damage.',
    rarity: 'uncommon',
    effect: {
      shield: 20,
      special: 'adaptive'
    }
  },
  {
    id: 'quantum-barrier',
    name: 'Quantum Barrier',
    type: 'defense',
    cost: 4,
    description: 'Create an impenetrable barrier that blocks all damage for one turn.',
    rarity: 'rare',
    effect: {
      special: 'invulnerable'
    },
    requirements: {
      minShieldPower: 30
    }
  },

  // Tactical Cards
  {
    id: 'evasive-maneuvers',
    name: 'Evasive Maneuvers',
    type: 'tactical',
    cost: 2,
    description: 'Reduce incoming damage and reposition for a counter-attack.',
    rarity: 'common',
    effect: {
      special: 'evasive'
    }
  },
  {
    id: 'targeting-scan',
    name: 'Targeting Scan',
    type: 'tactical',
    cost: 2,
    description: 'Analyze enemy weaknesses to increase damage on next attack.',
    rarity: 'uncommon',
    effect: {
      special: 'increase_damage'
    }
  },
  {
    id: 'emp-burst',
    name: 'EMP Burst',
    type: 'tactical',
    cost: 3,
    description: 'Temporarily disable enemy weapons systems.',
    rarity: 'rare',
    effect: {
      special: 'disable_weapons'
    }
  },

  // Support Cards
  {
    id: 'emergency-repairs',
    name: 'Emergency Repairs',
    type: 'support',
    cost: 2,
    description: 'Quickly repair hull damage.',
    rarity: 'common',
    effect: {
      special: 'repair'
    }
  },
  {
    id: 'power-redirect',
    name: 'Power Redirect',
    type: 'support',
    cost: 2,
    description: 'Transfer power between shields and weapons for a tactical advantage.',
    rarity: 'uncommon',
    effect: {
      special: 'power_transfer'
    }
  },
  {
    id: 'reinforcements',
    name: 'Reinforcements',
    type: 'support',
    cost: 4,
    description: 'Call in a reserve ship to join the battle.',
    rarity: 'rare',
    effect: {
      special: 'reinforcement'
    }
  }
];