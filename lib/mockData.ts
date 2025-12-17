import type { Trade } from '@/lib/types';
import {
  WHALE_THRESHOLD_SOL,
  MOCK_WHALE_PROBABILITY,
} from '@/lib/constants';
import { generateId } from '@/lib/utils';

// Mock wallet addresses
const MOCK_WALLETS = [
  '8hJ4kL9pQ2wX5vB7nM3cR6fD',
  '7xK3mN8fQ2aB5cL9pW4vR6jD',
  '9aB2kL1mN8pQ5wX7vC3fR6jD',
  '4fD8kL2mN9pQ1wX5vB7cR3jD',
  '6gH5kL3mN7pQ2wX8vB4cR9jD',
  '2jK9mN4fQ8aB1cL5pW7vR6xD',
  '5nM2kL8fQ4aB7cL1pW3vR9jD',
  '3pQ6kL7mN2fA8cB4wX5vR1jD',
  '1wX4kL9mN5fQ2aB8cL6pR7jD',
  '9vB3kL6mN1fQ7aB2cL8pW4jD',
];

// State for mock price simulation
let currentPrice = 0.000412;
let priceVelocity = 0;

/**
 * Generate a random wallet address from the pool
 */
function getRandomWallet(): string {
  return MOCK_WALLETS[Math.floor(Math.random() * MOCK_WALLETS.length)];
}

/**
 * Simulate price movement with momentum
 */
function updatePrice(side: 'buy' | 'sell', solAmount: number): number {
  // Price impact based on trade size
  const impact = solAmount * 0.00001 * (side === 'buy' ? 1 : -1);

  // Add some momentum
  priceVelocity = priceVelocity * 0.8 + impact * 0.2;

  // Random noise
  const noise = (Math.random() - 0.5) * 0.000002;

  // Update price
  currentPrice = Math.max(0.000001, currentPrice + priceVelocity + noise);

  return currentPrice;
}

/**
 * Generate a realistic SOL amount for a trade
 * Most trades are small, occasional whales
 */
function generateSolAmount(): number {
  const isWhale = Math.random() < MOCK_WHALE_PROBABILITY;

  if (isWhale) {
    // Whale trade: 1-10 SOL
    return WHALE_THRESHOLD_SOL + Math.random() * 9;
  }

  // Normal distribution of trade sizes
  // Mostly small trades (0.01-0.5 SOL)
  const rand = Math.random();

  if (rand < 0.5) {
    // 50% tiny trades: 0.01-0.1 SOL
    return 0.01 + Math.random() * 0.09;
  } else if (rand < 0.8) {
    // 30% small trades: 0.1-0.3 SOL
    return 0.1 + Math.random() * 0.2;
  } else {
    // 20% medium trades: 0.3-0.9 SOL
    return 0.3 + Math.random() * 0.6;
  }
}

/**
 * Generate a single mock trade
 */
export function generateMockTrade(): Trade {
  // Slightly favor buys to simulate upward pressure
  const side: 'buy' | 'sell' = Math.random() < 0.55 ? 'buy' : 'sell';
  const solAmount = generateSolAmount();
  const price = updatePrice(side, solAmount);
  const tokenAmount = solAmount / price;

  return {
    id: generateId(),
    timestamp: Date.now(),
    wallet: getRandomWallet(),
    side,
    solAmount,
    tokenAmount,
    price,
    isWhale: solAmount >= WHALE_THRESHOLD_SOL,
  };
}

/**
 * Generate initial historical trades for chart seeding
 */
export function generateHistoricalTrades(count: number): Trade[] {
  const trades: Trade[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const trade = generateMockTrade();
    // Spread trades over the past hour
    trade.timestamp = now - (count - i) * 1000;
    trades.push(trade);
  }

  return trades;
}

/**
 * Reset mock price state (useful for testing)
 */
export function resetMockState(): void {
  currentPrice = 0.000412;
  priceVelocity = 0;
}

/**
 * Get current mock price
 */
export function getCurrentMockPrice(): number {
  return currentPrice;
}
