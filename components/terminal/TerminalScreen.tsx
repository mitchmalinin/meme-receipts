'use client';

import { LiveChart, type CandleData } from '@/components/charts/LiveChart';
import { useTradeSnapshot } from '@/hooks/useTradeSnapshot';
import type { Candle, Trade } from '@/lib/types';
import { generateId, getCandleDurationMs } from '@/lib/utils';
import { useCandleStore } from '@/stores/candleStore';
import { useReceiptStore } from '@/stores/receiptStore';
import { useTokenStore } from '@/stores/tokenStore';
import { MAX_SESSION_RECEIPTS, useUIStore } from '@/stores/uiStore';
import { useCallback, useEffect, useRef } from 'react';

// Idle timeout in milliseconds (30 seconds + small buffer)
const IDLE_TIMEOUT_MS = 32000;

// Create an idle candle when no activity for 30+ seconds
function createIdleCandle(
  lastPrice: number,
  candleNumber: number,
  durationMs: number
): Candle {
  const now = Date.now();
  // Align to 30-second boundary
  const startTime = Math.floor(now / durationMs) * durationMs;

  return {
    id: generateId(),
    candleNumber,
    startTime,
    endTime: startTime + durationMs,
    open: lastPrice,
    high: lastPrice,
    low: lastPrice,
    close: lastPrice,
    volume: 0,
    buyVolume: 0,
    sellVolume: 0,
    tradeCount: 0,
    buyCount: 0,
    sellCount: 0,
    trades: [],
    fees: { total: 0, creator: 0, protocol: 0 },
    isIdle: true, // Flag for idle receipt
  };
}

// Convert chart candle data to our Candle format for receipts
function convertChartCandleToReceipt(
  candle: CandleData,
  durationMs: number,
  candleNumber: number,
  trades: Trade[] = []
): Candle {
  const startTime = candle.time * 1000;
  const volume = candle.volume || 0;

  // Calculate trade stats from actual trades
  const buyTrades = trades.filter((t) => t.side === 'buy');
  const sellTrades = trades.filter((t) => t.side === 'sell');
  const buyVolume = buyTrades.reduce((sum, t) => sum + t.solAmount, 0);
  const sellVolume = sellTrades.reduce((sum, t) => sum + t.solAmount, 0);

  return {
    id: generateId(),
    candleNumber,
    startTime,
    endTime: startTime + durationMs,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume,
    buyVolume,
    sellVolume,
    tradeCount: trades.length,
    buyCount: buyTrades.length,
    sellCount: sellTrades.length,
    trades,
    fees: {
      total: volume * 0.01,
      creator: volume * 0.003,
      protocol: volume * 0.007,
    },
  };
}

export function TerminalScreen() {
  const selectedToken = useTokenStore((state) => state.selectedToken);
  const selectedPair = useTokenStore((state) => state.selectedPair);
  const isOutOfPaper = useUIStore((state) => state.isOutOfPaper);
  const resetPaper = useUIStore((state) => state.resetPaper);
  const chartTimeframe = useUIStore((state) => state.chartTimeframe);
  const setIsPrinting = useUIStore((state) => state.setIsPrinting);
  const setPrintPhase = useUIStore((state) => state.setPrintPhase);
  const incrementSessionReceipts = useUIStore((state) => state.incrementSessionReceipts);

  const { completeCandle, setCurrentCandle } = useCandleStore();
  const { addReceipt, summaryCount } = useReceiptStore();

  // Use snapshot-based trade fetching (fetches on-demand, not continuous polling)
  const { initializeSnapshot, fetchTradesForCandle, resetSnapshot } = useTradeSnapshot();
  const prevTokenRef = useRef<string | null>(null);

  // Idle candle tracking
  const lastCandleTimeRef = useRef<number>(0);
  const lastKnownPriceRef = useRef<number>(0);
  const idleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize trade snapshot when token changes
  useEffect(() => {
    const tokenAddress = selectedToken?.address;

    if (tokenAddress && tokenAddress !== prevTokenRef.current) {
      console.log('[TerminalScreen] Token changed, initializing trade snapshot');
      resetSnapshot();
      initializeSnapshot(tokenAddress);
      prevTokenRef.current = tokenAddress;
      // Reset idle tracking on token change
      lastCandleTimeRef.current = Date.now();
      // Try to get initial price from selected pair
      const pairPrice = selectedPair?.priceUsd ? parseFloat(selectedPair.priceUsd) : 0;
      lastKnownPriceRef.current = pairPrice;
      console.log('[TerminalScreen] Initial price from pair:', pairPrice);
    } else if (!tokenAddress && prevTokenRef.current) {
      resetSnapshot();
      prevTokenRef.current = null;
      lastCandleTimeRef.current = 0;
      lastKnownPriceRef.current = 0;
    }
  }, [selectedToken?.address, selectedPair?.priceUsd, initializeSnapshot, resetSnapshot]);

  // Print an idle receipt when no activity
  const printIdleReceipt = useCallback(() => {
    // Don't print if out of paper or no token
    if (isOutOfPaper || !selectedToken?.address) return;

    // Need a price to show
    if (lastKnownPriceRef.current === 0) {
      console.log('[TerminalScreen] No price data yet, skipping idle receipt');
      return;
    }

    // Hide test receipt if showing
    const { showTestReceipt, hideTestReceipt } = useUIStore.getState();
    if (showTestReceipt) {
      hideTestReceipt();
    }

    const durationMs = getCandleDurationMs(chartTimeframe);
    const receiptNumber = summaryCount + 1;
    const candle = createIdleCandle(lastKnownPriceRef.current, receiptNumber, durationMs);

    console.log('[TerminalScreen] PRINTING IDLE RECEIPT - no activity for 30+ seconds');

    // Trigger printing animation
    setIsPrinting(true);
    setPrintPhase('ejecting');

    // Complete the candle in store
    completeCandle(candle);

    // Add receipt to store
    addReceipt({
      type: 'summary',
      id: candle.id,
      receiptNumber,
      candle,
      isExpanded: false,
    });

    // Increment session receipt count
    incrementSessionReceipts();

    // Update last candle time
    lastCandleTimeRef.current = Date.now();

    // Reset print state after animation
    setTimeout(() => {
      setPrintPhase('printing');
      setIsPrinting(false);
    }, 600);
  }, [isOutOfPaper, selectedToken?.address, chartTimeframe, summaryCount, setIsPrinting, setPrintPhase, completeCandle, addReceipt, incrementSessionReceipts]);

  // Idle detection timer - check every 5 seconds if we need to print an idle receipt
  useEffect(() => {
    // Only run when a token is selected
    if (!selectedToken?.address) {
      if (idleIntervalRef.current) {
        clearInterval(idleIntervalRef.current);
        idleIntervalRef.current = null;
      }
      return;
    }

    // Initialize last candle time if not set
    if (lastCandleTimeRef.current === 0) {
      lastCandleTimeRef.current = Date.now();
    }

    // Check every 5 seconds
    idleIntervalRef.current = setInterval(() => {
      const timeSinceLastCandle = Date.now() - lastCandleTimeRef.current;

      if (timeSinceLastCandle >= IDLE_TIMEOUT_MS) {
        console.log(`[TerminalScreen] Idle detected: ${Math.round(timeSinceLastCandle / 1000)}s since last candle`);
        printIdleReceipt();
      }
    }, 5000);

    return () => {
      if (idleIntervalRef.current) {
        clearInterval(idleIntervalRef.current);
        idleIntervalRef.current = null;
      }
    };
  }, [selectedToken?.address, printIdleReceipt]);

  // Handle new candle detected by chart - THIS IS THE SINGLE SOURCE OF TRUTH
  const handleNewCandle = useCallback(async (completedCandle: CandleData, newCandle: CandleData) => {
    // Hide test receipt if showing (triggers fall animation)
    const { showTestReceipt, hideTestReceipt } = useUIStore.getState();
    if (showTestReceipt) {
      hideTestReceipt();
      await new Promise(resolve => setTimeout(resolve, 100)); // Let animation trigger
    }

    // Don't print if out of paper
    if (isOutOfPaper) {
      console.log('[TerminalScreen] Out of paper - skipping receipt');
      return;
    }

    // Don't print if no valid data
    if (completedCandle.open === 0 || completedCandle.close === 0) {
      console.log('[TerminalScreen] Invalid candle data - skipping receipt');
      return;
    }

    // Don't print if no token selected
    if (!selectedToken?.address) {
      console.log('[TerminalScreen] No token selected - skipping receipt');
      return;
    }

    const durationMs = getCandleDurationMs(chartTimeframe);
    const receiptNumber = summaryCount + 1;

    // Calculate candle time window
    const candleStartTime = completedCandle.time * 1000; // Convert seconds to ms
    const candleEndTime = candleStartTime + durationMs;

    // Get pool address for more reliable trade fetching
    const poolAddress = selectedPair?.pairAddress || null;

    console.log(`[TerminalScreen] Candle completed, fetching trades for receipt #${receiptNumber}`);
    console.log(`[TerminalScreen] Token: ${selectedToken.address}, Pool: ${poolAddress}`);

    // Fetch trades - using pool address is more reliable as swaps happen on pools
    const trades = await fetchTradesForCandle(selectedToken.address, poolAddress, candleStartTime, candleEndTime);

    console.log(`[TerminalScreen] Fetched ${trades.length} trades for candle window`);

    // Convert to our Candle format with trades
    const candle = convertChartCandleToReceipt(completedCandle, durationMs, receiptNumber, trades);

    console.log('[TerminalScreen] PRINTING RECEIPT for candle:', candle.startTime, '->', candle.endTime);

    // Trigger printing animation
    setIsPrinting(true);
    setPrintPhase('ejecting');

    // Complete the candle in store
    completeCandle(candle);

    // Add receipt to store
    addReceipt({
      type: 'summary',
      id: candle.id,
      receiptNumber,
      candle,
      isExpanded: false,
    });

    // Increment session receipt count (may trigger out of paper)
    incrementSessionReceipts();

    // Update current candle display to show the new candle
    const currentCandleData = convertChartCandleToReceipt(newCandle, durationMs, receiptNumber + 1);
    setCurrentCandle(currentCandleData);

    // Reset idle tracking - we got a real candle
    lastCandleTimeRef.current = Date.now();
    lastKnownPriceRef.current = newCandle.close;

    // Reset print state after animation
    setTimeout(() => {
      setPrintPhase('printing');
      setIsPrinting(false);
    }, 600);
  }, [isOutOfPaper, chartTimeframe, summaryCount, setIsPrinting, setPrintPhase, completeCandle, addReceipt, incrementSessionReceipts, setCurrentCandle, selectedToken?.address, selectedPair?.pairAddress, fetchTradesForCandle]);

  return (
    <div className="h-48 lg:h-80 bg-gray-900 rounded border border-gray-800 relative overflow-hidden">


      {/* Custom Live Chart */}
      <div className="absolute inset-0">
        {isOutOfPaper ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center px-4">
              <div className="text-red-500 font-mono text-sm mb-2 animate-pulse">
                ⚠ PRINTER OUT OF PAPER ⚠
              </div>
              <div className="text-gray-500 font-mono text-[10px] mb-3">
                {MAX_SESSION_RECEIPTS} receipts printed this session
              </div>
              <button
                onClick={resetPaper}
                className="bg-green-600 hover:bg-green-500 text-black text-[10px] font-bold px-3 py-1.5 rounded transition-colors"
              >
                RELOAD PAPER
              </button>
            </div>
          </div>
        ) : selectedToken ? (
          <LiveChart onNewCandle={handleNewCandle} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-green-500/50 font-mono text-xs mb-2">NO TOKEN SELECTED</div>
              <div className="text-gray-600 font-mono text-[10px]">Enter a token address above</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
