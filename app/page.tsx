'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { POSTerminal } from '@/components/terminal/POSTerminal';
import { TransactionLog } from '@/components/receipts/TransactionLog';
import { useTradeStream } from '@/hooks/useTradeStream';
import { useCandleBuilder } from '@/hooks/useCandleBuilder';
import { useReceiptStore } from '@/stores/receiptStore';
import { useCandleStore } from '@/stores/candleStore';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const resetReceipts = useReceiptStore((state) => state.reset);
  const resetCandles = useCandleStore((state) => state.reset);

  // Clear all data on page refresh - start fresh each time
  useEffect(() => {
    resetReceipts();
    resetCandles();
  }, [resetReceipts, resetCandles]);

  // Initialize hooks for trade streaming and candle building
  useTradeStream({ enabled: true });
  useCandleBuilder();

  // Handle dark mode toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Set dark mode by default on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleToggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="bg-gray-100 dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-300 h-screen flex flex-col transition-colors duration-300 antialiased overflow-hidden">
      {/* Header */}
      <Header onToggleDarkMode={handleToggleDarkMode} />

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden min-h-0">
        {/* Left Panel - POS Terminal with Receipt Output */}
        <section className="border-r border-gray-300 dark:border-gray-800 flex flex-col bg-[#e5e5e5] dark:bg-[#050505] relative items-center overflow-hidden">
          {/* Dot pattern background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none z-0 dot-pattern" />

          {/* Spacer - terminal starts near top */}
          <div className="h-[3%] shrink-0" />

          {/* Terminal with receipt output - flex-1 to fill remaining height */}
          <div className="relative z-10 w-full max-w-[380px] px-4 flex-1 min-h-0 flex flex-col">
            <POSTerminal />
          </div>
        </section>

        {/* Right Panel - Transaction Log */}
        <TransactionLog />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
