'use client';

import { useUIStore } from '@/stores/uiStore';

export function TokenIntroReceipt() {
  const tokenIntroTicker = useUIStore((state) => state.tokenIntroTicker);
  const ticker = tokenIntroTicker?.toUpperCase() || 'TOKEN';

  return (
    <div className="relative font-mono text-gray-800">
      {/* Paper Background Wrapper */}
      <div className="bg-[#fffdf5] dark:bg-[#e8e8e0] border-b-2 border-dashed border-gray-400 pt-6 pb-4">
        <div className="px-4">
          {/* Header */}
          <div className="text-center mb-2">
            <div className="text-[9px] text-gray-400 tracking-[0.3em]">
              ══════════════════════
            </div>
          </div>

          {/* Large Ticker Display */}
          <div className="text-center mb-2">
            <div className="text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight">
              ${ticker}
            </div>
          </div>

          {/* NOW TRACKING message */}
          <div className="text-center mb-3">
            <div className="text-[10px] text-gray-500 tracking-widest">
              NOW TRACKING
            </div>
          </div>

          {/* Decorative line */}
          <div className="text-center">
            <div className="text-[9px] text-gray-400 tracking-[0.3em]">
              ══════════════════════
            </div>
          </div>
        </div>

        {/* Footer dots */}
        <div className="pt-3 text-center opacity-50 text-[10px]">
          . . . . . . . . . . . . . . .
        </div>
      </div>

      {/* Torn bottom edge */}
      <div className="h-4 torn-edge-bottom relative z-10" />
    </div>
  );
}
