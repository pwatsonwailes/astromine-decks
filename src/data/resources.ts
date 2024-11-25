import { Resource, AsteroidType } from '../types/game';

export const resourceBaseValues: Record<Resource, number> = {
  silicates: 10,
  oxides: 15,
  sulfides: 20,
  iron: 25,
  nickel: 30,
  silicon: 35,
  magnesium: 40
};

export const asteroidComposition: Record<AsteroidType, Resource[]> = {
  'C': ['silicates', 'oxides', 'sulfides'],
  'M': ['iron', 'nickel'],
  'S': ['iron', 'silicon', 'magnesium']
};

// Market fluctuation between 0.8 and 1.2
export const getMarketPrice = (baseValue: number): number => {
  const fluctuation = 0.8 + Math.random() * 0.4;
  return Math.round(baseValue * fluctuation);
};

export const generateComposition = (type: AsteroidType, difficulty: number) => {
  const resources = asteroidComposition[type];
  return resources.map(resource => ({
    resource,
    amount: Math.floor(Math.random() * difficulty * 50) + 20,
    baseValue: resourceBaseValues[resource]
  }));
};