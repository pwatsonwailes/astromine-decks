import { Ship, CombatState, CombatAction } from '../types/game';

export const calculateCombatRound = (
  combat: CombatState,
  attackerActions: Map<string, CombatAction>,
  defenderActions: Map<string, CombatAction>
): CombatState => {
  const updatedAttackerShips = [...combat.attackerShips];
  const updatedDefenderShips = [...combat.defenderShips];

  // Process attacks
  processAttacks(
    updatedAttackerShips.filter(s => attackerActions.get(s.id) === 'attack'),
    updatedDefenderShips,
    defenderActions
  );

  processAttacks(
    updatedDefenderShips.filter(s => defenderActions.get(s.id) === 'attack'),
    updatedAttackerShips,
    attackerActions
  );

  // Remove destroyed ships
  const finalAttackerShips = updatedAttackerShips.filter(s => s.health > 0);
  const finalDefenderShips = updatedDefenderShips.filter(s => s.health > 0);

  // Check for victory conditions
  let status = combat.status;
  let winner = combat.winner;

  if (finalDefenderShips.length === 0) {
    status = 'completed';
    winner = combat.attackerId;
  } else if (finalAttackerShips.length === 0) {
    status = 'completed';
    winner = combat.defenderId;
  }

  return {
    ...combat,
    attackerShips: finalAttackerShips,
    defenderShips: finalDefenderShips,
    turn: combat.turn + 1,
    status,
    winner
  };
};

const processAttacks = (
  attackingShips: Ship[],
  defendingShips: Ship[],
  defenderActions: Map<string, CombatAction>
) => {
  attackingShips.forEach(attacker => {
    const attackPower = attacker.equipment.weapon.reduce(
      (total, eq) => total + (eq.weaponPower || 0),
      0
    );

    // Distribute damage across defending ships
    const damage = attackPower / defendingShips.length;
    defendingShips.forEach(defender => {
      const isDefending = defenderActions.get(defender.id) === 'defend';
      const defense = defender.equipment.defense.reduce(
        (total, eq) => total + (eq.shieldPower || 0),
        0
      );

      const damageReduction = isDefending ? defense * 1.5 : defense;
      const finalDamage = Math.max(0, damage - damageReduction);
      
      defender.health = Math.max(0, defender.health - finalDamage);
    });
  });
};