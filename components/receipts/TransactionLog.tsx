'use client';

import type { Receipt } from '@/lib/types';
import { useCandleStore } from '@/stores/candleStore';
import { useReceiptStore } from '@/stores/receiptStore';
import { ANIMATION_SPEEDS, useUIStore } from '@/stores/uiStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useRef } from 'react';
import { CandleReceipt } from './CandleReceipt';

// Store expanded state outside component to persist across re-renders
const expandedState = new Map<string, boolean>();


export function TransactionLog() {
  const receipts = useReceiptStore((state) => state.receipts);
  const addReceipt = useReceiptStore((state) => state.addReceipt);
  const summaryCount = useReceiptStore((state) => state.summaryCount);
  const completedCandles = useCandleStore((state) => state.completedCandles);
  const completeCandle = useCandleStore((state) => state.completeCandle);
  const debugCreateCandle = useCandleStore((state) => state.debugCreateCandle);
  const animationSpeedIndex = useUIStore((state) => state.animationSpeedIndex);
  const isPrinting = useUIStore((state) => state.isPrinting);
  const cycleAnimationSpeed = useUIStore((state) => state.cycleAnimationSpeed);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get only candle receipts, newest first
  // Skip the first one (index 0) because it's shown on left side
  const displayReceipts = receipts
    .filter((r) => r.type === 'summary')
    .slice(1); // Show all receipts (no limit)

  const currentSpeed = ANIMATION_SPEEDS[animationSpeedIndex];

  // Debug: Print a test receipt
  const handleDebugPrint = useCallback(() => {
    const candle = debugCreateCandle();
    completeCandle(candle);

    const receipt: Receipt = {
      type: 'summary',
      id: candle.id,
      receiptNumber: summaryCount + 1,
      candle,
      isExpanded: false,
    };
    addReceipt(receipt);
  }, [debugCreateCandle, completeCandle, addReceipt, summaryCount]);

  const getExpanded = useCallback((id: string) => expandedState.get(id) ?? false, []);
  const setExpanded = useCallback((id: string, value: boolean) => {
    expandedState.set(id, value);
  }, []);

  return (
    <section className="flex flex-col bg-white dark:bg-[#121212] relative overflow-hidden h-full min-h-0">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-300 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#161616] z-20 shadow-sm shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Transaction Log
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-gray-400 font-mono">
            {completedCandles.length} CANDLES
          </span>
          {/* Dev controls */}
          <button
            onClick={cycleAnimationSpeed}
            className="px-2 py-1 text-[10px] font-mono bg-yellow-400 dark:bg-yellow-500 text-black rounded hover:bg-yellow-300 dark:hover:bg-yellow-400 transition-colors font-bold"
          >
            {currentSpeed.label}
          </button>
          <button
            onClick={handleDebugPrint}
            className="px-2 py-1 text-[10px] font-mono bg-green-500 text-white rounded hover:bg-green-400 transition-colors font-bold"
          >
            PRINT
          </button>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[10px] text-green-500 font-mono">LIVE</span>
          </div>
        </div>
      </div>

      {/* Receipt area */}
      <div className="flex-1 relative min-h-0 overflow-hidden">
        {/* Counter background */}
        <div className="absolute inset-0 bg-[#d6d3cd] dark:bg-[#111]" />
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 cross-pattern" />

        {/* Shadow at top */}
        <div
          className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#d6d3cd]/60 dark:from-[#111]/60 to-transparent pointer-events-none z-30"
        />

        {/* Clip container - hides content above the visible area */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Scrollable inner container */}
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto overflow-x-hidden flex justify-center"
          >
            <div className="w-full max-w-[332px]">
              {/* All receipts - newest first */}
              <AnimatePresence initial={false} mode="popLayout">
                {displayReceipts.map((receipt) => (
                  <motion.div
                    key={receipt.id}
                    layout
                    // Outer wrapper handles space creation (height)
                    initial={{ height: 0, opacity: 1 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
                    transition={{
                      layout: { duration: currentSpeed.duration, ease: "linear" },
                      height: { duration: currentSpeed.duration, ease: "linear" },
                    }}
                    className="mb-0 relative z-10 overflow-hidden"
                  >
                    {/* Inner wrapper handles the slide down effect */}
                    <motion.div
                      initial={{ y: '-100%' }}
                      animate={{ y: '0%' }}
                      transition={{
                        duration: currentSpeed.duration,
                        ease: "linear"
                      }}
                    >
                      <div className="bg-[#fffdf5] dark:bg-[#e8e8e0] relative z-10 shadow-sm">
                        <CandleReceipt
                          candle={receipt.candle}
                          receiptNumber={receipt.receiptNumber}
                          isExpanded={getExpanded(receipt.id)}
                          onToggleExpand={(expanded) => setExpanded(receipt.id, expanded)}
                        />
                      </div>
                      {/* Torn edge only after Receipt #1 (the first receipt of the session) */}
                      {receipt.receiptNumber === 1 && (
                        <div className="h-4 torn-edge-bottom relative z-0" />
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Bottom spacing for scroll */}
              <div className="h-12" />
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#d6d3cd]/60 dark:from-[#111]/60 to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}

