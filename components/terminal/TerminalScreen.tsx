'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with lightweight-charts
const TerminalChart = dynamic(
  () => import('./TerminalChart').then((mod) => mod.TerminalChart),
  { ssr: false }
);

export function TerminalScreen() {
  return (
    <div className="h-48 lg:h-80 bg-gray-900 rounded border border-gray-800 relative overflow-hidden">
      {/* Scanlines overlay */}
      <div className="scanlines absolute inset-0 pointer-events-none z-20 opacity-20" />

      {/* Chart label */}
      <div className="absolute top-2 left-2 text-[10px] text-green-500 font-mono z-10">
        SOL/USD 30S
      </div>

      {/* Real TradingView Chart */}
      <div className="absolute inset-0 pt-6">
        <TerminalChart />
      </div>
    </div>
  );
}
