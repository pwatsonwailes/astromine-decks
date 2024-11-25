import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { TradeGoodCategory, TradeGood } from '../types/game';
import { getGoodsByCategory } from '../utils/marketUtils';
import { Package, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const categories: { id: TradeGoodCategory; label: string }[] = [
  { id: 'basic_resources', label: 'Basic Resources' },
  { id: 'luxury_goods', label: 'Luxury Goods' },
  { id: 'industrial', label: 'Industrial' },
  { id: 'medical', label: 'Medical' },
  { id: 'technology', label: 'Technology' },
  { id: 'ship_parts', label: 'Ship Parts' }
];

export const MarketView: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<TradeGoodCategory>('basic_resources');
  const [purchaseAmount, setPurchaseAmount] = useState<Record<string, number>>({});

  const handlePurchase = (goodId: string, amount: number) => {
    const price = state.market.prices.find(p => p.goodId === goodId);
    if (!price) return;

    const totalCost = price.buyPrice * amount;
    if (state.player.credits >= totalCost) {
      dispatch({
        type: 'PURCHASE_TRADE_GOOD',
        goodId,
        amount,
        totalCost
      });
      setPurchaseAmount({ ...purchaseAmount, [goodId]: 0 });
    }
  };

  const handleSell = (goodId: string, amount: number) => {
    const price = state.market.prices.find(p => p.goodId === goodId);
    if (!price) return;

    dispatch({
      type: 'SELL_TRADE_GOOD',
      goodId,
      amount,
      price: price.sellPrice
    });
  };

  const goods = getGoodsByCategory(selectedCategory);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="text-purple-400" />
            Commodity Market
          </h2>
          <p className="text-gray-400">Trade goods and resources</p>
        </div>
        <div className="text-xl">Credits: {state.player.credits}</div>
      </div>

      {/* Category Selection */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap
              ${selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Market Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goods.map(good => {
          const price = state.market.prices.find(p => p.goodId === good.id);
          if (!price) return null;

          return (
            <div key={good.id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{good.name}</h3>
                  <p className="text-sm text-gray-400">{good.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  good.rarity === 'rare' ? 'bg-purple-900 text-purple-200' :
                  good.rarity === 'uncommon' ? 'bg-blue-900 text-blue-200' :
                  'bg-gray-600 text-gray-200'
                }`}>
                  {good.rarity}
                </span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-400" />
                  <span>Buy: {price.buyPrice} CR</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown size={16} className="text-red-400" />
                  <span>Sell: {price.sellPrice} CR</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-yellow-400" />
                <span className="text-sm">Supply: {price.supply}</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max={price.supply}
                  value={purchaseAmount[good.id] || 0}
                  onChange={(e) => setPurchaseAmount({
                    ...purchaseAmount,
                    [good.id]: Math.min(parseInt(e.target.value) || 0, price.supply)
                  })}
                  className="bg-gray-800 border border-gray-600 rounded px-2 py-1 w-20"
                />
                <button
                  onClick={() => handlePurchase(good.id, purchaseAmount[good.id] || 0)}
                  disabled={!purchaseAmount[good.id] || state.player.credits < (purchaseAmount[good.id] * price.buyPrice)}
                  className="flex-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
                >
                  Buy
                </button>
                <button
                  onClick={() => handleSell(good.id, 1)}
                  disabled={!state.player.inventory?.[good.id]}
                  className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded"
                >
                  Sell
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};