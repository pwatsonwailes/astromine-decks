import React, { createContext, useContext, useReducer } from 'react';
import { GameState, Card, Corporation, Asteroid, Ship, Equipment, ShipClass } from '../types/game';
import { initialCards } from '../data/cards';
import { generateInitialAsteroids, shuffleDeck, createDeckWithUniqueIds } from '../utils/gameUtils';
import { createShip } from '../data/ships';

const initialCorporation: Corporation = {
  id: 'player',
  name: 'Terra Mining Corp',
  health: 80,
  maxHealth: 80,
  credits: 200,
  shield: 0,
  resources: {
    iron: 0,
    titanium: 0,
    platinum: 0,
    water: 0,
    helium3: 0
  },
  equippedMiningTypes: ['C'],
  ships: [createShip('basic')] // Start with one basic ship
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
  player: initialCorporation,
  opponent: {
    ...initialCorporation,
    id: 'opponent',
    name: 'Lunar Industries',
    ships: []
  },
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
  | { type: 'BUY_SHIP'; shipClass: ShipClass }
  | { type: 'SELL_SHIP'; shipId: string }
  | { type: 'BUY_EQUIPMENT'; equipment: Equipment; shipId: string }
  | { type: 'REMOVE_EQUIPMENT'; equipmentId: string; shipId: string }
  | { type: 'ASSIGN_SHIP'; shipId: string; asteroidId: string }
  | { type: 'RECALL_SHIP'; shipId: string };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'BUY_SHIP': {
      const newShip = createShip(action.shipClass);
      const cost = newShip.cost;

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

    case 'END_TURN': {
      let newState = { ...state };
      
      newState.asteroids = newState.asteroids.map(asteroid => {
        const ships = state.player.ships.filter(ship => 
          ship.assignedAsteroidId === asteroid.id
        );

        ships.forEach(ship => {
          const totalMiningPower = ship.equipment.mining.reduce(
            (total, equip) => total + (equip.miningPower || 0), 0
          );
          asteroid.health = Math.max(0, asteroid.health - totalMiningPower);
        });

        return asteroid;
      });

      if (newState.asteroids.filter(a => a.health > 0).length < 3) {
        newState.asteroids = [
          ...newState.asteroids,
          ...generateInitialAsteroids(2)
        ];
      }

      const cardsToDraw = 5 - newState.hand.length;
      for (let i = 0; i < cardsToDraw; i++) {
        newState = gameReducer(newState, { type: 'DRAW_CARD' });
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