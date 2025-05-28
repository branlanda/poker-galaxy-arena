
import { useCallback } from 'react';
import { useAuth } from '@/stores/auth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { OpenTable } from '@/types/tableManager';

export function useTableData() {
  const { user } = useAuth();

  const loadOpenTables = useCallback(async () => {
    if (!user?.id) return [];

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

      const openTables: OpenTable[] = (playersAtTables || []).map((item: any) => ({
        id: item.table_id,
        name: item.lobby_tables?.name || 'Unknown Table',
        type: (item.lobby_tables?.table_type as OpenTable['type']) || 'CASH_GAME',
        status: (item.lobby_tables?.status as OpenTable['status']) || 'WAITING',
        currentPlayers: item.lobby_tables?.current_players || 0,
        maxPlayers: item.lobby_tables?.max_players || 9,
        lastActivity: new Date(),
        joinedAt: new Date(item.joined_at)
      }));

      return openTables;

    } catch (error: any) {
      console.error('Error loading open tables:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las mesas activas',
        variant: 'destructive'
      });
      return [];
    }
  }, [user?.id]);

  const closeTable = useCallback(async (tableId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('players_at_table')
        .delete()
        .eq('table_id', tableId)
        .eq('player_id', user.id);

      if (error) throw error;

      toast({
        title: 'Mesa Cerrada',
        description: 'Has salido de la mesa exitosamente',
      });

      return true;

    } catch (error: any) {
      console.error('Error closing table:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cerrar la mesa',
        variant: 'destructive'
      });
      return false;
    }
  }, [user?.id]);

  return {
    loadOpenTables,
    closeTable
  };
}
