
import { create } from 'zustand';

export interface LedgerEntry {
  id: string;
  date: string;        // ISO string
  userAlias: string;
  type: 'DEPOSIT'|'WITHDRAW'|'RAKE'|'PAYOUT'|'REFERRAL';
  amount: number;
  status: 'COMPLETED'|'PENDING'|'FAILED';
}

export const useLedgerStore = create<{
  entries: LedgerEntry[];
  filters: { type?: string; from?: string; to?: string };
  page: number;
  loading: boolean;
  setEntries: (e: LedgerEntry[]) => void;
  setFilters: (f: Partial<{ type?: string; from?: string; to?: string }>) => void;
  setLoading: (loading: boolean) => void;
  loadMore: () => void;
}>((set, get) => ({
  entries: [],
  filters: {},
  page: 1,
  loading: false,
  setEntries: (e) => set({ entries: e }),
  setFilters: (f) => set(state => ({ filters: { ...state.filters, ...f }, page: 1 })),
  setLoading: (loading) => set({ loading }),
  loadMore: () => {
    const next = get().page + 1;
    set({ page: next });
    // In UI mock, loadMore appends more mocks
  },
}));
