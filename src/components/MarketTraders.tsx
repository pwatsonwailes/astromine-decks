import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trader, Resource } from '../types/game';
import { resourceBaseValues } from '../data/resources';
import { Store, ArrowLeftRight, Timer, ShoppingCart } from 'lucide-react';

export const MarketTraders: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState<Record<string, number>>({});

  const calculatePrice = (baseValue: number, multiplier: number, volatility: number) => {
    const fluctuation = 1 + (Math.random() * 2 - 1) * volatility;
    return Math.round(baseValue * multiplier * fluctuation);
  };

  const handlePurchase = (traderId: string, resource: Resource, amount: number, price: number) => {
    const totalCost = amount * price;
    if (state.player.credits >= totalCost) {
      dispatch({
        type: 'TRADE_WITH_TRADER',
        traderId,
        resource,
        amount,
        totalCost
      });
      setPurchaseAmount({ ...purchaseAmount, [resource]: 0 });
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Store className="text-purple-400" />
            Market Traders
          </h2>
          <p className="text-gray-400">Trade with visiting merchants</p>
        </div>
        <div className="text-xl">Credits: {state.player.credits}</div>
      </div>

      {state.traders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.traders.map(trader => (
            <div key={trader.id} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{trader.name}</h3>
                  <p className="text-sm text-gray-400">{trader.description}</p>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Timer size={16} />
                  <span className="text-sm">{trader.turnsRemaining}</span>
                </div>
              </div>

              <div className="space-y-3">
                {trader.inventory.map(({ resource, amount, priceMultiplier, volatility }) => {
                  const price = calculatePrice(
                    resourceBaseValues[resource],
                    priceMultiplier,
                    volatility
                  );
                  
                  return (
                    <div key={resource} className="bg-gray-600/50 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="capitalize">{resource}</span>
                        <span className="text-green-400">{price} CR/unit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={amount}
                          value={purchaseAmount[resource] || 0}
                          onChange={(e) => setPurchaseAmount({
                            ...purchaseAmount,
                            [resource]: Math.min(parseInt(e.target.value) || 0, amount)
                          })}
                          className="bg-gray-700 border border-gray-600 rounded px-2 py-1 w-24 text-sm"
                        />
                        <button
                          onClick={() => handlePurchase(
                            trader.id,
                            resource,
                            purchaseAmount[resource] || 0,
                            price
                          )}
                          disabled={!purchaseAmount[resource] || state.player.credits < (purchaseAmount[resource] * price)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-sm"
                        >
                          <ShoppingCart size={14} />
                          Buy
                        </button>
                        <span className="text-sm text-gray-400">
                          Available: {amount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <ArrowLeftRight size={48} className="mx-auto mb-4 opacity-50" />
          <p>No traders currently in the system</p>
          <p className="text-sm">Check back in a few turns</p>
        </div>
      )}
    </div>
  );
};