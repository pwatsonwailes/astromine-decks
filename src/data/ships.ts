import { Ship, ShipClass, EquipmentSlot, ShipSpeed, ShipRange } from '../types/game';

const createShipTemplate = (
  className: ShipClass,
  cost: number,
  maxHealth: number,
  slots: Record<EquipmentSlot, number>,
  speed: ShipSpeed,
  range: ShipRange,
  carrierCapacity?: number
): Omit<Ship, 'id' | 'name'> => ({
  class: className,
  cost,
  maxHealth,
  health: maxHealth,
  maxEquipmentSlots: slots,
  equipment: {
    mining: [],
    defense: [],
    weapon: []
  },
  speed,
  range,
  ...(carrierCapacity ? { carrierCapacity, carriedShips: [] } : {})
});

export const shipTemplates: Record<ShipClass, Omit<Ship, 'id' | 'name'>> = {
  // Mining Ships
  prospector: createShipTemplate('prospector', 100, 50, {
    mining: 1,
    defense: 1,
    weapon: 0
  }, 'medium', 'short'),
  
  harvester: createShipTemplate('harvester', 250, 100, {
    mining: 2,
    defense: 1,
    weapon: 1
  }, 'medium', 'medium'),
  
  transporter: createShipTemplate('transporter', 500, 200, {
    mining: 3,
    defense: 2,
    weapon: 2
  }, 'slow', 'long'),

  // Combat Ships
  'assault-fighter': createShipTemplate('assault-fighter', 150, 75, {
    mining: 0,
    defense: 1,
    weapon: 1
  }, 'fast', 'short'),

  'combat-eagle': createShipTemplate('combat-eagle', 300, 100, {
    mining: 0,
    defense: 1,
    weapon: 2
  }, 'fast', 'short'),

  scoutship: createShipTemplate('scoutship', 200, 80, {
    mining: 0,
    defense: 3,
    weapon: 1
  }, 'slow', 'long'),

  destructor: createShipTemplate('destructor', 400, 150, {
    mining: 0,
    defense: 2,
    weapon: 3
  }, 'medium', 'medium'),

  terminator: createShipTemplate('terminator', 600, 200, {
    mining: 0,
    defense: 3,
    weapon: 3
  }, 'slow', 'long'),

  'fleet-battleship': createShipTemplate('fleet-battleship', 800, 300, {
    mining: 0,
    defense: 4,
    weapon: 5
  }, 'slow', 'long', 2),

  'command-cruiser': createShipTemplate('command-cruiser', 1000, 400, {
    mining: 0,
    defense: 5,
    weapon: 4
  }, 'slow', 'long', 5)
};

const shipNames: Record<ShipClass, string[]> = {
  prospector: ['Prospector', 'Miner', 'Digger'],
  harvester: ['Harvester', 'Collector', 'Gatherer'],
  transporter: ['Transporter', 'Hauler', 'Carrier'],
  'assault-fighter': ['Wasp', 'Hornet', 'Striker'],
  'combat-eagle': ['Eagle', 'Hawk', 'Falcon'],
  scoutship: ['Scout', 'Observer', 'Watcher'],
  destructor: ['Destructor', 'Annihilator', 'Ravager'],
  terminator: ['Terminator', 'Obliterator', 'Decimator'],
  'fleet-battleship': ['Sovereign', 'Dreadnought', 'Titan'],
  'command-cruiser': ['Command', 'Admiral', 'Overlord']
};

export const createShip = (className: ShipClass): Ship => {
  const template = shipTemplates[className];
  const names = shipNames[className];
  
  return {
    ...template,
    id: crypto.randomUUID(),
    name: `${names[Math.floor(Math.random() * names.length)]}-${Math.floor(Math.random() * 1000)}`
  };
};