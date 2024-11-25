import React from 'react';
import { useGame } from '../context/GameContext';
import { DiplomaticAgreement } from '../types/game';
import { HandshakeIcon, Clock } from 'lucide-react';

interface AgreementCardProps {
  agreement: DiplomaticAgreement;
}

const AgreementCard: React.FC<AgreementCardProps> = ({ agreement }) => {
  const { state } = useGame();
  
  const partner = state.corporations.find(c => 
    agreement.parties.includes(c.id) && c.id !== state.player.id
  );

  const getStatusColor = () => {
    switch (agreement.status) {
      case 'active':
        return 'text-green-400';
      case 'broken':
        return 'text-red-400';
      case 'completed':
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-semibold capitalize">
            {agreement.type.replace('-', ' ')}
          </span>
          <div className="text-sm text-gray-300">
            with {partner?.name}
          </div>
        </div>
        <span className={`capitalize ${getStatusColor()}`}>
          {agreement.status}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Penalty</span>
          <span className="text-yellow-400">
            {agreement.terms.penalty} CR
          </span>
        </div>
        
        {agreement.terms.duration && (
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <Clock size={14} />
            <span>{agreement.terms.duration} turns</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const DiplomaticAgreements: React.FC = () => {
  const { state } = useGame();
  
  const activeAgreements = state.player.agreements.filter(a => 
    a.status === 'active'
  );

  if (activeAgreements.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <HandshakeIcon className="text-blue-500" />
        <h2 className="text-xl font-bold">Active Agreements</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeAgreements.map(agreement => (
          <AgreementCard key={agreement.id} agreement={agreement} />
        ))}
      </div>
    </div>
  );
};