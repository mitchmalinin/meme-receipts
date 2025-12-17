'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useTradeStore } from '@/stores/tradeStore';
import { generateMockTrade } from '@/lib/mockData';
import {
  MOCK_TRADE_MIN_INTERVAL_MS,
  MOCK_TRADE_MAX_INTERVAL_MS,
} from '@/lib/constants';
import type { Trade } from '@/lib/types';

interface UseTradeStreamOptions {
  enabled?: boolean;
  onTrade?: (trade: Trade) => void;
  onWhaleTrade?: (trade: Trade) => void;
}

export function useTradeStream(options: UseTradeStreamOptions = {}) {
  const { enabled = true, onTrade, onWhaleTrade } = options;

  const addTrade = useTradeStore((state) => state.addTrade);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateAndProcessTrade = useCallback(() => {
    const trade = generateMockTrade();

    // Add to trade store
    addTrade(trade);

    // Callback for external handlers
    onTrade?.(trade);

    // Handle whale trades
    if (trade.isWhale) {
      onWhaleTrade?.(trade);
    }

    return trade;
  }, [addTrade, onTrade, onWhaleTrade]);

  const scheduleNextTrade = useCallback(() => {
    // Random interval between min and max
    const delay =
      MOCK_TRADE_MIN_INTERVAL_MS +
      Math.random() * (MOCK_TRADE_MAX_INTERVAL_MS - MOCK_TRADE_MIN_INTERVAL_MS);

    timeoutRef.current = setTimeout(() => {
      generateAndProcessTrade();
      scheduleNextTrade();
    }, delay);
  }, [generateAndProcessTrade]);

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Start the trade stream
    scheduleNextTrade();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [enabled, scheduleNextTrade]);

  return {
    generateTrade: generateAndProcessTrade,
  };
}
