
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { OpenTable, TableNotifications, TableManagerState } from '@/types/tableManager';

export function useTableManager() {
  const { user } = useAuth();
  const [state, setState] = useState<TableManagerState>({
    openTables: [],
    activeTableId: null,
    notifications: {}
  });

  // Load user's open tables
  const loadOpenTables = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: playersAtTables, error } = await supabase
        .from('players_at_table')
        .select(`
          table_id,
          joined_at,
          lobby_tables!inner(
            id,
            name,
            table_type,
            status,
            current_players,
            max_players
          )
        `)
        .eq('player_id', user.id)
        .in('lobby_tables.status', ['WAITING', 'ACTIVE', 'RUNNING']);

      if (error) throw error;

      const openTables: OpenTable[] = playersAtTables?.map(item => ({
        id: item.table_id,
        name: item.lobby_tables?.name || 'Unknown Table',
        type: (item.lobby_tables?.table_type as OpenTable['type']) || 'CASH_GAME',
        status: (item.lobby_tables?.status as OpenTable['status']) || 'WAITING',
        currentPlayers: item.lobby_tables?.current_players || 0,
        maxPlayers: item.lobby_tables?.max_players || 9,
        lastActivity: new Date(),
        joinedAt: new Date(item.joined_at)
      })) || [];

      setState(prev => ({
        ...prev,
        openTables,
        activeTableId: prev.activeTableId || (openTables[0]?.id ?? null)
      }));

    } catch (error: any) {
      console.error('Error loading open tables:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las mesas activas',
        variant: 'destructive'
      });
    }
  }, [user?.id]);

  // Set active table
  const setActiveTable = useCallback((tableId: string) => {
    setState(prev => ({
      ...prev,
      activeTableId: tableId
    }));
  }, []);

  // Close table
  const closeTable = useCallback(async (tableId: string) => {
    if (!user?.id) return;

    try {
      // Leave the table
      const { error } = await supabase
        .from('players_at_table')
        .delete()
        .eq('table_id', tableId)
        .eq('player_id', user.id);

      if (error) throw error;

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

      toast({
        title: 'Mesa Cerrada',
        description: 'Has salido de la mesa exitosamente',
      });

    } catch (error: any) {
      console.error('Error closing table:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cerrar la mesa',
        variant: 'destructive'
      });
    }
  }, [user?.id]);

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
    loadOpenTables();
  }, [loadOpenTables]);

  // Set up real-time subscriptions for table updates
  useEffect(() => {
    if (!user?.id || state.openTables.length === 0) return;

    const channels = state.openTables.map(table => {
      const channel = supabase
        .channel(`table-${table.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'table_games',
          filter: `table_id=eq.${table.id}`
        }, (payload) => {
          // Update table status based on game state changes
          if (payload.new && typeof payload.new === 'object') {
            const gameData = payload.new as Record<string, any>;
            updateTableStatus(table.id, {
              pot: gameData.pot || 0,
              gamePhase: gameData.phase || undefined,
              lastActivity: new Date()
            });

            // Check if it's player's turn
            const isPlayerTurn = gameData.active_player_id === user.id;
            updateNotifications(table.id, { isPlayerTurn });
          }
        })
        .subscribe();

      return channel;
    });

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [user?.id, state.openTables.length, updateTableStatus, updateNotifications]);

  return {
    openTables: state.openTables,
    activeTableId: state.activeTableId,
    setActiveTable,
    closeTable,
    getTableNotifications,
    updateTableStatus,
    updateNotifications,
    refreshTables: loadOpenTables
  };
}
