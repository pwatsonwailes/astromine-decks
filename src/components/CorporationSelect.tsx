import React, { useState } from 'react';
import { Building2, Users } from 'lucide-react';

interface CorporationSelectProps {
  onSelect: (count: number) => void;
}

export const CorporationSelect: React.FC<CorporationSelectProps> = ({ onSelect }) => {
  const [count, setCount] = useState(2);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <Building2 size={48} className="mx-auto text-blue-500" />
          <h2 className="text-2xl font-bold">Select Opponents</h2>
          <p className="text-gray-400">
            Choose how many corporations you'll compete against
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCount(Math.max(1, count - 1))}
              className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
            >
              -
            </button>
            <div className="flex items-center gap-2">
              <Users size={20} className="text-blue-500" />
              <span className="text-2xl font-bold">{count}</span>
            </div>
            <button
              onClick={() => setCount(Math.min(5, count + 1))}
              className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
            >
              +
            </button>
          </div>

          <div className="text-center text-gray-400">
            Total Corporations: {count + 1}
          </div>
        </div>

        <button
          onClick={() => onSelect(count)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};