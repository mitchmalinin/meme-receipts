'use client';

import { useCandleStore } from '@/stores/candleStore';
import { useUIStore } from '@/stores/uiStore';
import { formatPrice } from '@/lib/utils';

export function TerminalReceipt() {
  const currentCandle = useCandleStore((state) => state.currentCandle);
  const completedCandles = useCandleStore((state) => state.completedCandles);
  const isPrinting = useUIStore((state) => state.isPrinting);

  // Calculate price change
  const priceChange = currentCandle
    ? ((currentCandle.close - currentCandle.open) / currentCandle.open) * 100
    : 2.4;

  const currentPrice = currentCandle?.close || 0.000412;
  const totalVolume = completedCandles.reduce((acc, c) => acc + c.volume, 0);
  const totalTrades = completedCandles.reduce((acc, c) => acc + c.tradeCount, 0);

  return (
    <div className="w-[340px] relative z-10 -mt-1 transform transition-transform shadow-2xl origin-top receipt-sway">
      {/* Jagged top edge */}
      <div className="jagged-top w-full h-2 bg-[#fffdf5] dark:bg-[#e5e5e5]" />

      <div className="thermal-paper p-6 w-full">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-dashed border-gray-800/30 pb-3 mb-4">
          <span className="font-bold text-sm tracking-wide">SOLANA NETWORK</span>
          <span className="text-[10px] text-green-600 font-bold">● LIVE</span>
        </div>

        {/* Price display */}
        <div className="flex justify-between items-end mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-wide">Current Price</span>
            <span className="text-2xl font-bold tracking-tight">
              {formatPrice(currentPrice).replace('$', '')} USD
            </span>
          </div>
          <span
            className={`text-sm font-bold ${
              priceChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {priceChange >= 0 ? '+' : ''}
            {priceChange.toFixed(1)}%
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 text-[11px] font-mono border-t border-dashed border-gray-800/30 pt-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="opacity-60">BLOCK:</span>
              <span>243,109,211</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">TPS:</span>
              <span>2,841</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="opacity-60">VOLUME:</span>
              <span>{totalVolume.toFixed(1)} SOL</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">TRADES:</span>
              <span>{totalTrades}</span>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="border-t border-dashed border-gray-800/30 pt-3 flex justify-center">
          <span
            className={`text-[10px] tracking-[0.3em] uppercase ${
              isPrinting ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {isPrinting ? '● PRINTING' : '○ READY'}
          </span>
        </div>
      </div>

      {/* Jagged bottom edge */}
      <div className="jagged-bottom w-full h-2 bg-[#fffdf5] dark:bg-[#e5e5e5]" />
    </div>
  );
}
