
import { create } from 'zustand';
import { LobbyTable } from '@/types/lobby';

interface LobbyState {
  tables: LobbyTable[];
  loading: boolean;
  error: string | null;
  setTables: (tables: LobbyTable[] | ((prevTables: LobbyTable[]) => LobbyTable[])) => void;
  updateTable: (table: LobbyTable) => void;
  removeTable: (tableId: string) => void;
}

export const useLobby = create<LobbyState>((set) => ({
  tables: [],
  loading: false,
  error: null,
  
  setTables: (tables) => set((state) => ({
    tables: typeof tables === 'function' ? tables(state.tables) : tables
  })),
  
  updateTable: (updatedTable) => set((state) => ({
    tables: state.tables.map(table => 
      table.id === updatedTable.id ? updatedTable : table
    ),
  })),
  
  removeTable: (tableId) => set((state) => ({
    tables: state.tables.filter(table => table.id !== tableId),
  })),
}));
