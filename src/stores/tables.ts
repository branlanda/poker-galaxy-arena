
import { create } from 'zustand';
import { LobbyTable, TableFilters, DEFAULT_FILTERS, TableType, SortOption } from '@/types/lobby';

interface TablesState {
  tables: LobbyTable[];
  allTables: LobbyTable[];
  filters: TableFilters;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  
  setTables: (tables: LobbyTable[]) => void;
  addTable: (table: LobbyTable) => void;
  updateTable: (table: LobbyTable) => void;
  removeTable: (tableId: string) => void;
  setFilters: (filters: Partial<TableFilters>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  increasePage: () => void;
  resetPage: () => void;
}

export const useTablesStore = create<TablesState>((set) => ({
  tables: [],
  allTables: [],
  filters: DEFAULT_FILTERS,
  loading: false,
  error: null,
  hasMore: true,
  page: 0,
  
  setTables: (tables) => set({ tables, allTables: tables }),
  addTable: (table) => set((state) => {
    // Check if table already exists to avoid duplicates
    if (state.allTables.some(t => t.id === table.id)) return state;
    
    return {
      tables: [table, ...state.tables],
      allTables: [table, ...state.allTables],
    };
  }),
  updateTable: (updatedTable) => set((state) => ({
    tables: state.tables.map(table => 
      table.id === updatedTable.id ? updatedTable : table
    ),
    allTables: state.allTables.map(table => 
      table.id === updatedTable.id ? updatedTable : table
    ),
  })),
  removeTable: (tableId) => set((state) => ({
    tables: state.tables.filter(table => table.id !== tableId),
    allTables: state.allTables.filter(table => table.id !== tableId),
  })),
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setHasMore: (hasMore) => set({ hasMore }),
  increasePage: () => set((state) => ({ page: state.page + 1 })),
  resetPage: () => set({ page: 0 }),
}));
