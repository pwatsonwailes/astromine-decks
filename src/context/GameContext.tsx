import React, { createContext, useContext, useReducer } from 'react';
import { GameState, Card, Corporation, Asteroid, Resource, Ship, Equipment, ShipClass } from '../types/game';
import { initialCards } from '../data/cards';
import { generateInitialAsteroids, shuffleDeck, createDeckWithUniqueIds } from '../utils/gameUtils';
import { createShip } from '../data/ships';
import { equipmentList } from '../data/equipment'

const createInitialCorporation = (id: string, name: string): Corporation => {
  const basicShip = createShip('prospector', id, name);
  const basicLaser = equipmentList.find(eq => eq.id === 'basic-mining-laser')!;
  
  return {
    id: 'player',
    name: 'Terra Mining Corp',
    health: 80,
    maxHealth: 80,
    credits: 200,
    shield: 0,
    resources: {
      silicates: 0,
      oxides: 0,
      sulfides: 0,
      iron: 0,
      nickel: 0,
      silicon: 0,
      magnesium: 0
    },
    equippedMiningTypes: ['C'],
    ships: [{
      ...basicShip,
      equipment: {
        ...basicShip.equipment,
        mining: [basicLaser]
      }
    }],
    hasAdvancedSpaceDock: false
  };
};

const generateShopCards = () => {
  return shuffleDeck([...initialCards])
    .slice(0, 3)
    .map(card => ({
      ...card,
      id: `shop-${crypto.randomUUID()}`,
      price: Math.floor(Math.random() * 30) + 20
    }));
};

const { deck: initialDeck, hand: initialHand } = (() => {
  const fullDeck = createDeckWithUniqueIds([...initialCards, ...initialCards, ...initialCards]);
  const shuffledDeck = shuffleDeck(fullDeck);
  return {
    hand: shuffledDeck.slice(0, 5),
    deck: shuffledDeck.slice(5)
  };
})();

const initialState: GameState = {
  player: createInitialCorporation('player', 'Terra Mining Corp'),
  opponent: createInitialCorporation('opponent', 'Lunar Industries'),
  asteroids: generateInitialAsteroids(5),
  deck: initialDeck,
  hand: initialHand,
  discardPile: [],
  energy: 3,
  maxEnergy: 3,
  turn: 1,
  shop: generateShopCards(),
  activeMiningOperations: []
};

type GameAction = 
  | { type: 'DRAW_CARD' }
  | { type: 'PLAY_CARD'; card: Card; targetAsteroidId?: string }
  | { type: 'END_TURN' }
  | { type: 'TAKE_DAMAGE'; amount: number }
  | { type: 'PURCHASE_CARD'; cardId: string }
  | { type: 'RECALL_MINING_OPERATION'; operationId: string }
  | { type: 'REFRESH_SHOP' }
  | { type: 'SELL_RESOURCE'; resource: Resource; amount: number; price: number }
  | { type: 'BUY_SHIP'; shipClass: ShipClass }
  | { type: 'SELL_SHIP'; shipId: string }
  | { type: 'BUY_EQUIPMENT'; equipment: Equipment; shipId: string }
  | { type: 'REMOVE_EQUIPMENT'; equipmentId: string; shipId: string }
  | { type: 'ASSIGN_SHIP'; shipId: string; asteroidId: string }
  | { type: 'RECALL_SHIP'; shipId: string }
  | { type: 'UPGRADE_SPACE_DOCK' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'BUY_SHIP': {
      const newShip = createShip(action.shipClass, state.player.id, state.player.name);
      const cost = newShip.cost;

      if (!state.player.hasAdvancedSpaceDock && 
          !['prospector', 'assault-fighter', 'scoutship'].includes(action.shipClass)) {
        return state;
      }
      
      if (state.player.credits < cost) return state;

      return {
        ...state,
        player: {
          ...state.player,
          credits: state.player.credits - cost,
          ships: [...state.player.ships, newShip]
        }
      };
    }

    case 'UPGRADE_SPACE_DOCK': {
      if (state.player.hasAdvancedSpaceDock || state.player.credits < 300) return state;

      return {
        ...state,
        player: {
          ...state.player,
          credits: state.player.credits - 300,
          hasAdvancedSpaceDock: true
        }
      };
    }

    case 'SELL_SHIP': {
      const ship = state.player.ships.find(s => s.id === action.shipId);
      if (!ship || state.player.ships.length <= 1) return state;

      return {
        ...state,
        player: {
          ...state.player,
          credits: state.player.credits + Math.floor(ship.cost * 0.5),
          ships: state.player.ships.filter(s => s.id !== action.shipId)
        }
      };
    }

    case 'BUY_EQUIPMENT': {
      const ship = state.player.ships.find(s => s.id === action.shipId);
      if (!ship || state.player.credits < action.equipment.cost) return state;

      const updatedShips = state.player.ships.map(s => {
        if (s.id === action.shipId) {
          return {
            ...s,
            equipment: {
              ...s.equipment,
              [action.equipment.type]: [
                ...s.equipment[action.equipment.type],
                action.equipment
              ]
            }
          };
        }
        return s;
      });

      return {
        ...state,
        player: {
          ...state.player,
          credits: state.player.credits - action.equipment.cost,
          ships: updatedShips
        }
      };
    }

    case 'REMOVE_EQUIPMENT': {
      const updatedShips = state.player.ships.map(ship => {
        if (ship.id === action.shipId) {
          return {
            ...ship,
            equipment: {
              ...ship.equipment,
              mining: ship.equipment.mining.filter(e => e.id !== action.equipmentId),
              defense: ship.equipment.defense.filter(e => e.id !== action.equipmentId),
              weapon: ship.equipment.weapon.filter(e => e.id !== action.equipmentId)
            }
          };
        }
        return ship;
      });

      return {
        ...state,
        player: {
          ...state.player,
          ships: updatedShips
        }
      };
    }

    case 'ASSIGN_SHIP': {
      const updatedShips = state.player.ships.map(ship => {
        if (ship.id === action.shipId) {
          return {
            ...ship,
            assignedAsteroidId: action.asteroidId
          };
        }
        return ship;
      });

      return {
        ...state,
        player: {
          ...state.player,
          ships: updatedShips
        }
      };
    }

    case 'RECALL_SHIP': {
      const updatedShips = state.player.ships.map(ship => {
        if (ship.id === action.shipId) {
          return {
            ...ship,
            assignedAsteroidId: undefined
          };
        }
        return ship;
      });

      return {
        ...state,
        player: {
          ...state.player,
          ships: updatedShips
        }
      };
    }

    // ... existing reducer cases ...
    case 'DRAW_CARD': {
      if (state.deck.length === 0) {
        if (state.discardPile.length === 0) {
          return state;
        }
        const shuffledDiscard = shuffleDeck(state.discardPile);
        return {
          ...state,
          deck: shuffledDiscard.slice(1),
          discardPile: [],
          hand: [...state.hand, shuffledDiscard[0]]
        };
      }
      return {
        ...state,
        deck: state.deck.slice(1),
        hand: [...state.hand, state.deck[0]]
      };
    }

    case 'PLAY_CARD': {
      if (action.card.type === 'mining' && action.targetAsteroidId) {
        const targetAsteroid = state.asteroids.find(a => a.id === action.targetAsteroidId);
        if (!targetAsteroid) return state;

        const operation = {
          cardId: action.card.id,
          card: action.card,
          asteroidId: action.targetAsteroidId,
          turnsActive: 0
        };

        return {
          ...state,
          hand: state.hand.filter(c => c.id !== action.card.id),
          activeMiningOperations: [...state.activeMiningOperations, operation],
          energy: state.energy - action.card.cost
        };
      }

      const newState = action.card.effect(state);
      return {
        ...newState,
        hand: state.hand.filter(c => c.id !== action.card.id),
        discardPile: [...state.discardPile, action.card],
        energy: state.energy - action.card.cost
      };
    }

    case 'SELL_RESOURCE': {
      const { resource, amount, price } = action;
      if (state.player.resources[resource] < amount) return state;

      return {
        ...state,
        player: {
          ...state.player,
          resources: {
            ...state.player.resources,
            [resource]: state.player.resources[resource] - amount
          },
          credits: state.player.credits + (amount * price)
        }
      };
    }

    case 'END_TURN': {
      let newState = { ...state };
      
      // Process mining operations
      newState.asteroids = newState.asteroids.map(asteroid => {
        const ships = state.player.ships.filter(ship => 
          ship.assignedAsteroidId === asteroid.id
        );

        if (asteroid.health > 0 && ships.length > 0) {
          const updatedComposition = [...asteroid.composition];
          
          ships.forEach(ship => {
            const totalMiningPower = ship.equipment.mining.reduce(
              (total, equip) => total + (equip.miningPower || 0), 0
            );

            if (totalMiningPower > 0) {
              updatedComposition.forEach(comp => {
                const minedAmount = Math.floor((totalMiningPower / 100) * comp.amount * 0.1);
                if (minedAmount > 0) {
                  newState.player.resources[comp.resource] += minedAmount;
                  comp.amount -= minedAmount;
                }
              });
              
              // Reduce asteroid health based on mining power
              asteroid.health = Math.max(0, asteroid.health - totalMiningPower);
            }
          });

          return {
            ...asteroid,
            composition: updatedComposition
          };
        }

        return asteroid;
      });

      // Generate new asteroids if needed
      if (newState.asteroids.filter(a => a.health > 0).length < 3) {
        newState.asteroids = [
          ...newState.asteroids,
          ...generateInitialAsteroids(2)
        ];
      }

      return {
        ...newState,
        energy: state.maxEnergy,
        turn: state.turn + 1
      };
    }

    case 'PURCHASE_CARD':
    case 'RECALL_MINING_OPERATION':
    case 'REFRESH_SHOP':
      // ... existing cases remain the same ...
      return state;

    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};