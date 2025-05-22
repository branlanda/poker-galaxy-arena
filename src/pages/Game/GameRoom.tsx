
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { LobbyTable, PlayerAtTable } from '@/types/lobby';
import { useAuth } from '@/stores/auth';
import { useGameStore } from '@/stores/game';

// Import our components
import { TableHeader } from '@/components/poker/TableHeader';
import { PokerTable } from '@/components/poker/PokerTable';
import { GameTabs } from '@/components/poker/GameTabs';
import { LoadingState } from '@/components/poker/LoadingState';
import { ErrorState } from '@/components/poker/ErrorState';

export default function GameRoom() {
  const { id } = useParams<{ id: string }>();
  const [table, setTable] = useState<LobbyTable | null>(null);
  const [players, setPlayers] = useState<PlayerAtTable[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Game state from Zustand store
  const { 
    gameState, 
    isLoading: gameLoading, 
    error: gameError,
    initializeGame,
    disconnectGame,
    takeSeat,
    leaveSeat
  } = useGameStore();
  
  // Find player's seat if they are at the table
  const playerSeatIndex = user && gameState?.seats.findIndex(
    seat => seat !== null && seat.playerId === user.id
  );
  
  const isPlayerSeated = playerSeatIndex !== undefined && playerSeatIndex !== -1;
  
  // Is it the player's turn
  const isPlayerTurn = user && gameState?.activePlayerId === user.id;
  
  // Function to fetch all necessary data
  const fetchGameData = useCallback(async () => {
    if (!id || !user) return;
    
    try {
      setLoading(true);
      
      // Get table data
      const { data: tableData, error: tableError } = await supabase
        .from('lobby_tables')
        .select('*')
        .eq('id', id)
        .single();
        
      if (tableError) {
        toast({
          title: 'Error',
          description: 'Table not found',
          variant: 'destructive',
        });
        navigate('/lobby');
        return;
      }
      
      setTable(tableData as LobbyTable);
      
      // Get players at table
      const { data: playersData, error: playersError } = await supabase
        .from('players_at_table')
        .select('*')
        .eq('table_id', id);
        
      if (playersError) throw playersError;
      
      setPlayers(playersData as PlayerAtTable[]);
      
      // Initialize the game state
      await initializeGame(id);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to load game: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [id, user, toast, navigate, initializeGame]);
  
  useEffect(() => {
    if (!id || !user) return;
    
    fetchGameData();
    
    // Set up real-time subscriptions
    const tableChannel = supabase
      .channel(`table:${id}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'lobby_tables',
          filter: `id=eq.${id}`
        }, 
        (payload) => {
          setTable(payload.new as LobbyTable);
        }
      )
      .subscribe();
      
    const playersChannel = supabase
      .channel(`players:${id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'players_at_table',
          filter: `table_id=eq.${id}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPlayers(current => [...current, payload.new as PlayerAtTable]);
          } 
          else if (payload.eventType === 'UPDATE') {
            setPlayers(current => 
              current.map(player => 
                player.id === payload.new.id ? payload.new as PlayerAtTable : player
              )
            );
          }
          else if (payload.eventType === 'DELETE') {
            setPlayers(current => 
              current.filter(player => player.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();
      
    // Setup presence channel for player actions
    const gamePresenceChannel = supabase.channel(`presence:${id}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Track online users
    if (user) {
      gamePresenceChannel
        .on('presence', { event: 'sync' }, () => {
          const state = gamePresenceChannel.presenceState();
          console.log('Online users:', state);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          toast({
            title: 'Player joined',
            description: `Player ${newPresences[0]?.user_alias || key} joined the table`,
          });
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await gamePresenceChannel.track({
              user_id: user.id,
              user_alias: user.alias || user.email || 'Anonymous',
              online_at: new Date().toISOString(),
            });
          }
        });
    }
      
    return () => {
      supabase.removeChannel(tableChannel);
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(gamePresenceChannel);
      disconnectGame();
    };
  }, [id, user, disconnectGame]);
  
  const handleSitDown = async (seatNumber: number) => {
    if (!user || !id || !table) return;
    
    try {
      // Default buy-in at minimum
      const buyIn = table.min_buy_in;
      
      // Create player at table entry
      const { error } = await supabase
        .from('players_at_table')
        .upsert({
          player_id: user.id,
          table_id: id,
          seat_number: seatNumber,
          stack: buyIn,
          status: 'SITTING'
        }, { onConflict: 'player_id, table_id' });
        
      if (error) throw error;
      
      // Update the game state
      await takeSeat(seatNumber, user.id, user.alias || user.email || 'Player', buyIn);
      
      // Broadcast to all players that someone took a seat
      await supabase.channel(`game:${id}`).send({
        type: 'broadcast',
        event: 'player_seated',
        payload: {
          seatNumber,
          playerId: user.id,
          playerName: user.alias || user.email || 'Player',
        },
      });
      
      toast({
        title: 'Success',
        description: 'You have taken a seat at the table',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to take seat: ${error.message}`,
        variant: 'destructive',
      });
    }
  };
  
  const leaveTable = async () => {
    if (!user || !id) return;
    
    try {
      // If player is seated, first leave the seat
      if (isPlayerSeated) {
        await leaveSeat(user.id);
      }
      
      // Delete the player_at_table entry
      const { error } = await supabase
        .from('players_at_table')
        .delete()
        .eq('table_id', id)
        .eq('player_id', user.id);
        
      if (error) throw error;
      
      // Broadcast to all players that someone left
      await supabase.channel(`game:${id}`).send({
        type: 'broadcast',
        event: 'player_left',
        payload: {
          playerId: user.id,
          playerName: user.alias || user.email || 'Player',
        },
      });
      
      toast({
        title: 'Success',
        description: 'You have left the table',
      });
      
      navigate('/lobby');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to leave table: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  if (loading || gameLoading) {
    return <LoadingState />;
  }

  if (gameError || !table) {
    return <ErrorState error={gameError} />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Table header with info and controls */}
      <TableHeader table={table} onLeaveTable={leaveTable} />
      
      {/* Main poker table layout */}
      <div className="bg-navy/50 border border-emerald/10 rounded-lg p-6 mb-6">
        {/* The table itself */}
        <PokerTable 
          gameState={gameState}
          isPlayerSeated={isPlayerSeated}
          isPlayerTurn={isPlayerTurn}
          playerSeatIndex={playerSeatIndex || -1}
          userId={user?.id}
          onSitDown={handleSitDown}
        />
        
        {/* Game messages, chat, and player list */}
        <div className="mt-6">
          <GameTabs 
            gameState={gameState}
            tableId={id}
            players={players}
            maxPlayers={table.max_players}
            userId={user?.id}
          />
        </div>
      </div>
    </div>
  );
}
