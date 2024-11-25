import React from 'react';
import { useGame } from '../context/GameContext';
import { Card } from './Card';

export const ActiveMiningOperations: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleRecall = (operationId: string) => {
    dispatch({ type: 'RECALL_MINING_OPERATION', operationId });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Active Mining Operations</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {state.activeMiningOperations.map(operation => (
          <div key={operation.cardId} className="flex flex-col items-center">
            <Card card={operation.card} />
            <button
              onClick={() => handleRecall(operation.cardId)}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Recall
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};