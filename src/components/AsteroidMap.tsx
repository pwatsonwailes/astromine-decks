import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Asteroid, Ship } from '../types/game';
import { ArrowUpDown, Ship as ShipIcon } from 'lucide-react';
import { AsteroidDetails } from './AsteroidDetails';

type SortField = 'name' | 'type' | 'health' | 'difficulty';
type SortDirection = 'asc' | 'desc';

export const AsteroidMap: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showDetails, setShowDetails] = useState<Asteroid | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAsteroids = [...state.asteroids].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'name':
        return a.name.localeCompare(b.name) * modifier;
      case 'type':
        return a.type.localeCompare(b.type) * modifier;
      case 'health':
        return ((a.health / a.maxHealth) - (b.health / b.maxHealth)) * modifier;
      case 'difficulty':
        return (a.difficulty - b.difficulty) * modifier;
      default:
        return 0;
    }
  });

  const getAssignedShips = (asteroidId: string): Ship[] => {
    return state.player.ships.filter(ship => ship.assignedAsteroidId === asteroidId);
  };

  const handleAssignShip = (asteroid: Asteroid) => {
    setSelectedAsteroid(asteroid);
  };

  const handleShipSelect = (shipId: string) => {
    if (!selectedAsteroid) return;
    dispatch({ type: 'ASSIGN_SHIP', shipId, asteroidId: selectedAsteroid.id });
    setSelectedAsteroid(null);
  };

  const handleRecallShip = (shipId: string) => {
    dispatch({ type: 'RECALL_SHIP', shipId });
  };

  const getAvailableShips = () => {
    return state.player.ships.filter(ship => !ship.assignedAsteroidId);
  };

  const handleRowClick = (asteroid: Asteroid) => {
    setShowDetails(asteroid);
  };

  const SortHeader: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
    <th
      className="px-4 py-2 cursor-pointer hover:bg-gray-700"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown size={16} className={sortField === field ? 'opacity-100' : 'opacity-50'} />
      </div>
    </th>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Asteroid Field</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <SortHeader field="name" label="Name" />
              <SortHeader field="type" label="Type" />
              <SortHeader field="health" label="Status" />
              <SortHeader field="difficulty" label="Complexity" />
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAsteroids.map(asteroid => {
              const assignedShips = getAssignedShips(asteroid.id);
              return (
                <tr 
                  key={asteroid.id} 
                  className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                  onClick={() => handleRowClick(asteroid)}
                >
                  <td className="px-4 py-3">{asteroid.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-sm
                      ${asteroid.type === 'C' ? 'bg-gray-600' :
                        asteroid.type === 'S' ? 'bg-blue-600' :
                        'bg-purple-600'}`}>
                      Type-{asteroid.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-green-500 rounded-full h-2"
                          style={{ width: `${(asteroid.health / asteroid.maxHealth) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">
                        {Math.floor((asteroid.health / asteroid.maxHealth) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {Array.from({ length: asteroid.difficulty }).map((_, i) => (
                        <span key={i} className="w-2 h-2 bg-yellow-500 rounded-full" />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {assignedShips.length > 0 ? (
                      <div className="space-y-2">
                        {assignedShips.map(ship => (
                          <div key={ship.id} className="flex items-center gap-2">
                            <ShipIcon size={16} />
                            <span className="text-sm">{ship.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRecallShip(ship.id);
                              }}
                              className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                            >
                              Recall
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">Unclaimed</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignShip(asteroid);
                      }}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                    >
                      Send Ship
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Ship Assignment Modal */}
      {selectedAsteroid && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Assign Ship to {selectedAsteroid.name}</h3>
            
            <div className="space-y-3 mb-4">
              {getAvailableShips().length > 0 ? (
                getAvailableShips().map(ship => (
                  <div
                    key={ship.id}
                    className="flex items-center justify-between bg-gray-700 p-3 rounded"
                  >
                    <div>
                      <div className="font-semibold">{ship.name}</div>
                      <div className="text-sm text-gray-300">
                        Mining Power: {ship.equipment.mining.reduce((total, eq) => total + (eq.miningPower || 0), 0)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleShipSelect(ship.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                    >
                      Select
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400">No ships available</div>
              )}
            </div>

            <button
              onClick={() => setSelectedAsteroid(null)}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Asteroid Details Modal */}
      {showDetails && (
        <AsteroidDetails
          asteroid={showDetails}
          ships={getAssignedShips(showDetails.id)}
          onClose={() => setShowDetails(null)}
        />
      )}
    </div>
  );
};