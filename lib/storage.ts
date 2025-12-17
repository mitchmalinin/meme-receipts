// Simple localStorage persistence for receipts and candles

const STORAGE_KEYS = {
  RECEIPTS: 'receipts_data',
  CANDLES: 'candles_data',
  SUMMARY_COUNT: 'summary_count',
} as const;

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Generic storage helpers
export function saveToStorage<T>(key: string, data: T): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return defaultValue;
}

export function clearStorage(key: string): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('Failed to clear localStorage:', e);
  }
}

// Specific storage functions for our app
export const storage = {
  // Receipts
  saveReceipts: (receipts: unknown[]) => saveToStorage(STORAGE_KEYS.RECEIPTS, receipts),
  loadReceipts: () => loadFromStorage<unknown[]>(STORAGE_KEYS.RECEIPTS, []),

  // Candles
  saveCandles: (candles: unknown[]) => saveToStorage(STORAGE_KEYS.CANDLES, candles),
  loadCandles: () => loadFromStorage<unknown[]>(STORAGE_KEYS.CANDLES, []),

  // Summary count
  saveSummaryCount: (count: number) => saveToStorage(STORAGE_KEYS.SUMMARY_COUNT, count),
  loadSummaryCount: () => loadFromStorage<number>(STORAGE_KEYS.SUMMARY_COUNT, 0),

  // Clear all data
  clearAll: () => {
    clearStorage(STORAGE_KEYS.RECEIPTS);
    clearStorage(STORAGE_KEYS.CANDLES);
    clearStorage(STORAGE_KEYS.SUMMARY_COUNT);
  },
};
