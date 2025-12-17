'use client';

import type { Trade } from '@/lib/types';
import { formatTimeShort, truncateWallet, formatSol } from '@/lib/utils';

interface TradeReceiptProps {
  trade: Trade;
  index: number;
}

export function TradeReceipt({ trade, index }: TradeReceiptProps) {
  const total = trade.solAmount * trade.price * 1000000; // Approximate USD value
  const fee = 0.0005;

  // Generate a transaction number
  const txNumber = 882910 - index;

  return (
    <div className="thermal-paper p-6 border-b border-dashed border-gray-400/50">
      {/* Header row */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="font-bold text-sm">TX #{txNumber}</div>
          <div className="text-[10px] text-gray-500">
            {formatTimeShort(trade.timestamp)} UTC
          </div>
        </div>
        <div
          className={`px-2 py-0.5 border rounded text-[10px] font-bold ${
            trade.side === 'buy'
              ? 'border-gray-800 text-gray-800'
              : 'border-red-800 text-red-800'
          }`}
        >
          {trade.side.toUpperCase()}
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-8 text-xs font-mono">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="opacity-60">PRICE</span>
            <span>{(trade.price * 1000000).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">AMT</span>
            <span>{formatSol(trade.solAmount)}</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="opacity-60">FEE</span>
            <span>{fee.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">TOTAL</span>
            <span className="font-bold">
              {total.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-3 pt-2 border-t border-dotted border-gray-400 text-[10px] text-gray-500 truncate font-mono">
        SIG: {truncateWallet(trade.wallet)}
      </div>
    </div>
  );
}
