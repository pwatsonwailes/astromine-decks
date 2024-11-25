import { TradeGood, MarketPrice } from '../types/game';
import { tradeGoods } from '../data/tradeGoods';

const PRICE_UPDATE_INTERVAL = 1000 * 60 * 5; // 5 minutes
const MARKUP_FACTOR = 1.2; // 20% markup on buy prices

export const calculateMarketPrices = (lastPrices: MarketPrice[]): MarketPrice[] => {
  const currentTime = Date.now();

  return tradeGoods.map(good => {
    const lastPrice = lastPrices.find(p => p.goodId === good.id);
    
    // Only update prices after interval has passed
    if (lastPrice && currentTime - lastPrice.lastUpdate < PRICE_UPDATE_INTERVAL) {
      return lastPrice;
    }

    // Calculate new base price with random fluctuation
    const fluctuation = 1 + (Math.random() * 2 - 1) * good.volatility;
    const basePrice = Math.round(good.baseValue * fluctuation);
    
    // Buy price is higher than sell price
    const sellPrice = basePrice;
    const buyPrice = Math.round(basePrice * MARKUP_FACTOR);

    // Randomize supply
    const supply = Math.floor(Math.random() * 100) + 50;

    return {
      goodId: good.id,
      buyPrice,
      sellPrice,
      lastUpdate: currentTime,
      supply
    };
  });
};

export const getTradeGood = (id: string): TradeGood | undefined => {
  return tradeGoods.find(good => good.id === id);
};

export const getGoodsByCategory = (category: string): TradeGood[] => {
  return tradeGoods.filter(good => good.category === category);
};