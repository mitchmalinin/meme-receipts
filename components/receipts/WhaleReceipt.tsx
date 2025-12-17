'use client';

import type { Trade } from '@/lib/types';
import { formatSol, formatTimeShort, truncateWallet } from '@/lib/utils';

interface WhaleReceiptProps {
  trade: Trade;
  alertNumber: number;
}

export function WhaleReceipt({ trade, alertNumber }: WhaleReceiptProps) {
  const valueUsd = trade.solAmount * 143.52; // Approximate SOL price

  return (
    <div className="p-5 border-b border-dashed border-gray-400/50 font-mono text-gray-800">
      {/* Whale Alert Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-double border-gray-800/40">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐋</span>
          <span className="font-bold text-sm tracking-wider">WHALE ALERT</span>
        </div>
        <span className="text-[10px] text-gray-500">#{alertNumber}</span>
      </div>

      {/* Big Amount Display */}
      <div className="text-center py-4 border-b border-dashed border-gray-400/50 mb-4">
        <div className="text-3xl font-bold tracking-tight">
          {trade.solAmount.toLocaleString('en-US', { maximumFractionDigits: 1 })} SOL
        </div>
        <div className={`text-lg font-bold mt-1 ${
          trade.side === 'buy' ? 'text-green-700' : 'text-red-700'
        }`}>
          {trade.side.toUpperCase()}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="opacity-60">TIME</span>
            <span>{formatTimeShort(trade.timestamp)}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">VALUE</span>
            <span>${valueUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="opacity-60">PRICE</span>
            <span>{(trade.price * 1000000).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">TOKENS</span>
            <span>{(trade.tokenAmount / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </div>

      {/* Wallet */}
      <div className="mt-3 pt-2 border-t border-dotted border-gray-400 text-[10px] text-gray-500 truncate font-mono">
        WALLET: {truncateWallet(trade.wallet)}
      </div>
    </div>
  );
}
