import React from 'react';
import { useGame } from '../context/GameContext';
import { CombatState } from '../types/game';
import { Trophy, Skull } from 'lucide-react';

interface CombatResolutionProps {
  combat: CombatState;
  onClose: () => void;
}

export const CombatResolution: React.FC<CombatResolutionProps> = ({ combat, onClose }) => {
  const { state } = useGame();
  
  const winningCorp = state.corporations.find(c => c.id === combat.winner);
  const losingCorp = state.corporations.find(c => 
    c.id === (combat.winner === combat.attackerId ? combat.defenderId : combat.attackerId)
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="text-center mb-6">
          {combat.winner === state.player.id ? (
            <Trophy size={48} className="mx-auto text-yellow-400 mb-2" />
          ) : (
            <Skull size={48} className="mx-auto text-red-400 mb-2" />
          )}
          <h2 className="text-2xl font-bold">
            {winningCorp?.name} Victorious!
          </h2>
          <p className="text-gray-400 mt-2">
            {losingCorp?.name} has been defeated
          </p>
        </div>

        {combat.rewards && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Spoils of War</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Credits</span>
                <span className="text-yellow-400">
                  +{combat.rewards.credits} CR
                </span>
              </div>
              {Object.entries(combat.rewards.resources).map(([resource, amount]) => (
                <div key={resource} className="flex justify-between">
                  <span className="capitalize">{resource}</span>
                  <span className="text-green-400">+{amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
};