import React, { createContext, useContext, useReducer } from 'react';
import { GameState, Card, Corporation, Ship, Equipment, ShipClass, Resource, DiplomaticAction, CombatAction } from '../types/game';
import { generateInitialAsteroids } from '../utils/gameUtils';
import { createShip, shipTemplates, shipBuildTimes } from '../data/ships';
import { equipmentList } from '../data/equipment';
import { generateTrader } from '../data/traders';
import { generateCorporation } from '../data/corporations';
import { evaluateDiplomaticProposal, determineAIAction, determineAICombatActions, processAITurn } from '../utils/aiUtils';
import { calculateCombatRound } from '../utils/combatUtils';

interface GameProviderProps {
  children: React.ReactNode;
  initialOpponents: number;
}

interface ShipBuildOrder {
  id: string;
  shipClass: ShipClass;
  turnsRemaining: number;
  totalTurns: number;
  cost: number;
}

interface GameLog {
  id: string;
  turn: number;
  messages: string[];
  resourceChanges?: Partial<Record<Resource, number>>;
  creditChange?: number;
}

const createInitialCorporation = (id: string, name: string): Corporation => {
  const basicShip = createShip('prospector', id, name);
  const basicLaser = equipmentList.find(eq => eq.id === 'basic-mining-laser')!;
  
  return {
    id,
    name,
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
    hasAdvancedSpaceDock: false,
    diplomaticStatus: {},
    agreements: [],
    isPlayer: id === 'player',
    personality: id !== 'player' ? {
      aggression: Math.random(),
      cooperation: Math.random(),
      greed: Math.random()
    } : undefined
  };
};

const createInitialState = (opponentCount: number): GameState => {
  // Generate corporations
  const playerCorp = generateCorporation('player', true);
  const aiCorps = Array.from({ length: opponentCount }, (_, i) => 
    generateCorporation(`corp-${i + 1}`, false, ['player'])
  );
  
  // Generate asteroids (7-11 per corporation)
  const asteroidsPerCorp = Math.floor(Math.random() * 5) + 7;
  const totalAsteroids = asteroidsPerCorp * (opponentCount + 1);

  return {
    player: playerCorp,
    corporations: [playerCorp, ...aiCorps],
    asteroids: generateInitialAsteroids(totalAsteroids),
    deck: [],
    hand: [],
    discardPile: [],
    energy: 3,
    maxEnergy: 3,
    turn: 1,
    activeMiningOperations: [],
    traders: [generateTrader()],
    shipBuildQueue: [],
    gameLogs: [],
    market: {
      prices: [],
      lastRefresh: Date.now()
    },
    diplomaticProposals: [],
    activeCombats: []
  };
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
  | { type: 'UPGRADE_SPACE_DOCK' }
  | { type: 'START_SHIP_BUILD'; shipClass: ShipClass }
  | { type: 'PROGRESS_SHIP_BUILD' }
  | { type: 'TRADE_WITH_TRADER'; traderId: string; resource: Resource; amount: number; totalCost: number }
  | { type: 'UPDATE_TRADERS' }
  | { 
      type: 'PROPOSE_DIPLOMATIC_ACTION';
      action: DiplomaticAction;
      targetCorporationId: string;
      terms: {
        penalty: number;
        duration?: number;
        turnsToAct?: number;
      };
    }
  | { type: 'ACCEPT_DIPLOMATIC_PROPOSAL'; proposalId: string }
  | { type: 'REJECT_DIPLOMATIC_PROPOSAL'; proposalId: string }
  | {
      type: 'INITIATE_COMBAT';
      attackerId: string;
      defenderId: string;
      attackerShips: Ship[];
      defenderShips: Ship[];
    }
  | {
      type: 'PERFORM_COMBAT_ACTION';
      combatId: string;
      action: CombatAction;
      shipIds: string[];
    };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'END_TURN': {
      let newState = { ...state };
      const prevResources = { ...state.player.resources };
      const newResources = { ...state.player.resources };
      
      // Process mining operations
      newState.asteroids = newState.asteroids.map(asteroid => {
        const ships = state.player.ships.filter(ship => 
          ship.assignedAsteroidId === asteroid.id
        );

        if (asteroid.health <= 0 || ships.length === 0) {
          return asteroid;
        }

        const updatedComposition = asteroid.composition.map(comp => ({
          ...comp,
          amount: comp.amount
        }));

        ships.forEach(ship => {
          const totalMiningPower = ship.equipment.mining.reduce(
            (total, equip) => total + (equip.miningPower || 0), 0
          );

          if (totalMiningPower > 0) {
            const miningEfficiency = totalMiningPower * 0.1;

            updatedComposition.forEach(comp => {
              const minedAmount = Math.min(
                Math.floor(miningEfficiency),
                comp.amount
              );

              if (minedAmount > 0) {
                newResources[comp.resource] = (newResources[comp.resource] || 0) + minedAmount;
                comp.amount -= minedAmount;
              }
            });
          }
        });

        const newHealth = Math.max(0, asteroid.health - ships.length);

        return {
          ...asteroid,
          health: newHealth,
          composition: updatedComposition
        };
      });

      // Process ship building
      const { completedShips, remainingQueue } = newState.shipBuildQueue.reduce(
        (acc, order) => {
          if (order.turnsRemaining <= 1) {
            acc.completedShips.push(createShip(order.shipClass, state.player.id, state.player.name));
          } else {
            acc.remainingQueue.push({
              ...order,
              turnsRemaining: order.turnsRemaining - 1
            });
          }
          return acc;
        },
        { completedShips: [] as Ship[], remainingQueue: [] as ShipBuildOrder[] }
      );

      // Calculate resource changes for the log
      const resourceChanges: Partial<Record<Resource, number>> = {};
      Object.entries(newResources).forEach(([resource, amount]) => {
        const diff = amount - (prevResources[resource as Resource] || 0);
        if (diff !== 0) {
          resourceChanges[resource as Resource] = diff;
        }
      });

      // Create turn log
      const turnLog: GameLog = {
        id: crypto.randomUUID(),
        turn: state.turn,
        messages: [
          ...completedShips.map(ship => `Completed construction of ${ship.name}`),
          ...Object.entries(resourceChanges).map(([resource, amount]) => 
            `Mined ${amount} ${resource}`
          )
        ],
        resourceChanges
      };

      // Generate new asteroids if needed
      if (newState.asteroids.filter(a => a.health > 0).length < 3) {
        newState.asteroids = [
          ...newState.asteroids,
          ...generateInitialAsteroids(2)
        ];
      }

      newState.traders = newState.traders
        .map(trader => ({
          ...trader,
          turnsRemaining: trader.turnsRemaining - 1
        }))
        .filter(trader => trader.turnsRemaining > 0);

      // Check for new traders
      if (Math.random() < 0.2) { // 20% chance each turn
        newState.traders.push(generateTrader());
      }

      state.corporations
      .filter(corp => !corp.isPlayer)
      .forEach(aiCorp => {
        newState = processAITurn(newState, aiCorp);
      });

      return {
        ...newState,
        player: {
          ...newState.player,
          resources: newResources,
          ships: [...newState.player.ships, ...completedShips]
        },
        shipBuildQueue: remainingQueue,
        gameLogs: [...newState.gameLogs, turnLog],
        energy: state.maxEnergy,
        turn: state.turn + 1
      };
    }

    case 'PROPOSE_DIPLOMATIC_ACTION': {
      const targetCorp = state.corporations.find(c => c.id === action.targetCorporationId);
      if (!targetCorp) return state;

      const accepted = targetCorp.isPlayer ? false : evaluateDiplomaticProposal(
        state,
        state.player,
        targetCorp,
        action.action,
        action.terms
      );

      if (!targetCorp.isPlayer && accepted) {
        // AI immediately accepts
        const agreement = {
          id: crypto.randomUUID(),
          type: action.action,
          parties: [state.player.id, targetCorp.id] as [string, string],
          terms: action.terms,
          status: 'active' as const,
          createdAt: Date.now()
        };

        return {
          ...state,
          corporations: state.corporations.map(corp =>
            corp.id === state.player.id || corp.id === targetCorp.id
              ? { ...corp, agreements: [...corp.agreements, agreement] }
              : corp
          )
        };
      }

      // Add to proposals if target is player
      if (targetCorp.isPlayer) {
        return {
          ...state,
          diplomaticProposals: [...state.diplomaticProposals, {
            id: crypto.randomUUID(),
            action: action.action,
            fromCorporationId: state.player.id,
            toCorporationId: targetCorp.id,
            terms: action.terms,
            createdAt: Date.now()
          }]
        };
      }

      return state;
    }

    case 'TRADE_WITH_TRADER': {
      const trader = state.traders.find(t => t.id === action.traderId);
      if (!trader) return state;

      const updatedTraders = state.traders.map(t => {
        if (t.id === action.traderId) {
          return {
            ...t,
            inventory: t.inventory.map(item => {
              if (item.resource === action.resource) {
                return {
                  ...item,
                  amount: item.amount - action.amount
                };
              }
              return item;
            })
          };
        }
        return t;
      });

      return {
        ...state,
        traders: updatedTraders,
        player: {
          ...state.player,
          credits: state.player.credits - action.totalCost,
          resources: {
            ...state.player.resources,
            [action.resource]: (state.player.resources[action.resource] || 0) + action.amount
          }
        }
      };
    }

    case 'START_SHIP_BUILD': {
      const template = shipTemplates[action.shipClass];
      const buildTime = shipBuildTimes[action.shipClass];
      
      if (state.player.credits < template.cost) return state;

      const buildOrder: ShipBuildOrder = {
        id: crypto.randomUUID(),
        shipClass: action.shipClass,
        turnsRemaining: buildTime,
        totalTurns: buildTime,
        cost: template.cost
      };

      return {
        ...state,
        player: {
          ...state.player,
          credits: state.player.credits - template.cost
        },
        shipBuildQueue: [...state.shipBuildQueue, buildOrder],
        gameLogs: [...state.gameLogs, {
          id: crypto.randomUUID(),
          turn: state.turn,
          messages: [`Started construction of ${action.shipClass}`],
          creditChange: -template.cost
        }]
      };
    }

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

    case 'INITIATE_COMBAT': {
      const newCombat: CombatState = {
        id: crypto.randomUUID(),
        attackerId: action.attackerId,
        defenderId: action.defenderId,
        attackerShips: action.attackerShips,
        defenderShips: action.defenderShips,
        turn: 1,
        status: 'active'
      };

      return {
        ...state,
        activeCombats: [...state.activeCombats, newCombat]
      };
    }

    case 'PERFORM_COMBAT_ACTION': {
      const combat = state.activeCombats.find(c => c.id === action.combatId);
      if (!combat) return state;

      const isAttacker = combat.attackerId === state.player.id;
      const aiActions = determineAICombatActions(
        isAttacker ? combat.defenderShips : combat.attackerShips
      );

      const playerActions = new Map(
        action.shipIds.map(id => [id, action.action])
      );

      const updatedCombat = calculateCombatRound(
        combat,
        isAttacker ? playerActions : aiActions,
        isAttacker ? aiActions : playerActions
      );

      return {
        ...state,
        activeCombats: state.activeCombats.map(c =>
          c.id === action.combatId ? updatedCombat : c
        ),
        corporations: state.corporations.map(corp => {
          const isAttacker = corp.id === combat.attackerId;
          const isDefender = corp.id === combat.defenderId;
          
          if (!isAttacker && !isDefender) return corp;

          const updatedShips = isAttacker
            ? updatedCombat.attackerShips
            : updatedCombat.defenderShips;

          return {
            ...corp,
            ships: corp.ships.map(ship => {
              const combatShip = updatedShips.find(s => s.id === ship.id);
              return combatShip || ship;
            })
          };
        })
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

    default:
      return state;
  }
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export const GameProvider: React.FC<GameProviderProps> = ({ children, initialOpponents }) => {
  const [state, dispatch] = useReducer(gameReducer, initialOpponents, createInitialState);

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