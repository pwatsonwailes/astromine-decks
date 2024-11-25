import React from 'react';
import { useGame } from '../context/GameContext';
import { HandshakeIcon, XCircle, CheckCircle } from 'lucide-react';

export const DiplomaticProposals: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleAccept = (proposalId: string) => {
    dispatch({ type: 'ACCEPT_DIPLOMATIC_PROPOSAL', proposalId });
  };

  const handleReject = (proposalId: string) => {
    dispatch({ type: 'REJECT_DIPLOMATIC_PROPOSAL', proposalId });
  };

  if (state.diplomaticProposals.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <HandshakeIcon className="text-blue-500" />
        <h2 className="text-xl font-bold">Diplomatic Proposals</h2>
      </div>

      <div className="space-y-4">
        {state.diplomaticProposals.map(proposal => {
          const fromCorp = state.corporations.find(c => c.id === proposal.fromCorporationId);
          
          return (
            <div key={proposal.id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{fromCorp?.name}</div>
                  <div className="text-sm text-gray-300 capitalize">
                    Proposes: {proposal.action.replace('-', ' ')}
                  </div>
                  <div className="mt-2 text-yellow-400">
                    Penalty: {proposal.terms.penalty} CR
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(proposal.id)}
                    className="p-2 bg-green-600 hover:bg-green-700 rounded-lg"
                  >
                    <CheckCircle size={20} />
                  </button>
                  <button
                    onClick={() => handleReject(proposal.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};