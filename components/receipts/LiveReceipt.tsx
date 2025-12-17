'use client';

import { useCandleStore } from '@/stores/candleStore';
import { useReceiptStore } from '@/stores/receiptStore';
import { formatPrice, formatTimeShort } from '@/lib/utils';

export function LiveReceipt() {
  const currentCandle = useCandleStore((state) => state.currentCandle);
  const summaryCount = useReceiptStore((state) => state.summaryCount);

  // Calculate time remaining in current candle
  const now = Date.now();
  const candleEnd = currentCandle?.endTime || now + 60000;
  const secondsRemaining = Math.max(0, Math.floor((candleEnd - now) / 1000));

  const change = currentCandle && currentCandle.tradeCount > 0
    ? ((currentCandle.close - currentCandle.open) / currentCandle.open) * 100
    : 0;
  const isPositive = change >= 0;

  return (
    <div className="w-[340px] relative receipt-sway">
      {/* Jagged top edge */}
      <div className="jagged-top w-full h-2 bg-[#fffdf5] dark:bg-[#e5e5e5]" />

      <div className="thermal-paper p-5">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-dashed border-gray-800/30 pb-2 mb-3">
          <div>
            <div className="font-bold text-xs">RECEIPT #{String(summaryCount + 1).padStart(6, '0')}</div>
            <div className="text-[9px] text-gray-500">
              {currentCandle ? formatTimeShort(currentCandle.startTime) : '--:--:--'} → LIVE
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-green-600 font-bold animate-pulse">● RECORDING</div>
            <div className="text-[10px] text-gray-500">{secondsRemaining}s</div>
          </div>
        </div>

        {currentCandle && currentCandle.tradeCount > 0 ? (
          <>
            {/* Price Change */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-[10px] text-gray-500">CURRENT</div>
                <div className="text-lg font-bold">{formatPrice(currentCandle.close)}</div>
              </div>
              <div className={`text-lg font-bold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                {isPositive ? '+' : ''}{change.toFixed(2)}%
              </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono border-t border-dashed border-gray-800/30 pt-3">
              <div className="text-center">
                <div className="opacity-60">TRADES</div>
                <div className="font-bold text-sm">{currentCandle.tradeCount}</div>
              </div>
              <div className="text-center">
                <div className="opacity-60 text-green-700">BUYS</div>
                <div className="font-bold text-sm text-green-700">{currentCandle.buyCount}</div>
              </div>
              <div className="text-center">
                <div className="opacity-60 text-red-700">SELLS</div>
                <div className="font-bold text-sm text-red-700">{currentCandle.sellCount}</div>
              </div>
            </div>

            {/* Volume */}
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-dotted border-gray-400 text-[10px]">
              <span className="opacity-60">VOLUME</span>
              <span className="font-bold">{currentCandle.volume.toFixed(2)} SOL</span>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-gray-400 text-sm">
            Waiting for trades...
          </div>
        )}
      </div>

      {/* Jagged bottom edge */}
      <div className="jagged-bottom w-full h-2 bg-[#fffdf5] dark:bg-[#e5e5e5]" />
    </div>
  );
}
