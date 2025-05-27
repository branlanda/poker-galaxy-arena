
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SitAndGoGame, SitAndGoPlayer } from '@/types/sitAndGo';
import { useAuth } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';

export const useSitAndGo = () => {
  const [games, setGames] = useState<SitAndGoGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchGames = async () => {
    try {
      setLoading(true);
      const { data: gamesData, error: gamesError } = await supabase
        .from('sit_and_go_games')
        .select(`
          *,
          sit_and_go_players!inner(
            *,
            profiles(alias, avatar_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (gamesError) throw gamesError;

      // Process games with player counts
      const processedGames = (gamesData || []).map(game => ({
        ...game,
        current_players: game.sit_and_go_players?.length || 0,
        players: game.sit_and_go_players || []
      }));

      setGames(processedGames);
    } catch (err) {
      console.error('Error fetching sit and go games:', err);
      setError(err instanceof Error ? err.message : 'Error fetching games');
    } finally {
      setLoading(false);
    }
  };

  const createGame = async (gameData: Partial<SitAndGoGame>) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to create a Sit & Go game',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('sit_and_go_games')
        .insert([{
          ...gameData,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Game Created',
        description: 'Your Sit & Go game has been created successfully!',
        variant: 'default'
      });

      await fetchGames();
      return data;
    } catch (err) {
      console.error('Error creating game:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create game',
        variant: 'destructive'
      });
      return false;
    }
  };

  const joinGame = async (gameId: string, seatNumber: number) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to join a game',
        variant: 'destructive'
      });
      return false;
    }

    try {
      // Get game details to determine starting chips
      const { data: gameData, error: gameError } = await supabase
        .from('sit_and_go_games')
        .select('starting_chips, status, max_players')
        .eq('id', gameId)
        .single();

      if (gameError) throw gameError;

      if (gameData.status !== 'WAITING') {
        toast({
          title: 'Game Unavailable',
          description: 'This game is no longer accepting players',
          variant: 'destructive'
        });
        return false;
      }

      // Check current player count
      const { count } = await supabase
        .from('sit_and_go_players')
        .select('*', { count: 'exact', head: true })
        .eq('game_id', gameId);

      if (count && count >= gameData.max_players) {
        toast({
          title: 'Game Full',
          description: 'This game is already full',
          variant: 'destructive'
        });
        return false;
      }

      const { data, error } = await supabase
        .from('sit_and_go_players')
        .insert([{
          game_id: gameId,
          player_id: user.id,
          seat_number: seatNumber,
          chips: gameData.starting_chips
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Joined Game',
        description: 'You have successfully joined the Sit & Go game!',
        variant: 'default'
      });

      await fetchGames();
      return data;
    } catch (err) {
      console.error('Error joining game:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to join game',
        variant: 'destructive'
      });
      return false;
    }
  };

  const leaveGame = async (gameId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('sit_and_go_players')
        .delete()
        .eq('game_id', gameId)
        .eq('player_id', user.id);

      if (error) throw error;

      toast({
        title: 'Left Game',
        description: 'You have left the Sit & Go game',
        variant: 'default'
      });

      await fetchGames();
      return true;
    } catch (err) {
      console.error('Error leaving game:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to leave game',
        variant: 'destructive'
      });
      return false;
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchGames();

    const gamesChannel = supabase
      .channel('sit-and-go-games')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sit_and_go_games'
        },
        () => {
          fetchGames();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sit_and_go_players'
        },
        () => {
          fetchGames();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gamesChannel);
    };
  }, []);

  return {
    games,
    loading,
    error,
    createGame,
    joinGame,
    leaveGame,
    refreshGames: fetchGames
  };
};
