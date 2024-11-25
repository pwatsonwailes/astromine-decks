import React from 'react';
import { useGame } from '../context/GameContext';
import { ShipClass, ShipSpeed, ShipRange, EquipmentSlot } from '../types/game';
import { shipTemplates } from '../data/ships';
import { Shield, Sword, Pickaxe } from 'lucide-react';

const slotIcons: Record<EquipmentSlot, React.ReactNode> = {
  mining: <Pickaxe size={16} />,
  defense: <Shield size={16} />,
  weapon: <Sword size={16} />
};

export const SpaceDock: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleUpgradeSpaceDock = () => {
    dispatch({ type: 'UPGRADE_SPACE_DOCK' });
  };

  const getShipSpeedColor = (speed: ShipSpeed) => {
    switch (speed) {
      case 'fast': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'slow': return 'text-red-400';
    }
  };

  const getShipRangeColor = (range: ShipRange) => {
    switch (range) {
      case 'long': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'short': return 'text-red-400';
    }
  };

  const handleBuildShip = (shipClass: ShipClass) => {
    const template = shipTemplates[shipClass];
    if (state.player.credits >= template.cost) {
      dispatch({ type: 'BUY_SHIP', shipClass });
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Space Dock</h2>
          <p className="text-gray-400">
            {state.player.hasAdvancedSpaceDock 
              ? 'Advanced Space Dock - All ship classes available'
              : 'Basic Space Dock - Limited to basic ships'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xl">Credits: {state.player.credits}</div>
          {!state.player.hasAdvancedSpaceDock && (
            <button
              onClick={handleUpgradeSpaceDock}
              disabled={state.player.credits < 300}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded"
            >
              Upgrade Space Dock (300 CR)
            </button>
          )}
        </div>
      </div>

      {/* Ship Construction */}
      <div>
        <h3 className="text-xl font-bold mb-4">Ship Construction</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.entries(shipTemplates) as [ShipClass, Ship][])
            .filter(([className]) => 
              state.player.hasAdvancedSpaceDock || 
              ['prospector', 'assault-fighter', 'scoutship'].includes(className)
            )
            .map(([className, template]) => (
              <div key={className} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="capitalize font-semibold">
                    {className.replace('-', ' ')}
                  </span>
                  <span>{template.cost} credits</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex gap-4">
                    {(Object.entries(template.maxEquipmentSlots) as [EquipmentSlot, number][])
                      .map(([slot, max]) => (
                        <div key={slot} className="flex items-center gap-1">
                          {slotIcons[slot]}
                          <span>{max}</span>
                        </div>
                      ))}
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className={getShipSpeedColor(template.speed)}>
                      {template.speed} speed
                    </span>
                    <span className={getShipRangeColor(template.range)}>
                      {template.range} range
                    </span>
                    {template.carrierCapacity && (
                      <span className="text-blue-400">
                        Carries {template.carrierCapacity} ships
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleBuildShip(className)}
                  disabled={state.player.credits < template.cost}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
                >
                  Build Ship
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};