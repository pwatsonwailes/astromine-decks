import { Asteroid, Resource, AsteroidType, AsteroidComposition } from '../types/game';
import { resourceBaseValues } from '../data/resources';

const asteroidNames = [
  'Ceres Prime', 'Vesta Major', 'Pallas-IX', 'Hygiea Belt', 
  'Psyche Core', 'Eros Fragment', 'Ida Cluster'
];

const asteroidTypeComposition: Record<AsteroidType, Resource[]> = {
  'C': ['silicates', 'oxides', 'sulfides'],
  'M': ['iron', 'nickel'],
  'S': ['iron', 'silicon', 'magnesium']
};

// Map dimensions
export const MAP_WIDTH = 2000;
export const MAP_HEIGHT = 1500;
export const VIEWPORT_WIDTH = 800;
export const VIEWPORT_HEIGHT = 600;

const generateComposition = (type: AsteroidType, difficulty: number): AsteroidComposition[] => {
  const resources = asteroidTypeComposition[type];
  return resources.map(resource => ({
    resource,
    amount: Math.floor(Math.random() * difficulty * 50) + 20,
    baseValue: resourceBaseValues[resource]
  }));
};

export const generateAsteroid = (difficulty: number): Asteroid => {
  const type = selectAsteroidType(difficulty);
  const health = 20 + difficulty * 10;
  
  return {
    id: crypto.randomUUID(),
    name: asteroidNames[Math.floor(Math.random() * asteroidNames.length)],
    health,
    maxHealth: health,
    composition: generateComposition(type, difficulty),
    difficulty,
    type,
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