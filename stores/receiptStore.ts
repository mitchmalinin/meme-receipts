import { create } from 'zustand';
import type { Receipt } from '@/lib/types';
import { storage } from '@/lib/storage';

// Maximum receipts to keep (localStorage has ~5MB limit)
const MAX_RECEIPTS = 500;

interface ReceiptState {
  receipts: Receipt[];
  hoveredReceiptId: string | null;
  summaryCount: number;
  whaleCount: number;
  isHydrated: boolean;

  // Actions
  addReceipt: (receipt: Receipt) => void;
  toggleReceiptExpanded: (id: string) => void;
  setHoveredReceipt: (id: string | null) => void;
  hydrate: () => void;
  reset: () => void;
}

export const useReceiptStore = create<ReceiptState>()((set, get) => ({
  receipts: [],
  hoveredReceiptId: null,
  summaryCount: 0,
  whaleCount: 0,
  isHydrated: false,

  hydrate: () => {
    if (get().isHydrated) return;

    const savedReceipts = storage.loadReceipts() as Receipt[];
    const savedSummaryCount = storage.loadSummaryCount();

    if (savedReceipts.length > 0) {
      const whaleCount = savedReceipts.filter(r => r.type === 'whale').length;
      set({
        receipts: savedReceipts,
        summaryCount: savedSummaryCount,
        whaleCount,
        isHydrated: true,
      });
    } else {
      set({ isHydrated: true });
    }
  },

  addReceipt: (receipt) =>
    set((state) => {
      // Add new receipt at the beginning (newest first)
      const newReceipts = [receipt, ...state.receipts];

      // Prune old receipts if exceeding limit
      const prunedReceipts = newReceipts.slice(0, MAX_RECEIPTS);

      const newSummaryCount = receipt.type === 'summary'
        ? state.summaryCount + 1
        : state.summaryCount;

      // Persist to localStorage
      storage.saveReceipts(prunedReceipts);
      storage.saveSummaryCount(newSummaryCount);

      return {
        receipts: prunedReceipts,
        summaryCount: newSummaryCount,
        whaleCount:
          receipt.type === 'whale' ? state.whaleCount + 1 : state.whaleCount,
      };
    }),

  toggleReceiptExpanded: (id) =>
    set((state) => ({
      receipts: state.receipts.map((r) =>
        r.id === id && r.type === 'summary'
          ? { ...r, isExpanded: !r.isExpanded }
          : r
      ),
    })),

  setHoveredReceipt: (id) =>
    set({
      hoveredReceiptId: id,
    }),

  reset: () => {
    storage.clearAll();
    set({
      receipts: [],
      hoveredReceiptId: null,
      summaryCount: 0,
      whaleCount: 0,
    });
  },
}));
