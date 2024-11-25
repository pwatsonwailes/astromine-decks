import { Card, GameState } from '../types/game';
import { calculateMiningYield } from '../utils/gameUtils';

export const initialCards: Card[] = [
  {
    id: 'basic-mining-laser',
    name: 'Basic Mining Laser',
    type: 'mining',
    cost: 1,
    description: 'Deal 6 damage to the asteroid. Compatible with C-type asteroids.',
    rarity: 'common',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421789f10?auto=format&fit=crop&q=80&w=1600',
    asteroidTypeRequirement: 'C',
    miningPower: 50,
    effect: (state: GameState) => {
      if (!state.currentAsteroid) return state;
      const miningYield = calculateMiningYield(
        state.currentAsteroid,
        50,
        state.player.equippedMiningTypes
      );
      
      return {
        ...state,
        currentAsteroid: {
          ...state.currentAsteroid,
          health: state.currentAsteroid.health - 6
        },
        player: {
          ...state.player,
          credits: state.player.credits + miningYield
        }
      };
    }
  },
  {
    id: 's-type-converter',
    name: 'S-Type Mining Kit',
    type: 'equipment',
    cost: 3,
    description: 'Equip your mining ships for S-type asteroids.',
    rarity: 'uncommon',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600',
    effect: (state: GameState) => ({
      ...state,
      player: {
        ...state.player,
        equippedMiningTypes: [...state.player.equippedMiningTypes, 'S']
      }
    })
  },
  {
    id: 'm-type-converter',
    name: 'M-Type Mining Kit',
    type: 'equipment',
    cost: 5,
    description: 'Equip your mining ships for valuable M-type asteroids.',
    rarity: 'rare',
    image: 'https://images.unsplash.com/photo-1581093458791-9d42e3c1e798?auto=format&fit=crop&q=80&w=1600',
    effect: (state: GameState) => ({
      ...state,
      player: {
        ...state.player,
        equippedMiningTypes: [...state.player.equippedMiningTypes, 'M']
      }
    })
  },
  {
    id: 'advanced-mining-laser',
    name: 'Advanced Mining Laser',
    type: 'mining',
    cost: 2,
    description: 'Deal 10 damage to the asteroid. 75% mining efficiency.',
    rarity: 'uncommon',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421789f10?auto=format&fit=crop&q=80&w=1600',
    miningPower: 75,
    effect: (state: GameState) => {
      if (!state.currentAsteroid) return state;
      const miningYield = calculateMiningYield(
        state.currentAsteroid,
        75,
        state.player.equippedMiningTypes
      );
      
      return {
        ...state,
        currentAsteroid: {
          ...state.currentAsteroid,
          health: state.currentAsteroid.health - 10
        },
        player: {
          ...state.player,
          credits: state.player.credits + miningYield
        }
      };
    }
  }
];