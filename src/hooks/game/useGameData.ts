
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { LobbyTable, PlayerAtTable } from '@/types/lobby';
import { useAuth } from '@/stores/auth';
import { useGameStore } from '@/stores/game';

export function useGameData(tableId: string | undefined) {
  const [table, setTable] = useState<LobbyTable | null>(null);
  const [players, setPlayers] = useState<PlayerAtTable[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Game state from Zustand store
  const { 
    gameState, 
    isLoading: gameLoading, 
    error: gameError,
    initializeGame,
    disconnectGame
  } = useGameStore();
  
  // Find player's seat if they are at the table
  const playerSeatIndex = user && gameState?.seats ? 
    gameState.seats.findIndex(
      seat => seat !== null && seat.playerId === user.id
    ) : -1;
  
  const isPlayerSeated = playerSeatIndex !== -1;
  
  // Is it the player's turn
  const isPlayerTurn = user?.id && gameState?.activePlayerId === user.id;
  
  // Function to fetch all necessary data
  const fetchGameData = useCallback(async () => {
    if (!tableId || !user) return;
    
    try {
      setLoading(true);
      
      // Get table data
      const { data: tableData, error: tableError } = await supabase
        .from('lobby_tables')
        .select('*')
        .eq('id', tableId)
        .single();
        
      if (tableError) {
        toast({
          title: 'Error',
          description: 'Table not found',
          variant: 'destructive',
        });
        navigate('/tables');
        return;
      }
      
      setTable(tableData as LobbyTable);
      
      // Get players at table
      const { data: playersData, error: playersError } = await supabase
        .from('players_at_table')
        .select('*')
        .eq('table_id', tableId);
        
      if (playersError) throw playersError;
      
      setPlayers(playersData as PlayerAtTable[]);
      
      // Initialize the game state
      await initializeGame(tableId);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to load game: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [tableId, user, navigate, initializeGame]);
  
  // Load initial data
  useEffect(() => {
    if (!tableId || !user) return;
    
    fetchGameData();
    
    return () => {
      disconnectGame();
    };
  }, [tableId, user, disconnectGame, fetchGameData]);

  return {
    table,
    players,
    gameState, 
    loading,
    gameLoading,
    gameError,
    isPlayerSeated,
    isPlayerTurn,
    playerSeatIndex,
    userId: user?.id
  };
}
