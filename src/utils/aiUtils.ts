import { Ship, Corporation, DiplomaticAction, GameState, CombatAction } from '../types/game';

export const evaluateDiplomaticProposal = (
  state: GameState,
  proposingCorp: Corporation,
  targetCorp: Corporation,
  action: DiplomaticAction,
  terms: { penalty: number }
): boolean => {
  if (!targetCorp.personality) return false;

  const { aggression, cooperation, greed } = targetCorp.personality;
  const baseAcceptanceChance = cooperation * 0.7 + (1 - aggression) * 0.3;

  switch (action) {
    case 'non-aggression': {
      const penaltyFactor = Math.min(terms.penalty / targetCorp.credits, 1) * 0.3;
      return Math.random() < (baseAcceptanceChance + penaltyFactor);
    }

    case 'joint-combat': {
      const targetCorpStrength = calculateCorporationStrength(proposingCorp);
      const ownStrength = calculateCorporationStrength(targetCorp);
      const strengthRatio = Math.min(targetCorpStrength / ownStrength, 1);
      
      return Math.random() < (aggression * 0.4 + cooperation * 0.4 + strengthRatio * 0.2);
    }

    case 'peace': {
      const warExhaustion = (targetCorp.maxHealth - targetCorp.health) / targetCorp.maxHealth;
      const greedFactor = terms.penalty > 0 ? greed * 0.3 : 0;
      
      return Math.random() < ((1 - aggression) * 0.4 + warExhaustion * 0.3 + greedFactor);
    }

    default:
      return false;
  }
};

export const determineAICombatActions = (ships: Ship[]): Map<string, CombatAction> => {
  const actions = new Map<string, CombatAction>();

  ships.forEach(ship => {
    const attackPower = ship.equipment.weapon.reduce((sum, eq) => sum + (eq.weaponPower || 0), 0);
    const defensePower = ship.equipment.defense.reduce((sum, eq) => sum + (eq.shieldPower || 0), 0);
    const healthPercentage = ship.health / ship.maxHealth;

    // Retreat if critically damaged
    if (healthPercentage < 0.2) {
      actions.set(ship.id, 'retreat');
      return;
    }

    // Defend if low health but not critical
    if (healthPercentage < 0.4) {
      actions.set(ship.id, 'defend');
      return;
    }

    // Attack if strong offensive capabilities
    if (attackPower > defensePower * 1.5) {
      actions.set(ship.id, 'attack');
      return;
    }

    // Defend if strong defensive capabilities
    if (defensePower > attackPower * 1.5) {
      actions.set(ship.id, 'defend');
      return;
    }

    // Default to balanced approach based on health
    actions.set(ship.id, healthPercentage > 0.7 ? 'attack' : 'defend');
  });

  return actions;
};

export const calculateCorporationStrength = (corp: Corporation): number => {
  return corp.ships.reduce((strength, ship) => {
    const weaponPower = ship.equipment.weapon.reduce((total, eq) => 
      total + (eq.weaponPower || 0), 0
    );
    const defensePower = ship.equipment.defense.reduce((total, eq) =>
      total + (eq.shieldPower || 0), 0
    );
    return strength + weaponPower + defensePower;
  }, 0);
};

export const determineAIAction = (state: GameState, aiCorp: Corporation) => {
  if (!aiCorp.personality) return null;
  const { aggression, cooperation, greed } = aiCorp.personality;
  
  // Evaluate current situation
  const isUnderAttack = aiCorp.health < aiCorp.maxHealth;
  const hasStrongEconomy = aiCorp.credits > 500;
  const isStrongest = state.corporations.every(corp => 
    corp.id === aiCorp.id || calculateCorporationStrength(aiCorp) >= calculateCorporationStrength(corp)
  );

  // Possible strategies based on personality and situation
  if (isUnderAttack && cooperation > 0.7) {
    // Seek peace when peaceful personality is under attack
    return {
      action: 'peace' as DiplomaticAction,
      targetCorpId: Object.entries(aiCorp.diplomaticStatus)
        .find(([_, status]) => status === 'war')?.[0]
    };
  }

  if (hasStrongEconomy && aggression > 0.7 && isStrongest) {
    // Aggressive expansion when strong
    const potentialTarget = state.corporations.find(corp =>
      corp.id !== aiCorp.id && 
      aiCorp.diplomaticStatus[corp.id] !== 'war' &&
      calculateCorporationStrength(corp) < calculateCorporationStrength(aiCorp)
    );

    if (potentialTarget) {
      return {
        action: 'joint-combat' as DiplomaticAction,
        targetCorpId: potentialTarget.id
      };
    }
  }

  if (greed > 0.7 && !hasStrongEconomy) {
    // Focus on economic growth when greedy and poor
    return {
      action: 'non-aggression' as DiplomaticAction,
      targetCorpId: Object.entries(aiCorp.diplomaticStatus)
        .find(([_, status]) => status === 'hostile')?.[0]
    };
  }

  // Consider breaking agreements if beneficial
  const activeAgreements = aiCorp.agreements.filter(a => a.status === 'active');
  for (const agreement of activeAgreements) {
    const partner = state.corporations.find(c => 
      agreement.parties.includes(c.id) && c.id !== aiCorp.id
    );
    if (!partner) continue;

    const partnerStrength = calculateCorporationStrength(partner);
    const ownStrength = calculateCorporationStrength(aiCorp);

    // Break agreement if much stronger than partner and aggressive
    if (ownStrength > partnerStrength * 2 && aggression > 0.8 && aiCorp.credits > agreement.terms.penalty * 2) {
      return {
        action: 'break_agreement',
        agreementId: agreement.id
      };
    }
  }

  return null;
};

export const processAITurn = (state: GameState, aiCorp: Corporation) => {
  const action = determineAIAction(state, aiCorp);
  if (!action) return state;

  // Implementation will vary based on the action type
  switch (action.action) {
    case 'peace':
    case 'non-aggression':
    case 'joint-combat':
      return {
        ...state,
        diplomaticProposals: [...state.diplomaticProposals, {
          id: crypto.randomUUID(),
          action: action.action,
          fromCorporationId: aiCorp.id,
          toCorporationId: action.targetCorpId!,
          terms: {
            penalty: Math.floor(aiCorp.credits * 0.2), // 20% of current credits
            duration: 10,
            turnsToAct: action.action === 'joint-combat' ? 3 : undefined
          },
          createdAt: Date.now()
        }]
      };

    case 'break_agreement':
      const agreement = aiCorp.agreements.find(a => a.id === action.agreementId);
      if (!agreement) return state;

      return {
        ...state,
        corporations: state.corporations.map(corp => {
          if (corp.id === aiCorp.id) {
            return {
              ...corp,
              credits: corp.credits - agreement.terms.penalty,
              agreements: corp.agreements.map(a =>
                a.id === action.agreementId
                  ? { ...a, status: 'broken' }
                  : a
              )
            };
          }
          if (agreement.parties.includes(corp.id)) {
            return {
              ...corp,
              credits: corp.credits + agreement.terms.penalty,
              agreements: corp.agreements.map(a =>
                a.id === action.agreementId
                  ? { ...a, status: 'broken' }
                  : a
              )
            };
          }
          return corp;
        })
      };

    default:
      return state;
  }
};