import { create } from 'zustand';
import type { Trade } from '@/lib/types';

interface TradeState {
  trades: Trade[];
  latestTrade: Trade | null;

  // Actions
  addTrade: (trade: Trade) => void;
  clearTrades: () => void;
}

export const useTradeStore = create<TradeState>()((set) => ({
  trades: [],
  latestTrade: null,

  addTrade: (trade) =>
    set((state) => ({
      trades: [...state.trades, trade],
      latestTrade: trade,
    })),

  clearTrades: () =>
    set({
      trades: [],
      latestTrade: null,
    }),
}));
