'use client';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { TransactionLog } from '@/components/receipts/TransactionLog';
import { POSTerminal } from '@/components/terminal/POSTerminal';
import { useCandleBuilder } from '@/hooks/useCandleBuilder';
import { useTradeStream } from '@/hooks/useTradeStream';
import { useCandleStore } from '@/stores/candleStore';
import { useReceiptStore } from '@/stores/receiptStore';
import { useEffect, useState } from 'react';

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
    <div className="bg-gray-100 dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-300 min-h-screen lg:h-screen flex flex-col transition-colors duration-300 antialiased lg:overflow-hidden">
      {/* Header */}
      <div className="hidden lg:block">
        <Header onToggleDarkMode={handleToggleDarkMode} />
      </div>

      {/* Main Content */}
      <main className="h-auto lg:flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-visible lg:overflow-hidden min-h-0">
        {/* Left Panel - POS Terminal with Receipt Output */}
        <section className="border-r border-gray-300 dark:border-gray-800 flex flex-col bg-[#e5e5e5] dark:bg-[#050505] relative z-30 items-center overflow-visible lg:overflow-hidden">
          {/* Dot pattern background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none z-0 dot-pattern" />

          {/* Spacer - terminal starts near top */}
          <div className="h-0 lg:h-[3%] shrink-0" />

          {/* Terminal with receipt output - flex-1 to fill remaining height */}
          <div className="relative z-10 w-full max-w-[320px] lg:max-w-[380px] px-4 h-auto lg:flex-1 lg:min-h-0 flex flex-col">
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
