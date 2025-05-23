
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { LobbyTable, PlayerAtTable } from '@/types/lobby';
import { PlayerAction } from '@/types/poker';
import { useAuth } from '@/stores/auth';
import { useGameStore } from '@/stores/game';

// Timeout configuration (30 seconds for each turn)
const TURN_TIMEOUT_MS = 30000;

export function useGameRoom(tableId: string | undefined) {
  const [table, setTable] = useState<LobbyTable | null>(null);
  const [players, setPlayers] = useState<PlayerAtTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [turnTimeRemaining, setTurnTimeRemaining] = useState(TURN_TIMEOUT_MS);
  const [turnStartTime, setTurnStartTime] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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
    leaveSeat,
    placeBet
  } = useGameStore();
  
  // Find player's seat if they are at the table
  const playerSeatIndex = user && gameState?.seats ? 
    gameState.seats.findIndex(
      seat => seat !== null && seat.playerId === user.id
    ) : -1;
  
  const isPlayerSeated = playerSeatIndex !== -1;
  
  // Is it the player's turn
  const isPlayerTurn = user?.id && gameState?.activePlayerId === user.id;
  
  // Reset turn timer when active player changes
  useEffect(() => {
    if (isPlayerTurn) {
      setTurnStartTime(Date.now());
      setTurnTimeRemaining(TURN_TIMEOUT_MS);
      
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Start the countdown timer
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - (turnStartTime || Date.now());
        const remaining = Math.max(0, TURN_TIMEOUT_MS - elapsed);
        setTurnTimeRemaining(remaining);
        
        if (remaining <= 0 && timerRef.current) {
          clearInterval(timerRef.current);
        }
      }, 100);
    } else {
      // Not player's turn, clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlayerTurn, turnStartTime]);
  
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
  }, [tableId, user, toast, navigate, initializeGame]);
  
  // Set up real-time subscriptions
  useEffect(() => {
    if (!tableId || !user) return;
    
    fetchGameData();
    
    // Set up real-time subscriptions
    const tableChannel = supabase
      .channel(`table:${tableId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'lobby_tables',
          filter: `id=eq.${tableId}`
        }, 
        (payload) => {
          setTable(payload.new as LobbyTable);
          
          // Check if table was closed
          if (payload.new.status === 'CLOSED') {
            toast({
              title: 'Table Closed',
              description: 'This table has been closed',
              variant: 'destructive',
            });
            navigate('/tables');
          }
        }
      )
      .subscribe();
      
    const playersChannel = supabase
      .channel(`players:${tableId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'players_at_table',
          filter: `table_id=eq.${tableId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPlayers(current => [...current, payload.new as PlayerAtTable]);
            
            // Notify that a new player joined
            if (payload.new.player_id !== user.id) {
              toast({
                title: 'Player Joined',
                description: `A new player has joined the table`,
                variant: 'default',
              });
            }
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
            
            // Notify that a player left
            if (payload.old.player_id !== user.id) {
              toast({
                title: 'Player Left',
                description: `A player has left the table`,
                variant: 'default',
              });
            }
          }
        }
      )
      .subscribe();
      
    // Setup presence channel for player actions
    const gamePresenceChannel = supabase.channel(`presence:${tableId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Track online users
    gamePresenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = gamePresenceChannel.presenceState();
        console.log('Online users:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (key !== user.id) {
          toast({
            title: 'Player joined',
            description: `Player ${newPresences[0]?.user_alias || key} joined the table`,
          });
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key !== user.id) {
          toast({
            title: 'Player disconnected',
            description: `A player disconnected from the table`,
          });
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await gamePresenceChannel.track({
            user_id: user.id,
            user_alias: user.email || 'Anonymous',
            online_at: new Date().toISOString(),
          });
        }
      });
      
    return () => {
      supabase.removeChannel(tableChannel);
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(gamePresenceChannel);
      disconnectGame();
    };
  }, [tableId, user, disconnectGame, fetchGameData, navigate]);
  
  const handleSitDown = async (seatNumber: number, buyIn?: number) => {
    if (!user || !tableId || !table) return;
    
    try {
      // Default buy-in at minimum if not provided
      const amount = buyIn || table.min_buy_in;
      
      // Create player at table entry
      const { error } = await supabase
        .from('players_at_table')
        .upsert({
          player_id: user.id,
          table_id: tableId,
          seat_number: seatNumber,
          stack: amount,
          status: 'SITTING'
        }, { onConflict: 'player_id, table_id' });
        
      if (error) throw error;
      
      // Update the game state
      await takeSeat(seatNumber, user.id, user.email || 'Player', amount);
      
      // Broadcast to all players that someone took a seat
      await supabase.channel(`game:${tableId}`).send({
        type: 'broadcast',
        event: 'player_seated',
        payload: {
          seatNumber,
          playerId: user.id,
          playerName: user.email || 'Player',
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
  
  const handleAction = async (action: PlayerAction, amount?: number) => {
    if (!user || !isPlayerTurn) return;
    
    try {
      await placeBet(user.id, action, amount);
      
      // Reset turn timer
      setTurnTimeRemaining(TURN_TIMEOUT_MS);
      setTurnStartTime(null);
      
      toast({
        title: 'Action performed',
        description: `You ${action.toLowerCase()}${amount ? ` ${amount}` : ''}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to perform action: ${error.message}`,
        variant: 'destructive',
      });
    }
  };
  
  const leaveTable = async () => {
    if (!user || !tableId) return;
    
    try {
      // If player is seated, first leave the seat
      if (isPlayerSeated) {
        await leaveSeat(user.id);
      }
      
      // Delete the player_at_table entry
      const { error } = await supabase
        .from('players_at_table')
        .delete()
        .eq('table_id', tableId)
        .eq('player_id', user.id);
        
      if (error) throw error;
      
      // Broadcast to all players that someone left
      await supabase.channel(`game:${tableId}`).send({
        type: 'broadcast',
        event: 'player_left',
        payload: {
          playerId: user.id,
          playerName: user.email || 'Player',
        },
      });
      
      toast({
        title: 'Success',
        description: 'You have left the table',
      });
      
      navigate('/tables');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to leave table: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

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
    turnTimeRemaining,
    userId: user?.id,
    handleSitDown,
    handleAction,
    leaveTable
  };
}
