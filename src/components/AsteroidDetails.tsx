import React from 'react';
import { Asteroid, Ship } from '../types/game';
import { getMarketPrice } from '../data/resources';
import { Shield, Sword, Pickaxe } from 'lucide-react';

interface AsteroidDetailsProps {
  asteroid: Asteroid;
  ships: Ship[];
  onClose: () => void;
}

export const AsteroidDetails: React.FC<AsteroidDetailsProps> = ({
  asteroid,
  ships,
  onClose
}) => {
  const totalValue = asteroid.composition.reduce((sum, { amount, baseValue }) => 
    sum + (amount * getMarketPrice(baseValue)), 0
  );

  const groupedShips = ships.reduce((groups, ship) => {
    const key = ship.ownerName;
    return {
      ...groups,
      [key]: [...(groups[key] || []), ship]
    };
  }, {} as Record<string, Ship[]>);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{asteroid.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-sm
                ${asteroid.type === 'C' ? 'bg-gray-600' :
                  asteroid.type === 'S' ? 'bg-blue-600' :
                  'bg-purple-600'}`}>
                Type-{asteroid.type}
              </span>
              <span className="text-green-400">
                Estimated Value: {totalValue} CR
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Composition */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Composition</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {asteroid.composition.map(({ resource, amount, baseValue }) => {
              const currentPrice = getMarketPrice(baseValue);
              return (
                <div key={resource} className="bg-gray-700 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="capitalize">{resource}</span>
                    <span className="text-green-400">{currentPrice} CR/unit</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-300">
                    <span>Amount: {amount}</span>
                    <span>Total: {amount * currentPrice} CR</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Present Ships */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Present Ships</h3>
          {Object.entries(groupedShips).map(([ownerName, ships]) => (
            <div key={ownerName} className="mb-4">
              <h4 className="text-md font-medium mb-2 capitalize">
                {ownerName} Ships
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ships.map(ship => (
                  <div key={ship.id} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>{ship.name}</span>
                      <span className="text-sm text-gray-400 capitalize">
                        {ship.class}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Pickaxe size={14} />
                        <span className="text-sm">
                          {ship.equipment.mining.reduce((sum, eq) => 
                            sum + (eq.miningPower || 0), 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield size={14} />
                        <span className="text-sm">
                          {ship.equipment.defense.reduce((sum, eq) => 
                            sum + (eq.shieldPower || 0), 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sword size={14} />
                        <span className="text-sm">
                          {ship.equipment.weapon.reduce((sum, eq) => 
                            sum + (eq.weaponPower || 0), 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {ships.length === 0 && (
            <div className="text-gray-400 text-center">
              No ships currently at this asteroid
            </div>
          )}
        </div>
      </div>
    </div>
  );
};