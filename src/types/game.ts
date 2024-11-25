export type AsteroidType = 'C' | 'S' | 'M';
export type Resource = 
  | 'silicates' 
  | 'oxides' 
  | 'sulfides' 
  | 'iron' 
  | 'nickel' 
  | 'silicon' 
  | 'magnesium';

export type EquipmentSlot = 'mining' | 'defense' | 'weapon';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentSlot;
  description: string;
  cost: number;
  requiredClass: ShipClass[];
  asteroidTypeRequirement?: AsteroidType;
  miningPower?: number;
  shieldPower?: number;
  weaponPower?: number;
}

export type ShipClass = 
  | 'prospector' 
  | 'harvester' 
  | 'transporter' 
  | 'assault-fighter'
  | 'combat-eagle'
  | 'scoutship'
  | 'destructor'
  | 'terminator'
  | 'fleet-battleship'
  | 'command-cruiser';

export type ShipSpeed = 'slow' | 'medium' | 'fast';
export type ShipRange = 'short' | 'medium' | 'long';

export interface Ship {
  id: string;
  name: string;
  class: ShipClass;
  cost: number;
  maxEquipmentSlots: Record<EquipmentSlot, number>;
  equipment: Record<EquipmentSlot, Equipment[]>;
  assignedAsteroidId?: string;
  health: number;
  maxHealth: number;
  speed: ShipSpeed;
  range: ShipRange;
  carrierCapacity?: number;
  carriedShips?: Ship[];
  ownerId: string;
  ownerName: string;
}

export interface Card {
  id: string;
  name: string;
  type: 'attack' | 'defense' | 'mining' | 'economic' | 'equipment';
  cost: number;
  description: string;
  effect: (state: GameState) => GameState;
  rarity: 'common' | 'uncommon' | 'rare';
  asteroidTypeRequirement?: AsteroidType;
  miningPower?: number;
  price?: number;
}

export interface Corporation {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  credits: number;
  shield: number;
  resources: Record<Resource, number>;
  equippedMiningTypes: AsteroidType[];
  ships: Ship[];
  hasAdvancedSpaceDock: boolean;
}

// Add new types for asteroid composition
export type AsteroidComposition = {
  resource: Resource;
  amount: number;
  baseValue: number;
};

// Update the Asteroid interface
export interface Asteroid {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  composition: AsteroidComposition[];
  difficulty: number;
  type: AsteroidType;
  position: {
    x: number;
    y: number;
  };
}

export interface GameState {
  player: Corporation;
  opponent: Corporation;
  asteroids: Asteroid[];
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  energy: number;
  maxEnergy: number;
  turn: number;
  shop: Card[];
  activeMiningOperations: ActiveMiningOperation[];
}

export interface ActiveMiningOperation {
  cardId: string;
  card: Card;
  asteroidId: string;
  turnsActive: number;
}