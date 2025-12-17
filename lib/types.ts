// Core trade data from WebSocket/mock
export interface Trade {
  id: string;
  timestamp: number;
  wallet: string;
  side: 'buy' | 'sell';
  solAmount: number;
  tokenAmount: number;
  price: number;
  isWhale: boolean; // >= 1 SOL
}

// OHLC candle data
export interface Candle {
  id: string;
  startTime: number;
  endTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  tradeCount: number;
  buyCount: number;
  sellCount: number;
  trades: Trade[];
  hasWhale: boolean; // True if candle contains a whale trade
  fees: {
    total: number;
    creator: number;
    protocol: number;
  };
}

// Receipt types
export interface SummaryReceipt {
  type: 'summary';
  id: string;
  receiptNumber: number;
  candle: Candle;
  isExpanded: boolean;
}

export interface WhaleReceipt {
  type: 'whale';
  id: string;
  alertNumber: number;
  trade: Trade;
  marketCap: number;
  percentSupply: number;
}

export type Receipt = SummaryReceipt | WhaleReceipt;

// Filter state
export type TradeFilter = 'all' | 'buys' | 'sells';

// Chart data format for lightweight-charts
export interface ChartCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}
