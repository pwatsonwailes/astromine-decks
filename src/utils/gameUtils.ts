import { Asteroid, Resource, Card, AsteroidType } from '../types/game';

const asteroidNames = [
  'Ceres Prime', 'Vesta Major', 'Pallas-IX', 'Hygiea Belt', 
  'Psyche Core', 'Eros Fragment', 'Ida Cluster'
];

const resourceWeights: Record<Resource, number> = {
  iron: 0.4,
  titanium: 0.3,
  platinum: 0.15,
  water: 0.1,
  helium3: 0.05
};

const asteroidTypeData: Record<AsteroidType, { baseYield: number; resourceMultiplier: number }> = {
  'C': { baseYield: 10, resourceMultiplier: 1 },
  'S': { baseYield: 20, resourceMultiplier: 2 },
  'M': { baseYield: 35, resourceMultiplier: 3 }
};

// Map dimensions
export const MAP_WIDTH = 2000;
export const MAP_HEIGHT = 1500;
export const VIEWPORT_WIDTH = 800;
export const VIEWPORT_HEIGHT = 600;

export const generateAsteroid = (difficulty: number): Asteroid => {
  const resources: Partial<Record<Resource, number>> = {};
  const resourceEntries = Object.entries(resourceWeights) as [Resource, number][];
  const type = selectAsteroidType(difficulty);
  const multiplier = asteroidTypeData[type].resourceMultiplier;
  const health = 20 + difficulty * 10;
  
  resourceEntries.forEach(([resource, weight]) => {
    if (Math.random() < weight) {
      resources[resource] = Math.floor(Math.random() * difficulty * 10 * multiplier) + 5;
    }
  });

  // Ensure asteroid position is within map boundaries
  return {
    id: crypto.randomUUID(),
    name: asteroidNames[Math.floor(Math.random() * asteroidNames.length)],
    health,
    maxHealth: health,
    resources,
    difficulty,
    type,
    baseYield: asteroidTypeData[type].baseYield * difficulty,
    position: {
      x: Math.random() * (MAP_WIDTH - 100) + 50, // 50px padding from edges
      y: Math.random() * (MAP_HEIGHT - 100) + 50
    }
  };
};

export const generateInitialAsteroids = (count: number): Asteroid[] => {
  const asteroids: Asteroid[] = [];
  for (let i = 0; i < count; i++) {
    const difficulty = Math.floor(i / 3) + 1;
    asteroids.push(generateAsteroid(difficulty));
  }
  return asteroids;
};

const selectAsteroidType = (difficulty: number): AsteroidType => {
  const roll = Math.random();
  if (difficulty > 3 && roll < 0.2) return 'M';
  if (difficulty > 2 && roll < 0.5) return 'S';
  return 'C';
};

export const createDeckWithUniqueIds = (cards: Card[]): Card[] => {
  return cards.map(card => ({
    ...card,
    id: `${card.id}-${crypto.randomUUID()}`
  }));
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const calculateMiningYield = (
  asteroid: Asteroid,
  miningPower: number,
  equippedTypes: AsteroidType[]
): number => {
  if (!equippedTypes.includes(asteroid.type)) return 0;
  return Math.floor(asteroid.baseYield * (miningPower / 100));
};