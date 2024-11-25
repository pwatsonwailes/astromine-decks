import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Ship, CombatCard as CombatCardType } from '../types/game';
import { CombatCard } from './CombatCard';
import { Shield, Sword, Target, Wrench } from 'lucide-react';

export const CombatView: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [selectedCard, setSelectedCard] = useState<CombatCardType | null>(null);

  if (!state.activeCombat) return null;

  const { playerEnergy, maxEnergy, playerShips, enemyShips } = state.activeCombat;

  const canPlayCard = (card: CombatCardType, ship: Ship) => {
    if (playerEnergy < card.cost) return false;

    if (card.requirements) {
      if (card.requirements.shipClass && 
          !card.requirements.shipClass.includes(ship.class)) {
        return false;
      }

      const weaponPower = ship.equipment.weapon.reduce(
        (sum, eq) => sum + (eq.weaponPower || 0), 0
      );
      if (card.requirements.minWeaponPower && 
          weaponPower < card.requirements.minWeaponPower) {
        return false;
      }

      const shieldPower = ship.equipment.defense.reduce(
        (sum, eq) => sum + (eq.shieldPower || 0), 0
      );
      if (card.requirements.minShieldPower && 
          shieldPower < card.requirements.minShieldPower) {
        return false;
      }
    }

    return true;
  };

  const handlePlayCard = (card: CombatCardType) => {
    if (!selectedShip) return;

    dispatch({
      type: 'PLAY_COMBAT_CARD',
      card,
      shipId: selectedShip.id,
      targetShipId: selectedCard?.type === 'attack' ? selectedCard.id : undefined
    });

    setSelectedCard(null);
    setSelectedShip(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Combat</h2>
        <div className="flex items-center gap-4">
          <span>Energy: {playerEnergy}/{maxEnergy}</span>
          <span>Turn: {state.activeCombat.turn}</span>
        </div>
      </div>

      {/* Enemy Ships */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Enemy Forces</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enemyShips.map(ship => (
            <div
              key={ship.id}
              onClick={() => selectedCard?.type === 'attack' && setSelectedShip(ship)}
              className={`bg-gray-700 p-4 rounded-lg ${
                selectedCard?.type === 'attack' ? 'cursor-pointer hover:bg-gray-600' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{ship.name}</span>
                <span className="text-sm capitalize">{ship.class}</span>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Shield size={16} className="text-blue-400" />
                  <span>{ship.equipment.defense.reduce((sum, eq) => 
                    sum + (eq.shieldPower || 0), 0
                  )}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sword size={16} className="text-red-400" />
                  <span>{ship.equipment.weapon.reduce((sum, eq) => 
                    sum + (eq.weaponPower || 0), 0
                  )}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Player Ships */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Your Forces</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playerShips.map(ship => (
            <div
              key={ship.id}
              onClick={() => setSelectedShip(ship)}
              className={`bg-gray-700 p-4 rounded-lg cursor-pointer
                ${selectedShip?.id === ship.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{ship.name}</span>
                <span className="text-sm capitalize">{ship.class}</span>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Shield size={16} className="text-blue-400" />
                  <span>{ship.equipment.defense.reduce((sum, eq) => 
                    sum + (eq.shieldPower || 0), 0
                  )}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sword size={16} className="text-red-400" />
                  <span>{ship.equipment.weapon.reduce((sum, eq) => 
                    sum + (eq.weaponPower || 0), 0
                  )}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Combat Hand */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Combat Cards</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {state.combatHand.map(card => (
            <CombatCard
              key={card.id}
              card={card}
              isPlayable={selectedShip ? canPlayCard(card, selectedShip) : false}
              onPlay={() => handlePlayCard(card)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};