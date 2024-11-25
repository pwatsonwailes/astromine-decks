import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Ship, Equipment, EquipmentSlot } from '../types/game';
import { equipmentList } from '../data/equipment';
import { Shield, Sword, Pickaxe } from 'lucide-react';

const slotIcons: Record<EquipmentSlot, React.ReactNode> = {
  mining: <Pickaxe size={16} />,
  defense: <Shield size={16} />,
  weapon: <Sword size={16} />
};

export const ShipManagement: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);

  const handleSellShip = (ship: Ship) => {
    if (state.player.ships.length > 1) {
      dispatch({ type: 'SELL_SHIP', shipId: ship.id });
    }
  };

  const handleBuyEquipment = (equipment: Equipment) => {
    if (selectedShip && state.player.credits >= equipment.cost) {
      dispatch({
        type: 'BUY_EQUIPMENT',
        equipment,
        shipId: selectedShip.id
      });
    }
  };

  const handleRemoveEquipment = (equipment: Equipment) => {
    if (selectedShip) {
      dispatch({
        type: 'REMOVE_EQUIPMENT',
        equipmentId: equipment.id,
        shipId: selectedShip.id
      });
    }
  };

  const getAvailableEquipment = () => {
    if (!selectedShip) return [];
    return equipmentList.filter(equipment => 
      equipment.requiredClass.includes(selectedShip.class) &&
      selectedShip.equipment[equipment.type].length < selectedShip.maxEquipmentSlots[equipment.type]
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Ship Management</h2>
        <div className="text-xl">Credits: {state.player.credits}</div>
      </div>

      {/* Ship List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {state.player.ships.map(ship => (
          <div
            key={ship.id}
            onClick={() => setSelectedShip(ship)}
            className={`bg-gray-700 p-4 rounded-lg cursor-pointer transition-colors
              ${selectedShip?.id === ship.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{ship.name}</h3>
              <span className="text-sm text-gray-300 capitalize">{ship.class}</span>
            </div>
            <div className="mb-2">
              <div className="h-2 bg-gray-600 rounded-full">
                <div
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${(ship.health / ship.maxHealth) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex gap-4 mb-2">
              {(Object.entries(ship.maxEquipmentSlots) as [EquipmentSlot, number][]).map(([slot, max]) => (
                <div key={slot} className="flex items-center gap-1">
                  {slotIcons[slot]}
                  <span>{ship.equipment[slot].length}/{max}</span>
                </div>
              ))}
            </div>
            {state.player.ships.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSellShip(ship);
                }}
                className="text-sm px-2 py-1 bg-red-600 hover:bg-red-700 rounded"
              >
                Sell ({Math.floor(ship.cost * 0.5)} credits)
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Equipment Management */}
      {selectedShip && (
        <div>
          <h3 className="text-xl font-bold mb-4">Equipment Management</h3>
          
          {/* Current Equipment */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Installed Equipment</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.entries(selectedShip.equipment) as [EquipmentSlot, Equipment[]][]).map(([slot, items]) => (
                <div key={slot} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {slotIcons[slot]}
                    <span className="capitalize">{slot}</span>
                  </div>
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center mb-2">
                      <span>{item.name}</span>
                      <button
                        onClick={() => handleRemoveEquipment(item)}
                        className="text-sm px-2 py-1 bg-red-600 hover:bg-red-700 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Available Equipment */}
          <div>
            <h4 className="font-semibold mb-2">Available Equipment</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getAvailableEquipment().map(equipment => (
                <div key={equipment.id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>{equipment.name}</span>
                    <span>{equipment.cost} credits</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{equipment.description}</p>
                  <button
                    onClick={() => handleBuyEquipment(equipment)}
                    disabled={state.player.credits < equipment.cost}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
                  >
                    Buy & Install
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Ship Build Queue */}
      {state.shipBuildQueue.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Construction Queue</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.shipBuildQueue.map(order => (
              <div key={order.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="capitalize font-semibold">
                    {order.shipClass.replace('-', ' ')}
                  </span>
                  <span className="text-sm">
                    {order.turnsRemaining} turns remaining
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                    style={{
                      width: `${((order.totalTurns - order.turnsRemaining) / order.totalTurns) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};