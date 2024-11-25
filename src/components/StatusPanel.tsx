import React from 'react';
import { Corporation, DiplomaticStatus } from '../types/game';
import { Shield, Heart, Coins, Users } from 'lucide-react';

interface StatusPanelProps {
  corporation: Corporation;
  isPlayer: boolean;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ corporation, isPlayer }) => {
  const getStatusColor = (status: DiplomaticStatus) => {
    switch (status) {
      case 'friendly': return 'text-green-500';
      case 'hostile': return 'text-orange-500';
      case 'war': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${isPlayer ? 'border-l-4 border-blue-500' : ''}`}>
      <h2 className="text-xl font-bold mb-4">{corporation.name}</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Heart className="text-red-500" />
          <div className="flex-1 bg-gray-700 rounded-full h-4">
            <div 
              className="bg-red-500 rounded-full h-4"
              style={{ width: `${(corporation.health / corporation.maxHealth) * 100}%` }}
            />
          </div>
          <span className="text-sm">{corporation.health}/{corporation.maxHealth}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Shield className="text-blue-500" />
          <span className="text-sm">{corporation.shield}</span>
        </div>

        <div className="flex items-center gap-3">
          <Coins className="text-yellow-500" />
          <span className="text-sm">{corporation.credits} CR</span>
        </div>

        {!isPlayer && (
          <div className="flex items-center gap-3">
            <Users className={getStatusColor(corporation.diplomaticStatus[corporation.id])} />
            <span className="text-sm capitalize">
              {corporation.diplomaticStatus[corporation.id]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};