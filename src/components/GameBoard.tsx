import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Card } from './Card';
import { StatusPanel } from './StatusPanel';
import { ResourcePanel } from './ResourcePanel';
import { Shop } from './Shop';
import { ShipManagement } from './ShipManagement';
import { SpaceDock } from './SpaceDock';
import { AsteroidMap } from './AsteroidMap';
import { Trading } from './Trading';
import { LayoutDashboard, Rocket, CreditCard, Mountain, Boxes, Warehouse, TrendingUp } from 'lucide-react';

type Tab = 'overview' | 'asteroids' | 'ships' | 'spacedock' | 'shop' | 'trading' | 'hand';

export const GameBoard: React.FC = () => {
  const { state, dispatch } = useGame();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const handleEndTurn = () => {
    dispatch({ type: 'END_TURN' });
    if (state.shop.length < 3) {
      dispatch({ type: 'REFRESH_SHOP' });
    }
  };

  const TabButton: React.FC<{ tab: Tab; icon: React.ReactNode; label: string }> = ({
    tab,
    icon
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
        ${activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
    >
      {icon}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <TabButton tab="overview" icon={<LayoutDashboard size={20} />} label="Overview" />
          <TabButton tab="asteroids" icon={<Mountain size={20} />} label="Asteroids" />
          <TabButton tab="ships" icon={<Rocket size={20} />} label="Ships" />
          <TabButton tab="spacedock" icon={<Warehouse size={20} />} label="Space Dock" />
          <TabButton tab="shop" icon={<CreditCard size={20} />} label="Shop" />
          <TabButton tab="trading" icon={<TrendingUp size={20} />} label="Trading" />
          <TabButton tab="hand" icon={<Boxes size={20} />} label="Hand" />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatusPanel corporation={state.player} isPlayer={true} />
              <ResourcePanel resources={state.player.resources} />
            </div>
          )}

          {activeTab === 'asteroids' && <AsteroidMap />}
          
          {activeTab === 'ships' && <ShipManagement />}
          
          {activeTab === 'spacedock' && <SpaceDock />}
          
          {activeTab === 'shop' && <Shop />}

          {activeTab === 'trading' && <Trading />}

          {activeTab === 'hand' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Hand ({state.hand.length} / 5)</h2>
                <div className="flex items-center gap-4">
                  <span className="text-blue-300">Energy: {state.energy} / {state.maxEnergy}</span>
                  <button
                    onClick={handleEndTurn}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    End Turn
                  </button>
                </div>
              </div>
              <div className="flex justify-center gap-4 flex-wrap">
                {state.hand?.map(card => (
                  <Card key={card.id} card={card} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Turn Controls - Always Visible */}
        {activeTab !== 'hand' && (
          <div className="fixed bottom-4 right-4 flex items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-lg">
            <span className="text-blue-300">Energy: {state.energy} / {state.maxEnergy}</span>
            <button
              onClick={handleEndTurn}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              End Turn
            </button>
          </div>
        )}
      </div>
    </div>
  );
};