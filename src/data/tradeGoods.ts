import { TradeGood } from '../types/game';

export const tradeGoods: TradeGood[] = [
  // Basic Resources
  {
    id: 'water',
    name: 'Water',
    category: 'basic_resources',
    baseValue: 50,
    description: 'Purified water for life support and industrial use',
    volatility: 0.1,
    rarity: 'common'
  },
  {
    id: 'air_canisters',
    name: 'Air Canisters',
    category: 'basic_resources',
    baseValue: 75,
    description: 'Compressed breathable air for life support systems',
    volatility: 0.15,
    rarity: 'common'
  },
  {
    id: 'fuel_cells',
    name: 'Fuel Cells',
    category: 'basic_resources',
    baseValue: 100,
    description: 'Standard reactor fuel cells',
    volatility: 0.2,
    rarity: 'common'
  },

  // Luxury Goods
  {
    id: 'exotic_minerals',
    name: 'Exotic Minerals',
    category: 'luxury_goods',
    baseValue: 500,
    description: 'Rare crystalline formations from deep space',
    volatility: 0.4,
    rarity: 'rare'
  },
  {
    id: 'art_artifacts',
    name: 'Artistic Artifacts',
    category: 'luxury_goods',
    baseValue: 750,
    description: 'Unique pieces created in zero gravity',
    volatility: 0.5,
    rarity: 'rare'
  },
  {
    id: 'gourmet_supplies',
    name: 'Gourmet Supplies',
    category: 'luxury_goods',
    baseValue: 300,
    description: 'High-end food and drink supplies',
    volatility: 0.3,
    rarity: 'uncommon'
  },

  // Industrial
  {
    id: 'industrial_lubricants',
    name: 'Industrial Lubricants',
    category: 'industrial',
    baseValue: 150,
    description: 'High-performance machinery lubricants',
    volatility: 0.2,
    rarity: 'common'
  },
  {
    id: 'construction_materials',
    name: 'Construction Materials',
    category: 'industrial',
    baseValue: 200,
    description: 'Space-grade building materials',
    volatility: 0.25,
    rarity: 'common'
  },
  {
    id: 'mining_explosives',
    name: 'Mining Explosives',
    category: 'industrial',
    baseValue: 400,
    description: 'Controlled explosives for asteroid mining',
    volatility: 0.3,
    rarity: 'uncommon'
  },

  // Medical
  {
    id: 'medical_supplies',
    name: 'Medical Supplies',
    category: 'medical',
    baseValue: 300,
    description: 'Basic medical and first aid supplies',
    volatility: 0.2,
    rarity: 'common'
  },
  {
    id: 'advanced_medications',
    name: 'Advanced Medications',
    category: 'medical',
    baseValue: 600,
    description: 'Specialized space medicine and treatments',
    volatility: 0.3,
    rarity: 'uncommon'
  },
  {
    id: 'nanomed_units',
    name: 'Nanomed Units',
    category: 'medical',
    baseValue: 1000,
    description: 'Advanced nanomedicine treatments',
    volatility: 0.4,
    rarity: 'rare'
  },

  // Technology
  {
    id: 'computer_cores',
    name: 'Computer Cores',
    category: 'technology',
    baseValue: 800,
    description: 'High-performance computing units',
    volatility: 0.3,
    rarity: 'uncommon'
  },
  {
    id: 'quantum_processors',
    name: 'Quantum Processors',
    category: 'technology',
    baseValue: 1500,
    description: 'Next-gen quantum computing components',
    volatility: 0.4,
    rarity: 'rare'
  },
  {
    id: 'ai_modules',
    name: 'AI Modules',
    category: 'technology',
    baseValue: 1200,
    description: 'Artificial Intelligence processing units',
    volatility: 0.35,
    rarity: 'rare'
  },

  // Ship Parts
  {
    id: 'shield_generators',
    name: 'Shield Generators',
    category: 'ship_parts',
    baseValue: 500,
    description: 'Standard shield generation units',
    volatility: 0.25,
    rarity: 'common'
  },
  {
    id: 'warp_coils',
    name: 'Warp Coils',
    category: 'ship_parts',
    baseValue: 900,
    description: 'FTL drive components',
    volatility: 0.3,
    rarity: 'uncommon'
  },
  {
    id: 'weapon_systems',
    name: 'Weapon Systems',
    category: 'ship_parts',
    baseValue: 700,
    description: 'Military-grade weapon components',
    volatility: 0.35,
    rarity: 'uncommon'
  }
];