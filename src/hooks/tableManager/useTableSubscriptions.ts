
import { useEffect } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { OpenTable, TableNotifications } from '@/types/tableManager';

interface UseTableSubscriptionsProps {
  openTables: OpenTable[];
  updateTableStatus: (tableId: string, updates: Partial<OpenTable>) => void;
  updateNotifications: (tableId: string, notifications: Partial<TableNotifications>) => void;
}

export function useTableSubscriptions({
  openTables,
  updateTableStatus,
  updateNotifications
}: UseTableSubscriptionsProps) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id || openTables.length === 0) return;

    const channels = openTables.map(table => {
      const channel = supabase
        .channel(`table-${table.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'table_games',
          filter: `table_id=eq.${table.id}`
        }, (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            const gameData = payload.new as Record<string, any>;
            updateTableStatus(table.id, {
              pot: gameData.pot || 0,
              gamePhase: gameData.phase || undefined,
              lastActivity: new Date()
            });

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
  }, [user?.id, openTables.length, updateTableStatus, updateNotifications]);
}
