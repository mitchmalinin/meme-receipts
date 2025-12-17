// Candle duration in milliseconds (30 seconds)
export const CANDLE_DURATION_MS = 30_000;

// Whale threshold in SOL
export const WHALE_THRESHOLD_SOL = 1;

// Token info
export const TOKEN_NAME = 'RECEIPT';
export const TOKEN_TICKER = 'RECEIPT';

// Fee percentages (Pump.fun standard)
export const PROTOCOL_FEE_PERCENT = 1; // 1%
export const CREATOR_FEE_PERCENT = 0; // Can be set by creator

// Mock data settings
export const MOCK_TRADE_MIN_INTERVAL_MS = 100;
export const MOCK_TRADE_MAX_INTERVAL_MS = 2000;
export const MOCK_WHALE_PROBABILITY = 0.05; // 5% chance of whale trade

// UI settings
export const MAX_RECEIPTS_IN_MEMORY = 100;
export const RECEIPT_ANIMATION_DELAY_MS = 50;

// Colors
export const COLORS = {
  buy: '#22c55e',
  sell: '#ef4444',
  whale: '#eab308',
  terminalBody: '#1f1f23',
  terminalScreen: '#0a0a0a',
  terminalBorder: '#2a2a2e',
  receiptPaper: '#f5f5dc',
  receiptText: '#27272a',
} as const;
