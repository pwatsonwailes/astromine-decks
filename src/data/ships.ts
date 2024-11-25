import { Ship, ShipClass, EquipmentSlot } from '../types/game';

const createShipTemplate = (
  className: ShipClass,
  cost: number,
  maxHealth: number,
  slots: Record<EquipmentSlot, number>
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
  }
});

export const shipTemplates: Record<ShipClass, Omit<Ship, 'id' | 'name'>> = {
  basic: createShipTemplate('basic', 100, 50, {
    mining: 1,
    defense: 0,
    weapon: 0
  }),
  medium: createShipTemplate('medium', 250, 100, {
    mining: 2,
    defense: 1,
    weapon: 1
  }),
  large: createShipTemplate('large', 500, 200, {
    mining: 3,
    defense: 2,
    weapon: 2
  })
};

export const createShip = (className: ShipClass): Ship => {
  const template = shipTemplates[className];
  const shipNames = {
    basic: ['Miner-1', 'Digger', 'Prospector'],
    medium: ['Excavator', 'Collector', 'Harvester'],
    large: ['Behemoth', 'Leviathan', 'Titan']
  };
  
  return {
    ...template,
    id: crypto.randomUUID(),
    name: `${shipNames[className][Math.floor(Math.random() * shipNames[className].length)]}-${Math.floor(Math.random() * 1000)}`
  };
};