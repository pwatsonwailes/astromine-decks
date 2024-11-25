import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Corporation, DiplomaticAction, DiplomaticStatus } from '../types/game';
import { HandshakeIcon, Swords, HandHeart } from 'lucide-react';

const SUGGESTED_PENALTIES = [1000, 2000, 5000, 10000];

interface DiplomacyPanelProps {
  corporation: Corporation;
}

export const DiplomacyPanel: React.FC<DiplomacyPanelProps> = ({ corporation }) => {
  const { state, dispatch } = useGame();
  const [selectedAction, setSelectedAction] = useState<DiplomaticAction | null>(null);
  const [proposedPenalty, setProposedPenalty] = useState(SUGGESTED_PENALTIES[0]);

  const getStatusColor = (status: DiplomaticStatus) => {
    switch (status) {
      case 'friendly': return 'text-green-500';
      case 'hostile': return 'text-orange-500';
      case 'war': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const handleProposeDeal = () => {
    if (!selectedAction || !corporation) return;

    dispatch({
      type: 'PROPOSE_DIPLOMATIC_ACTION',
      action: selectedAction,
      targetCorporationId: corporation.id,
      terms: {
        penalty: proposedPenalty,
        duration: 10, // Default 10 turns
        turnsToAct: 3, // Default 3 turns for joint-combat
      }
    });
  };

  const activeAgreements = corporation.agreements.filter(a => 
    a.status === 'active' && a.parties.includes(state.player.id)
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{corporation.name}</h2>
          <div className={`flex items-center gap-2 ${
            getStatusColor(corporation.diplomaticStatus[state.player.id])
          }`}>
            <span>Status: {corporation.diplomaticStatus[state.player.id]}</span>
          </div>
        </div>
      </div>

      {/* Active Agreements */}
      {activeAgreements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Active Agreements</h3>
          <div className="space-y-3">
            {activeAgreements.map(agreement => (
              <div key={agreement.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="capitalize">{agreement.type}</span>
                  <span className="text-yellow-400">
                    Penalty: {agreement.terms.penalty} CR
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Agreement */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Propose Agreement</h3>
        
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedAction('non-aggression')}
            className={`p-3 rounded-lg flex flex-col items-center gap-2
              ${selectedAction === 'non-aggression' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            <HandshakeIcon size={24} />
            <span>Non-Aggression</span>
          </button>
          
          <button
            onClick={() => setSelectedAction('joint-combat')}
            className={`p-3 rounded-lg flex flex-col items-center gap-2
              ${selectedAction === 'joint-combat' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            <Swords size={24} />
            <span>Joint Combat</span>
          </button>
          
          <button
            onClick={() => setSelectedAction('peace')}
            className={`p-3 rounded-lg flex flex-col items-center gap-2
              ${selectedAction === 'peace' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            <HandHeart size={24} />
            <span>Peace Treaty</span>
          </button>
        </div>

        {selectedAction && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Proposed Penalty
              </label>
              <select
                value={proposedPenalty}
                onChange={(e) => setProposedPenalty(Number(e.target.value))}
                className="w-full bg-gray-700 rounded-lg p-2"
              >
                {SUGGESTED_PENALTIES.map(amount => (
                  <option key={amount} value={amount}>
                    {amount} CR
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleProposeDeal}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
            >
              Propose Deal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};