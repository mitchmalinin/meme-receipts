'use client';

import type { Candle } from '@/lib/types';
import { formatPrice, formatTimeShort } from '@/lib/utils';
import { useCandleStore } from '@/stores/candleStore';
import { useReceiptStore } from '@/stores/receiptStore';
import { ANIMATION_SPEEDS, useUIStore } from '@/stores/uiStore';
import { AnimatePresence, motion } from 'framer-motion';
import { TerminalKeypad } from './TerminalKeypad';
import { TerminalScreen } from './TerminalScreen';



// Attached LCD Display - customer-facing pole display showing live stats
function AttachedLCDDisplay({
  candle,
  receiptNumber,
  secondsRemaining
}: {
  candle: Candle | null;
  receiptNumber: number;
  secondsRemaining: number;
}) {
  const change = candle && candle.tradeCount > 0
    ? ((candle.close - candle.open) / candle.open) * 100
    : 0;
  const isPositive = change >= 0;

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      {/* Pole/stand connecting to terminal */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3 h-8 bg-gray-400 dark:bg-gray-700 z-0" />

      {/* LCD Screen housing - fixed height to prevent layout shifts */}
      <div className="relative z-10 bg-[#2a2a2a] rounded-lg p-1 shadow-lg border-2 border-gray-600 dark:border-gray-800">
        {/* Screen bezel */}
        <div className="bg-[#1a1a1a] rounded p-3 h-[140px]">
          {/* LCD content - green on black like old displays */}
          <div className="font-mono text-green-400 text-sm h-full flex flex-col">
            {/* Header row */}
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-green-900">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs">RECORDING #{String(receiptNumber).padStart(6, '0')}</span>
              </div>
              <div className="text-xs tabular-nums">{secondsRemaining}s</div>
            </div>

            {candle && candle.tradeCount > 0 ? (
              <div className="flex-1 flex flex-col justify-between">
                {/* Price row */}
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold tracking-tight">{formatPrice(candle.close)}</span>
                  <span className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{change.toFixed(2)}%
                  </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2 text-xs text-center">
                  <div>
                    <div className="text-green-600">TRADES</div>
                    <div className="font-bold">{candle.tradeCount}</div>
                  </div>
                  <div>
                    <div className="text-green-600">BUYS</div>
                    <div className="font-bold">{candle.buyCount}</div>
                  </div>
                  <div>
                    <div className="text-green-600">SELLS</div>
                    <div className="font-bold">{candle.sellCount}</div>
                  </div>
                  <div>
                    <div className="text-green-600">VOL</div>
                    <div className="font-bold">{candle.volume.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-green-600">
                WAITING FOR TRADES...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Completed receipt - larger text with clear borders
function CompletedReceipt({
  candle,
  receiptNumber
}: {
  candle: Candle;
  receiptNumber: number;
}) {
  const change = ((candle.close - candle.open) / candle.open) * 100;
  const isPositive = change >= 0;

  return (
    <div
      className="bg-[#fffdf5] dark:bg-[#e8e8e0] shrink-0 border-b-2 border-dashed border-gray-400"
    >
      <div className="px-4 pt-6 pb-4 font-mono text-gray-800 h-full flex flex-col">
        {/* Whale indicator */}
        {candle.hasWhale && (
          <div className="text-center mb-2 pb-2 border-b border-dashed border-gray-400">
            <div className="font-bold text-base tracking-wider">*** WHALE TRADE ***</div>
          </div>
        )}

        {/* Header row */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-bold text-base">RECEIPT #{String(receiptNumber).padStart(6, '0')}</div>
            <div className="text-xs text-gray-500">
              {formatTimeShort(candle.startTime)} → {formatTimeShort(candle.endTime)} UTC
            </div>
          </div>
          <div className={`font-bold text-sm ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 mb-3" />

        {/* OHLC Grid - larger text */}
        <div className="grid grid-cols-2 gap-4 text-sm font-mono flex-1">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="opacity-60">OPEN</span>
              <span className="font-semibold">{formatPrice(candle.open)}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">HIGH</span>
              <span className="font-semibold">{formatPrice(candle.high)}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">LOW</span>
              <span className="font-semibold">{formatPrice(candle.low)}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">CLOSE</span>
              <span className="font-semibold">{formatPrice(candle.close)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="opacity-60">VOLUME</span>
              <span className="font-semibold">{candle.volume.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">TRADES</span>
              <span className="font-semibold">{candle.tradeCount}</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span className="opacity-60">BUYS</span>
              <span className="font-semibold">{candle.buyCount} ({candle.buyVolume.toFixed(1)})</span>
            </div>
            <div className="flex justify-between text-red-700">
              <span className="opacity-60">SELLS</span>
              <span className="font-semibold">{candle.sellCount} ({candle.sellVolume.toFixed(1)})</span>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="border-t border-dashed border-gray-300 mt-3 pt-2 text-center">
          <span className="text-[10px] text-gray-400 tracking-widest">• • • • • • • • • • • • • • •</span>
        </div>
      </div>
    </div>
  );
}

export function POSTerminal() {
  const isPrinting = useUIStore((state) => state.isPrinting);
  const animationSpeedIndex = useUIStore((state) => state.animationSpeedIndex);
  const currentCandle = useCandleStore((state) => state.currentCandle);
  const completedCandles = useCandleStore((state) => state.completedCandles);
  const summaryCount = useReceiptStore((state) => state.summaryCount);



  // Calculate live receipt data
  const now = Date.now();
  const candleEnd = currentCandle?.endTime || now + 30000;
  const secondsRemaining = Math.max(0, Math.floor((candleEnd - now) / 1000));

  // Key for animation - changes when a new candle completes
  const stackKey = completedCandles.length;
  const animationDuration = ANIMATION_SPEEDS[animationSpeedIndex].duration;

  return (
    <div className="relative flex flex-col h-full">
      {/* Attached LCD Display - shows live stats */}
      <div className="shrink-0 pb-6">
        <AttachedLCDDisplay
          candle={currentCandle}
          receiptNumber={summaryCount + 1}
          secondsRemaining={secondsRemaining}
        />
      </div>

      {/* Terminal Body */}
      <motion.div
        className="bg-[#d4d4d8] dark:bg-[#1a1a1a] rounded-[2rem] p-6 shadow-terminal border-b-8 border-r-4 border-gray-400 dark:border-black relative w-full shrink-0"
        animate={{
          scale: isPrinting ? [1, 1.005, 1] : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        {/* Screen */}
        <div className="bg-black rounded-xl p-3 mb-4 relative overflow-hidden shadow-inner-screen border-2 border-gray-500 dark:border-gray-800">
          {/* Screen Header */}
          <div className="flex justify-between items-center mb-1 px-1">
            <span className="text-gray-400 italic font-sans font-bold text-[10px] tracking-tight">
              Verifone Live
            </span>
            <div className="flex gap-1">
              <span className="material-symbols-outlined text-[10px] text-white">
                signal_cellular_alt
              </span>
              <span className="material-symbols-outlined text-[10px] text-white">
                battery_full
              </span>
            </div>
          </div>

          {/* Chart Display */}
          <TerminalScreen />
        </div>

        {/* Function Buttons Row */}
        <div className="flex justify-between gap-3 mb-4 px-2">
          <button className="h-8 flex-1 bg-gray-300 dark:bg-gray-600 rounded-sm skew-x-[-10deg] border-b-2 border-gray-400 dark:border-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500 transition-all">
            <span className="material-symbols-outlined text-sm text-gray-600 dark:text-gray-300 transform skew-x-[10deg]">
              remove
            </span>
          </button>
          <button className="h-8 flex-1 bg-gray-300 dark:bg-gray-600 rounded-sm skew-x-[-10deg] border-b-2 border-gray-400 dark:border-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500 transition-all">
            <div className="flex gap-1 transform skew-x-[10deg]">
              <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-gray-600 dark:border-t-gray-300" />
              <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-gray-600 dark:border-b-gray-300" />
            </div>
          </button>
          <button className="h-8 flex-1 bg-gray-300 dark:bg-gray-600 rounded-sm skew-x-[-10deg] border-b-2 border-gray-400 dark:border-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500 transition-all">
            <span className="material-symbols-outlined text-sm text-gray-600 dark:text-gray-300 transform skew-x-[10deg]">
              check
            </span>
          </button>
        </div>

        {/* Keypad */}
        <TerminalKeypad />

        {/* Receipt Bezel - Gray container where paper emerges */}
        <div className="h-8 -mx-6 -mb-6 bg-gray-700 rounded-b-[2rem] shadow-md border-t border-gray-600 mt-4 relative z-30 flex justify-center">
          <div className="flex-1 mx-6 h-1 bg-gray-800/50 rounded-full mt-auto mb-2" />
        </div>
      </motion.div>

      {/* Receipt Paper Area */}
      <div className="relative mx-6 -mt-3 z-20 flex-1 min-h-0 overflow-hidden flex flex-col">
        {/* Only show paper when there's a receipt */}
        <AnimatePresence initial={false} mode="popLayout">
          {completedCandles.slice(-3).reverse().map((candle, index) => {
            // Calculate the receipt number based on the total count and index
            // The most recent is summaryCount, the one before is summaryCount - 1, etc.
            const receiptNumber = summaryCount - index;
            
            return (
              <motion.div
                key={candle.id}
                layout
                // Outer wrapper: handles space creation
                initial={{ height: 0, opacity: 1 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ y: '100%', transition: { duration: animationDuration } }}
                transition={{
                  duration: animationDuration,
                  ease: 'linear',
                }}
                className="relative z-10 overflow-hidden shrink-0"
              >
                {/* Inner wrapper: handles slide out */}
                <motion.div
                  initial={{ y: '-100%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: animationDuration,
                    ease: 'linear',
                  }}
                >
                  <div className="bg-[#fffdf5] dark:bg-[#e8e8e0]">
                    <CompletedReceipt
                      candle={candle}
                      receiptNumber={receiptNumber}
                    />
                  </div>

                  {/* Torn edge only after Receipt #1 (the first receipt of the session) */}
                  {receiptNumber === 1 && (
                    <div className="h-4 torn-edge-bottom" />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Portal Shadow: Bottom overlay connecting to Transaction Log */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#e5e5e5]/60 dark:from-[#050505]/60 to-transparent pointer-events-none z-30"
        />
      </div>
    </div>
  );
}
