import React from 'react';
import { useGame } from '../context/GameContext';
import { Card } from './Card';
import { StatusPanel } from './StatusPanel';
import { ResourcePanel } from './ResourcePanel';
import { Shop } from './Shop';
import { ShipManagement } from './ShipManagement';
import { AsteroidMap } from './AsteroidMap';

export const GameBoard: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleEndTurn = () => {
    dispatch({ type: 'END_TURN' });
    if (state.shop.length < 3) {
      dispatch({ type: 'REFRESH_SHOP' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Status Panels */}
          <div className="col-span-12 lg:col-span-3">
            <StatusPanel corporation={state.player} isPlayer={true} />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <AsteroidMap />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <ResourcePanel resources={state.player.resources} />
          </div>

          {/* Ship Management */}
          <div className="col-span-12">
            <ShipManagement />
          </div>

          {/* Shop */}
          <div className="col-span-12">
            <Shop />
          </div>

          {/* Hand */}
          <div className="col-span-12">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Hand ({state.hand.length} / 5)</h2>
              <div className="flex justify-center gap-4 flex-wrap">
                {state.hand?.map(card => (
                  <Card key={card.id} card={card} />
                ))}
              </div>
            </div>
          </div>

          {/* Game Controls */}
          <div className="col-span-12 flex justify-center mt-6">
            <button
              onClick={handleEndTurn}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              End Turn ({state.energy} Energy Left)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};