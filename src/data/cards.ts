import { Card, GameState } from '../types/game';

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

      // Check asteroid type compatibility
      if (!state.player.equippedMiningTypes.includes(state.currentAsteroid.type)) {
        return state;
      }

      // Calculate mining results
      const updatedComposition = state.currentAsteroid.composition.map(comp => ({
        ...comp,
        amount: Math.max(0, comp.amount - Math.floor(50 * 0.1))
      }));

      // Update player's resources
      const newResources = { ...state.player.resources };
      updatedComposition.forEach((comp, index) => {
        const originalAmount = state.currentAsteroid!.composition[index].amount;
        const minedAmount = originalAmount - comp.amount;
        if (minedAmount > 0) {
          newResources[comp.resource] = (newResources[comp.resource] || 0) + minedAmount;
        }
      });
      
      return {
        ...state,
        currentAsteroid: {
          ...state.currentAsteroid,
          health: Math.max(0, state.currentAsteroid.health - 6),
          composition: updatedComposition
        },
        player: {
          ...state.player,
          resources: newResources
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

      // Calculate mining results with higher efficiency
      const updatedComposition = state.currentAsteroid.composition.map(comp => ({
        ...comp,
        amount: Math.max(0, comp.amount - Math.floor(75 * 0.1))
      }));

      // Update player's resources
      const newResources = { ...state.player.resources };
      updatedComposition.forEach((comp, index) => {
        const originalAmount = state.currentAsteroid!.composition[index].amount;
        const minedAmount = originalAmount - comp.amount;
        if (minedAmount > 0) {
          newResources[comp.resource] = (newResources[comp.resource] || 0) + minedAmount;
        }
      });
      
      return {
        ...state,
        currentAsteroid: {
          ...state.currentAsteroid,
          health: Math.max(0, state.currentAsteroid.health - 10),
          composition: updatedComposition
        },
        player: {
          ...state.player,
          resources: newResources
        }
      };
    }
  }
];