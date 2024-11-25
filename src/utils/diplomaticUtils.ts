import { Corporation, DiplomaticAction, DiplomaticStatus } from '../types/game';

export const calculatePenaltyRange = (
  proposingCorp: Corporation,
  targetCorp: Corporation,
  action: DiplomaticAction
): [number, number] => {
  const baseMin = Math.min(proposingCorp.credits, targetCorp.credits) * 0.1;
  const baseMax = Math.min(proposingCorp.credits, targetCorp.credits) * 0.3;

  switch (action) {
    case 'non-aggression':
      return [baseMin, baseMax];
      
    case 'joint-combat':
      return [baseMin * 1.5, baseMax * 1.5];
      
    case 'peace':
      // Higher penalties for peace treaties
      return [baseMin * 2, baseMax * 2];
      
    default:
      return [baseMin, baseMax];
  }
};

export const updateDiplomaticStatus = (
  currentStatus: DiplomaticStatus,
  action: DiplomaticAction,
  success: boolean
): DiplomaticStatus => {
  if (!success) {
    // Failed diplomatic actions worsen relations
    switch (currentStatus) {
      case 'friendly':
        return 'neutral';
      case 'neutral':
        return 'hostile';
      case 'hostile':
        return 'war';
      default:
        return currentStatus;
    }
  }

  // Successful diplomatic actions
  switch (action) {
    case 'non-aggression':
      return currentStatus === 'war' ? 'hostile' : 'neutral';
      
    case 'peace':
      return 'neutral';
      
    case 'joint-combat':
      return 'friendly';
      
    default:
      return currentStatus;
  }
};