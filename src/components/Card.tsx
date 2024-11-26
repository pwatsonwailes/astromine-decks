import React from 'react';
import { Card as CardType } from '../types/game';
import { useGame } from '../context/GameContext';

interface CardProps {
  card: CardType;
  isShopItem?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, isShopItem = false }) => {
  const { state, dispatch } = useGame();
  const canPlay = !isShopItem && state.energy >= card.cost;

  const handleClick = () => {
    if (isShopItem || !canPlay) return;
    dispatch({ type: 'PLAY_CARD', card });
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative w-48 h-64 rounded-lg shadow-lg transition-transform hover:scale-105 cursor-pointer 
        ${!isShopItem && canPlay ? 'bg-gray-700' : 'bg-gray-800 opacity-75'}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-white">{card.name}</h3>
          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
            {card.cost}
          </span>
        </div>
        <p className="text-sm text-gray-300 mb-2">{card.description}</p>
        <div className="flex justify-between items-center">
          <span className={`text-xs px-2 py-1 rounded-full ${
            card.type === 'attack' ? 'bg-red-900 text-red-100' :
            card.type === 'defense' ? 'bg-blue-900 text-blue-100' :
            card.type === 'mining' ? 'bg-yellow-900 text-yellow-100' :
            card.type === 'equipment' ? 'bg-purple-900 text-purple-100' :
            'bg-green-900 text-green-100'
          }`}>
            {card.type}
          </span>
          {card.asteroidTypeRequirement && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-200">
              Type-{card.asteroidTypeRequirement}
            </span>
          )}
        </div>
        {card.miningPower && (
          <div className="mt-2 text-sm text-yellow-300">
            Mining Power: {card.miningPower}
          </div>
        )}
      </div>
    </div>
  );
};