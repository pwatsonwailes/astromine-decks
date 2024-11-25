import React from 'react';
import { CombatCard as CombatCardType } from '../types/game';
import { Shield, Sword, Target, Wrench } from 'lucide-react';

interface CombatCardProps {
  card: CombatCardType;
  isPlayable: boolean;
  onPlay?: () => void;
}

export const CombatCard: React.FC<CombatCardProps> = ({ card, isPlayable, onPlay }) => {
  const getTypeIcon = () => {
    switch (card.type) {
      case 'attack':
        return <Sword className="text-red-400" />;
      case 'defense':
        return <Shield className="text-blue-400" />;
      case 'tactical':
        return <Target className="text-yellow-400" />;
      case 'support':
        return <Wrench className="text-green-400" />;
    }
  };

  const getTypeColor = () => {
    switch (card.type) {
      case 'attack':
        return 'bg-red-900/50 border-red-700';
      case 'defense':
        return 'bg-blue-900/50 border-blue-700';
      case 'tactical':
        return 'bg-yellow-900/50 border-yellow-700';
      case 'support':
        return 'bg-green-900/50 border-green-700';
    }
  };

  return (
    <div
      onClick={isPlayable ? onPlay : undefined}
      className={`relative w-48 h-64 rounded-lg border-2 ${getTypeColor()}
        transition-transform hover:scale-105 ${isPlayable ? 'cursor-pointer' : 'opacity-50'}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-white">{card.name}</h3>
          <span className="bg-gray-800 text-white px-2 py-1 rounded-full text-sm">
            {card.cost}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          {getTypeIcon()}
          <span className="text-sm capitalize">{card.type}</span>
        </div>

        <p className="text-sm text-gray-300 mb-4">{card.description}</p>

        {card.effect.damage && (
          <div className="flex items-center gap-2 text-red-400">
            <Sword size={16} />
            <span>Damage: {card.effect.damage}</span>
          </div>
        )}

        {card.effect.shield && (
          <div className="flex items-center gap-2 text-blue-400">
            <Shield size={16} />
            <span>Shield: {card.effect.shield}</span>
          </div>
        )}

        {card.rarity !== 'common' && (
          <div className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded-full bg-gray-800">
            {card.rarity}
          </div>
        )}
      </div>
    </div>
  );
};