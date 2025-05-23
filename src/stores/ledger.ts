
import { create } from 'zustand';

export interface LedgerEntry {
  id: string;
  userAlias: string;
  type: string; // 'DEPOSIT', 'WITHDRAW', 'RAKE', 'PAYOUT', 'REFERRAL'
  amount: number;
  status: string; // 'PENDING', 'COMPLETED', 'FAILED'
  date: string;
}

interface LedgerStore {
  entries: LedgerEntry[];
  filters: {
    type?: string;
    from?: string;
    to?: string;
  };
  page: number;
  loading: boolean;
  setEntries: (entries: LedgerEntry[]) => void;
  setFilters: (filters: Partial<LedgerStore['filters']>) => void;
  loadMore: () => void;
  setLoading: (loading: boolean) => void;
}

export const useLedgerStore = create<LedgerStore>((set) => ({
  entries: [],
  filters: {},
  page: 1,
  loading: false,
  setEntries: (entries) => set({ entries }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    page: 1 // Reset pagination when filters change
  })),
  loadMore: () => set((state) => ({ page: state.page + 1 })),
  setLoading: (loading) => set({ loading })
}));
