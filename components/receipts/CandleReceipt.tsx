'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Candle } from '@/lib/types';
import { formatPrice, formatTimeShort, truncateWallet, formatSol } from '@/lib/utils';

interface CandleReceiptProps {
  candle: Candle;
  receiptNumber: number;
  isExpanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
}

export function CandleReceipt({ candle, receiptNumber, isExpanded: controlledExpanded, onToggleExpand }: CandleReceiptProps) {
  // Use controlled state if provided, otherwise use local state
  const [localExpanded, setLocalExpanded] = useState(false);
  const isExpanded = controlledExpanded ?? localExpanded;

  // Sync local state with controlled state on mount
  useEffect(() => {
    if (controlledExpanded !== undefined) {
      setLocalExpanded(controlledExpanded);
    }
  }, [controlledExpanded]);

  const handleToggle = () => {
    const newValue = !isExpanded;
    setLocalExpanded(newValue);
    onToggleExpand?.(newValue);
  };

  const change = ((candle.close - candle.open) / candle.open) * 100;
  const isPositive = change >= 0;

  return (
    <div className="bg-[#fffdf5] dark:bg-[#e8e8e0] border-b-2 border-dashed border-gray-400 font-mono text-gray-800">
      {/* Main Receipt Content - Clickable */}
      <div
        className="p-4 cursor-pointer hover:bg-black/5 transition-colors"
        onClick={handleToggle}
      >
        {/* Whale indicator - if candle had a whale trade */}
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
        <div className="grid grid-cols-2 gap-4 text-sm font-mono mb-3">
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

        {/* Expand indicator */}
        <div className="text-center text-xs text-gray-500 border-t border-dashed border-gray-300 pt-2">
          [ {isExpanded ? 'HIDE ORDERS' : `VIEW ${candle.tradeCount} ORDERS`} ]
        </div>
      </div>

      {/* Expanded Trade List - Animated */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.2 },
            }}
            style={{ overflow: 'hidden' }}
          >
            {/* Order list header */}
            <div className="border-t border-dashed border-gray-400 mx-4" />
            <div className="px-4 py-2 text-center">
              <span className="text-[10px] text-gray-400 tracking-widest">─────── ITEMIZED ORDERS ───────</span>
            </div>

            {/* Trade rows - receipt style */}
            <div className="px-4 pb-4 space-y-2">
              {candle.trades.map((trade, idx) => (
                <div key={trade.id} className="text-xs font-mono">
                  {/* Top row: number, time, side */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">#{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-gray-600">{formatTimeShort(trade.timestamp)}</span>
                    <span className={`font-semibold ${trade.side === 'buy' ? 'text-green-700' : 'text-red-700'}`}>
                      {trade.side.toUpperCase()}
                    </span>
                    <span className="text-gray-400 text-[10px]">{truncateWallet(trade.wallet)}</span>
                  </div>
                  {/* Bottom row: amount with dotted line */}
                  <div className="flex items-baseline mt-0.5">
                    <span className="text-gray-400 text-[10px]">AMT</span>
                    <span className="flex-1 border-b border-dotted border-gray-300 mx-2" />
                    <span className={`font-semibold ${trade.isWhale ? 'text-gray-900' : 'text-gray-700'}`}>
                      {formatSol(trade.solAmount)} SOL
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order list footer */}
            <div className="px-4 pb-3 text-center">
              <span className="text-[10px] text-gray-400 tracking-widest">• • • • • • • • • • • • • • •</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
