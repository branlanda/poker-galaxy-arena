
import { useState, useEffect, useCallback } from 'react';
import { TableManagerState, OpenTable, TableNotifications } from '@/types/tableManager';
import { useTableData } from './useTableData';
import { useTableSubscriptions } from './useTableSubscriptions';

export function useTableManager() {
  const [state, setState] = useState<TableManagerState>({
    openTables: [],
    activeTableId: null,
    notifications: {}
  });

  const { loadOpenTables, closeTable: closeTableData } = useTableData();

  // Set active table
  const setActiveTable = useCallback((tableId: string) => {
    setState(prev => ({
      ...prev,
      activeTableId: tableId
    }));
  }, []);

  // Close table
  const closeTable = useCallback(async (tableId: string) => {
    const success = await closeTableData(tableId);
    
    if (success) {
      setState(prev => {
        const newOpenTables = prev.openTables.filter(table => table.id !== tableId);
        const newActiveTableId = prev.activeTableId === tableId 
          ? (newOpenTables[0]?.id ?? null)
          : prev.activeTableId;

        return {
          ...prev,
          openTables: newOpenTables,
          activeTableId: newActiveTableId
        };
      });
    }
  }, [closeTableData]);

  // Get notifications for a table
  const getTableNotifications = useCallback((tableId: string): TableNotifications => {
    return state.notifications[tableId] || {
      isPlayerTurn: false,
      unreadMessages: 0,
      hasAlert: false
    };
  }, [state.notifications]);

  // Update table status
  const updateTableStatus = useCallback((tableId: string, updates: Partial<OpenTable>) => {
    setState(prev => ({
      ...prev,
      openTables: prev.openTables.map(table =>
        table.id === tableId ? { ...table, ...updates } : table
      )
    }));
  }, []);

  // Update notifications
  const updateNotifications = useCallback((tableId: string, notifications: Partial<TableNotifications>) => {
    setState(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [tableId]: {
          ...prev.notifications[tableId],
          ...notifications
        }
      }
    }));
  }, []);

  // Load tables on mount
  useEffect(() => {
    const loadTables = async () => {
      const tables = await loadOpenTables();
      setState(prev => ({
        ...prev,
        openTables: tables,
        activeTableId: prev.activeTableId || (tables[0]?.id ?? null)
      }));
    };

    loadTables();
  }, [loadOpenTables]);

  // Set up real-time subscriptions
  useTableSubscriptions({
    openTables: state.openTables,
    updateTableStatus,
    updateNotifications
  });

  return {
    openTables: state.openTables,
    activeTableId: state.activeTableId,
    setActiveTable,
    closeTable,
    getTableNotifications,
    updateTableStatus,
    updateNotifications,
    refreshTables: async () => {
      const tables = await loadOpenTables();
      setState(prev => ({
        ...prev,
        openTables: tables
      }));
    }
  };
}
