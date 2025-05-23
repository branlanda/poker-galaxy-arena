
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { useLobby } from '@/stores/lobby';
import { LobbyTable } from '@/types/lobby';
import { useTranslation } from '@/hooks/useTranslation';

export function useJoinTable() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setTables } = useLobby();
  const { t } = useTranslation();

  const joinTable = async (table: LobbyTable, passwordAttempt?: string) => {
    if (!user) {
      toast({
        title: t('error'),
        description: t('mustBeLoggedIn'),
        variant: 'destructive',
      });
      return false;
    }

    if (table.is_private && !passwordAttempt) {
      toast({
        title: t('error'),
        description: t('privateTablePasswordRequired'),
        variant: 'destructive',
      });
      return false;
    }

    if (table.is_private && table.password !== passwordAttempt) {
       toast({
         title: t('error'),
         description: t('incorrectPassword'),
         variant: 'destructive',
       });
       return false;
    }

    try {
      setLoading(true);

      // Check if the user already is at the table
      const { data: existingEntry, error: existingEntryError } = await supabase
        .from('players_at_table')
        .select('*')
        .eq('player_id', user.id)
        .eq('table_id', table.id)
        .single();

      if (existingEntryError && existingEntryError.code !== 'PGRST116') {
        throw existingEntryError;
      }

      if (existingEntry) {
        toast({
          title: t('error'),
          description: t('alreadyAtTable'),
          variant: 'destructive',
        });
        navigate(`/game/${table.id}`);
        return false;
      }

      // Join the table
      const { error } = await supabase
        .from('players_at_table')
        .insert({
          player_id: user.id,
          table_id: table.id,
          stack: table.min_buy_in, // Default to min buy-in
        });

      if (error) throw error;

      // Optimistically update the lobby tables
      setTables((prevTables: LobbyTable[]) =>
        prevTables.map((t) =>
          t.id === table.id ? { ...t, current_players: (t.current_players || 0) + 1 } : t
        )
      );

      toast({
        title: t('success'),
        description: t('joinedTable', { name: table.name }),
      });
      navigate(`/game/${table.id}`);
      return true;
    } catch (error: any) {
      toast({
        title: t('error'),
        description: t('failedToJoinTable', { message: error.message }),
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    joinTable,
    loading,
  };
}
