import React from 'react';
import { useGame } from '../context/GameContext';

export const GameLog: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Game Log</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {state.gameLogs.slice().reverse().map(log => (
          <div key={log.id} className="bg-gray-700 p-4 rounded-lg">
            <div className="font-semibold mb-2">Turn {log.turn}</div>
            <div className="space-y-2">
              {log.messages.map((message, index) => (
                <div key={index} className="text-gray-300">{message}</div>
              ))}
              
              {log.resourceChanges && Object.entries(log.resourceChanges).length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <div className="font-semibold mb-1">Resource Changes:</div>
                  {Object.entries(log.resourceChanges).map(([resource, amount]) => (
                    <div key={resource} className="flex justify-between text-sm">
                      <span className="capitalize">{resource}</span>
                      <span className={amount > 0 ? 'text-green-400' : 'text-red-400'}>
                        {amount > 0 ? '+' : ''}{amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {log.creditChange !== undefined && (
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <div className="flex justify-between">
                    <span>Credits</span>
                    <span className={log.creditChange > 0 ? 'text-green-400' : 'text-red-400'}>
                      {log.creditChange > 0 ? '+' : ''}{log.creditChange} CR
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};