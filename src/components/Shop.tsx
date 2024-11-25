import React from 'react';
import { useGame } from '../context/GameContext';
import { Card as CardComponent } from './Card';

export const Shop: React.FC = () => {
  const { state, dispatch } = useGame();

  const handlePurchase = (cardId: string) => {
    dispatch({ type: 'PURCHASE_CARD', cardId });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Shop</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {state.shop.map(card => (
          <div key={card.id} className="flex flex-col items-center">
            <CardComponent card={card} isShopItem />
            <button
              onClick={() => handlePurchase(card.id)}
              disabled={state.player.credits < (card.price ?? 0)}
              className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded"
            >
              Buy ({card.price} CR)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};