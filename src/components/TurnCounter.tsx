import React from 'react';
import { Clock } from 'lucide-react';

interface TurnCounterProps {
  turn: number;
  isAnimating: boolean;
}

export const TurnCounter: React.FC<TurnCounterProps> = ({ turn, isAnimating }) => {
  return (
    <div className={`flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg transition-all duration-300
      ${isAnimating ? 'scale-110 bg-blue-900' : ''}`}>
      <Clock size={20} className={`${isAnimating ? 'animate-spin' : ''}`} />
      <span className="font-bold">Turn {turn}</span>
    </div>
  );
};