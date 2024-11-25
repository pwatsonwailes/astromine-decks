import React from 'react';
import { useGame } from '../context/GameContext';
import { DiplomaticStatus as Status } from '../types/game';
import { HandshakeIcon, AlertTriangle, Swords, MinusCircle } from 'lucide-react';

interface DiplomaticStatusProps {
  corporationId: string;
  status: Status;
}

export const DiplomaticStatus: React.FC<DiplomaticStatusProps> = ({ corporationId, status }) => {
  const { state } = useGame();
  const corporation = state.corporations.find(c => c.id === corporationId);

  const getStatusIcon = () => {
    switch (status) {
      case 'friendly':
        return <HandshakeIcon className="text-green-500" />;
      case 'hostile':
        return <AlertTriangle className="text-orange-500" />;
      case 'war':
        return <Swords className="text-red-500" />;
      default:
        return <MinusCircle className="text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'friendly':
        return 'bg-green-900/50 text-green-200';
      case 'hostile':
        return 'bg-orange-900/50 text-orange-200';
      case 'war':
        return 'bg-red-900/50 text-red-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="text-sm capitalize">
        {status} - {corporation?.name}
      </span>
    </div>
  );
};