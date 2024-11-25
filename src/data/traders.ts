import { Trader, Resource } from '../types/game';

const traderNames = [
  'Stellar Syndicate',
  'Nova Corps Trading',
  'Asteroid Belt Merchants',
  'Deep Space Exchange',
  'Orion Market Network'
];

const traderDescriptions = [
  'Known for fair prices and reliable stock',
  'Specializes in rare materials',
  'Direct from the asteroid mines',
  'The best deals in the sector',
  'Premium goods at premium prices'
];

export const generateTrader = (): Trader => {
  const resources: Resource[] = ['silicates', 'oxides', 'sulfides', 'iron', 'nickel', 'silicon', 'magnesium'];
  const nameIndex = Math.floor(Math.random() * traderNames.length);
  
  // Generate random inventory (2-4 items)
  const inventorySize = Math.floor(Math.random() * 3) + 2;
  const shuffledResources = [...resources].sort(() => Math.random() - 0.5);
  const inventory = shuffledResources.slice(0, inventorySize).map(resource => ({
    resource,
    amount: Math.floor(Math.random() * 100) + 50,
    priceMultiplier: 0.8 + Math.random() * 0.4, // 0.8 to 1.2
    volatility: Math.random() * 0.2 // 0 to 0.2
  }));

  return {
    id: crypto.randomUUID(),
    name: traderNames[nameIndex],
    description: traderDescriptions[nameIndex],
    inventory,
    turnsRemaining: Math.floor(Math.random() * 11) + 10 // 10-20 turns
  };
};