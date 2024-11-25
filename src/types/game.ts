export type AsteroidType = 'C' | 'S' | 'M';
export type Resource = 
  | 'silicates' 
  | 'oxides' 
  | 'sulfides' 
  | 'iron' 
  | 'nickel' 
  | 'silicon' 
  | 'magnesium';

export type DiplomaticStatus = 'friendly' | 'neutral' | 'hostile' | 'war';
export type DiplomaticAction = 'non-aggression' | 'joint-combat' | 'peace';
export type CombatAction = 'attack' | 'defend' | 'retreat';

export interface DiplomaticAgreement {
  id: string;
  type: DiplomaticAction;
  parties: [string, string]; // [corporationId1, corporationId2]
  terms: {
    penalty: number;
    duration?: number;
    turnsToAct?: number;
  };
  status: 'active' | 'broken' | 'completed';
  createdAt: number;
}

export interface DiplomaticProposal {
  id: string;
  action: DiplomaticAction;
  fromCorporationId: string;
  toCorporationId: string;
  terms: {
    penalty: number;
    duration?: number;
    turnsToAct?: number;
  };
  createdAt: number;
}

export interface CorporationPersonality {
  aggression: number;  // 0-1, likelihood to engage in combat
  cooperation: number; // 0-1, likelihood to accept diplomatic proposals
  greed: number;      // 0-1, focus on resource acquisition
}

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
  diplomaticStatus: Record<string, DiplomaticStatus>;
  agreements: DiplomaticAgreement[];
  isPlayer: boolean;
  personality?: CorporationPersonality;
}

export interface CombatState {
  id: string;
  attackerId: string;
  defenderId: string;
  attackerShips: Ship[];
  defenderShips: Ship[];
  turn: number;
  status: 'active' | 'completed';
  winner?: string;
  rewards?: {
    credits: number;
    resources: Partial<Record<Resource, number>>;
  };
}

export type TradeGoodCategory = 
  | 'basic_resources'
  | 'luxury_goods'
  | 'industrial'
  | 'medical'
  | 'technology'
  | 'ship_parts';

export interface TradeGood {
  id: string;
  name: string;
  category: TradeGoodCategory;
  baseValue: number;
  description: string;
  volatility: number; // 0-1, how much the price fluctuates
  rarity: 'common' | 'uncommon' | 'rare';
}

export interface MarketPrice {
  goodId: string;
  buyPrice: number;
  sellPrice: number;
  lastUpdate: number;
  supply: number;
}

export interface Trader {
  id: string;
  name: string;
  description: string;
  inventory: TraderInventory[];
  turnsRemaining: number;
  nextAppearance?: number;
}

export interface TraderInventory {
  resource: Resource;
  amount: number;
  priceMultiplier: number; // Base price multiplier
  volatility: number; // Price fluctuation (0-1)
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

export interface ShipBuildOrder {
  id: string;
  shipClass: ShipClass;
  turnsRemaining: number;
  totalTurns: number;
  cost: number;
}

export interface GameLog {
  id: string;
  turn: number;
  messages: string[];
  resourceChanges?: Partial<Record<Resource, number>>;
  creditChange?: number;
}

export type CombatCardType = 
  | 'attack' 
  | 'defense' 
  | 'tactical' 
  | 'support';

export interface CombatCard {
  id: string;
  name: string;
  type: CombatCardType;
  cost: number;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare';
  effect: {
    damage?: number;
    shield?: number;
    special?: string;
  };
  requirements?: {
    shipClass?: ShipClass[];
    minWeaponPower?: number;
    minShieldPower?: number;
  };
}

export interface CombatState {
  id: string;
  attackerId: string;
  defenderId: string;
  attackerShips: Ship[];
  defenderShips: Ship[];
  turn: number;
  status: 'active' | 'completed';
  winner?: string;
  rewards?: {
    credits: number;
    resources: Partial<Record<Resource, number>>;
  };
}

export interface GameState {
  player: Corporation;
  corporations: Corporation[];
  asteroids: Asteroid[];
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  energy: number;
  maxEnergy: number;
  turn: number;
  shop: Card[];
  activeMiningOperations: ActiveMiningOperation[];
  traders: Trader[];
  shipBuildQueue: ShipBuildOrder[];
  gameLogs: GameLog[];
  market: {
    prices: MarketPrice[];
    lastRefresh: number;
  };
  diplomaticProposals: DiplomaticProposal[];
  activeCombats: CombatState[];
}

export interface ActiveMiningOperation {
  cardId: string;
  card: Card;
  asteroidId: string;
  turnsActive: number;
}