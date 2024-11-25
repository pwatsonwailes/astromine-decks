import React from 'react';
import { useGame } from '../context/GameContext';
import { Resource } from '../types/game';
import { resourceBaseValues, getMarketPrice } from '../data/resources';
import { ArrowDownToLine } from 'lucide-react';

export const Trading: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleSellResource = (resource: Resource, amount: number) => {
    if (state.player.resources[resource] >= amount) {
      const price = getMarketPrice(resourceBaseValues[resource]);
      dispatch({ 
        type: 'SELL_RESOURCE', 
        resource,
        amount,
        price
      });
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Resource Trading</h2>
          <p className="text-gray-400">Market prices fluctuate with each transaction</p>
        </div>
        <div className="text-xl">Credits: {state.player.credits}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.entries(state.player.resources) as [Resource, number][])
          .filter(([_, amount]) => amount > 0)
          .map(([resource, amount]) => {
            const currentPrice = getMarketPrice(resourceBaseValues[resource]);
            return (
              <div key={resource} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="capitalize font-semibold">{resource}</span>
                  <span className="text-green-400">{currentPrice} CR/unit</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span>Available: {amount}</span>
                  <span>Value: {amount * currentPrice} CR</span>
                </div>
                <div className="flex gap-2">
                  {[1, 5, 10, amount].map((sellAmount) => (
                    sellAmount <= amount && (
                      <button
                        key={sellAmount}
                        onClick={() => handleSellResource(resource, sellAmount)}
                        className="flex-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm flex items-center justify-center gap-1"
                      >
                        <ArrowDownToLine size={14} />
                        Sell {sellAmount === amount ? 'All' : sellAmount}
                      </button>
                    )
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      {Object.values(state.player.resources).every(amount => amount === 0) && (
        <div className="text-center text-gray-400 mt-4">
          No resources available for trading
        </div>
      )}
    </div>
  );
};