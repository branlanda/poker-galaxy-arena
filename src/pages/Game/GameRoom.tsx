
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/Button';
import { LobbyTable, PlayerAtTable } from '@/types/lobby';
import { useAuth } from '@/stores/auth';
import { useGameStore } from '@/stores/game';
import { PlayerSeat } from '@/components/poker/PlayerSeat';
import { PokerChip } from '@/components/poker/PokerChip';
import { PokerCard } from '@/components/poker/PokerCard';
import { CommunityCards } from '@/components/poker/CommunityCards';
import { BetActions } from '@/components/poker/BetActions';
import { GameMessages } from '@/components/poker/GameMessages';
import { ChatRoom } from '@/components/poker/ChatRoom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Users, MessageCircle, Clock, Award } from 'lucide-react';

export default function GameRoom() {
  const { tableId } = useParams<{ tableId: string }>();
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
  const playerSeat = user && gameState?.seats.findIndex(
    seat => seat !== null && seat.playerId === user.id
  );
  
  const isPlayerSeated = playerSeat !== undefined && playerSeat !== -1;
  
  // Is it the player's turn
  const isPlayerTurn = user && gameState?.activePlayerId === user.id;
  
  useEffect(() => {
    if (!tableId) return;
    
    // Fetch table details
    const fetchTableDetails = async () => {
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
          navigate('/lobby');
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
    };
    
    fetchTableDetails();
    
    // Set up real-time subscriptions
    const tableChannel = supabase
      .channel('table_updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'lobby_tables',
          filter: `id=eq.${tableId}`
        }, 
        (payload) => {
          setTable(payload.new as LobbyTable);
        }
      )
      .subscribe();
      
    const playersChannel = supabase
      .channel('players_updates')
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
      
    return () => {
      supabase.removeChannel(tableChannel);
      supabase.removeChannel(playersChannel);
      disconnectGame();
    };
  }, [tableId, toast, navigate, initializeGame, disconnectGame]);
  
  const handleSitDown = async (seatNumber: number) => {
    if (!user || !tableId || !table) return;
    
    try {
      // Default buy-in at minimum
      const buyIn = table.min_buy_in;
      
      // Create player at table entry
      const { error } = await supabase
        .from('players_at_table')
        .upsert({
          player_id: user.id,
          table_id: tableId,
          seat_number: seatNumber,
          stack: buyIn,
          status: 'SITTING'
        }, { onConflict: 'player_id, table_id' });
        
      if (error) throw error;
      
      // Update the game state
      await takeSeat(seatNumber, user.id, user.alias || user.email || 'Player', buyIn);
      
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
    return (
      <div className="container mx-auto px-4 py-6 grid place-items-center h-[80vh]">
        <p>Loading game room...</p>
      </div>
    );
  }

  if (gameError || !table) {
    return (
      <div className="container mx-auto px-4 py-6 grid place-items-center h-[80vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">
            {gameError ? `Error: ${gameError}` : 'Table not found'}
          </h2>
          <Button onClick={() => navigate('/lobby')}>Return to Lobby</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Table header with info and controls */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald">{table.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
            <span>Blinds: {table.small_blind}/{table.big_blind}</span>
            <span>•</span>
            <span>Buy-in: {table.min_buy_in}-{table.max_buy_in}</span>
            <span>•</span>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" /> 
              <span>Hand #{table.hand_number || 0}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={leaveTable}>
          Leave Table
        </Button>
      </div>
      
      {/* Main poker table layout */}
      <div className="bg-navy/50 border border-emerald/10 rounded-lg p-6 mb-6">
        {/* The table itself */}
        <div className="relative">
          {/* Elliptical table background */}
          <div className="aspect-[4/3] w-full bg-green-900/80 rounded-[50%] border-8 border-amber-950 shadow-xl overflow-hidden relative mb-8">
            {/* Table felt pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
            
            {/* Center info area */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {gameState?.pot > 0 && (
                <div className="flex flex-col items-center mb-4">
                  <div className="flex gap-1">
                    <PokerChip value={gameState.pot} size="lg" />
                  </div>
                  <p className="text-white font-medium mt-2">Pot: {gameState.pot}</p>
                </div>
              )}
              
              {/* Community cards */}
              <div className="mb-4">
                <CommunityCards 
                  cards={gameState?.communityCards || []}
                  phase={gameState?.phase || 'WAITING'} 
                />
              </div>
              
              {/* Game phase display */}
              <div className="bg-black/30 px-4 py-1 rounded-full">
                <p className="text-sm font-medium text-gray-300">
                  {gameState?.phase || 'Waiting for players'}
                </p>
              </div>
            </div>
            
            {/* Player positions - 9-player layout */}
            <div className="absolute inset-0">
              {/* Top row (seats 0-2) */}
              <div className="absolute top-[5%] left-0 right-0 flex justify-between px-[15%]">
                <div><PlayerSeat position={0} state={gameState?.seats[0] || null} isCurrentPlayer={playerSeat === 0} onSitDown={!isPlayerSeated ? handleSitDown : undefined} /></div>
                <div><PlayerSeat position={1} state={gameState?.seats[1] || null} isCurrentPlayer={playerSeat === 1} onSitDown={!isPlayerSeated ? handleSitDown : undefined} /></div>
                <div><PlayerSeat position={2} state={gameState?.seats[2] || null} isCurrentPlayer={playerSeat === 2} onSitDown={!isPlayerSeated ? handleSitDown : undefined} /></div>
              </div>
              
              {/* Left middle (seat 3) */}
              <div className="absolute top-[40%] left-[2%]">
                <PlayerSeat position={3} state={gameState?.seats[3] || null} isCurrentPlayer={playerSeat === 3} onSitDown={!isPlayerSeated ? handleSitDown : undefined} />
              </div>
              
              {/* Right middle (seat 4) */}
              <div className="absolute top-[40%] right-[2%]">
                <PlayerSeat position={4} state={gameState?.seats[4] || null} isCurrentPlayer={playerSeat === 4} onSitDown={!isPlayerSeated ? handleSitDown : undefined} />
              </div>
              
              {/* Bottom row (seats 5-8) */}
              <div className="absolute bottom-[5%] left-0 right-0 flex justify-between px-[10%]">
                <div><PlayerSeat position={5} state={gameState?.seats[5] || null} isCurrentPlayer={playerSeat === 5} onSitDown={!isPlayerSeated ? handleSitDown : undefined} /></div>
                <div><PlayerSeat position={6} state={gameState?.seats[6] || null} isCurrentPlayer={playerSeat === 6} onSitDown={!isPlayerSeated ? handleSitDown : undefined} /></div>
                <div><PlayerSeat position={7} state={gameState?.seats[7] || null} isCurrentPlayer={playerSeat === 7} onSitDown={!isPlayerSeated ? handleSitDown : undefined} /></div>
                <div><PlayerSeat position={8} state={gameState?.seats[8] || null} isCurrentPlayer={playerSeat === 8} onSitDown={!isPlayerSeated ? handleSitDown : undefined} /></div>
              </div>
            </div>
          </div>
          
          {/* Action area (only shown when it's the player's turn) */}
          {isPlayerTurn && isPlayerSeated && gameState?.seats[playerSeat] && (
            <div className="mt-4 flex justify-center">
              <BetActions
                playerId={user!.id}
                playerStack={gameState.seats[playerSeat]!.stack}
                currentBet={gameState.currentBet}
                playerBet={gameState.seats[playerSeat]!.bet}
              />
            </div>
          )}
          
          {/* Game messages, chat, and player list */}
          <div className="mt-6">
            <Tabs defaultValue="actions" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="actions">
                  <Award className="h-4 w-4 mr-2" /> Game Actions
                </TabsTrigger>
                <TabsTrigger value="chat">
                  <MessageCircle className="h-4 w-4 mr-2" /> Chat
                </TabsTrigger>
                <TabsTrigger value="players">
                  <Users className="h-4 w-4 mr-2" /> Players
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="actions" className="border border-emerald/10 rounded-md p-4 bg-navy/30">
                <GameMessages
                  action={
                    gameState?.lastAction ? {
                      playerName: gameState.seats.find(
                        s => s !== null && s.playerId === gameState.lastAction?.playerId
                      )?.playerName || 'Player',
                      action: gameState.lastAction.action,
                      amount: gameState.lastAction.amount
                    } : undefined
                  }
                  gamePhase={gameState?.phase}
                />
              </TabsContent>
              
              <TabsContent value="chat" className="border border-emerald/10 rounded-md p-4 bg-navy/30 h-[350px]">
                {tableId && <ChatRoom tableId={tableId} />}
              </TabsContent>
              
              <TabsContent value="players" className="border border-emerald/10 rounded-md p-4 bg-navy/30">
                <h3 className="text-sm font-medium mb-4 text-gray-300">Players at Table ({players.length}/{table.max_players})</h3>
                <div className="space-y-2">
                  {players.map(player => (
                    <div 
                      key={player.id} 
                      className="flex items-center justify-between p-2 rounded-sm bg-navy/30"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-emerald/20 text-emerald">
                            {player.player_id === user?.id ? 'You' : 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {player.player_id === user?.id ? 'You' : `Player ${player.seat_number !== null ? player.seat_number : '(unseated)' }`}
                          </div>
                          <div className="text-xs text-gray-400">
                            Stack: {player.stack}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          player.status === 'ACTIVE' ? 'bg-green-900/50 text-green-300' : 
                          player.status === 'AWAY' ? 'bg-amber-900/50 text-amber-300' :
                          'bg-gray-800 text-gray-300'
                        }`}>
                          {player.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {players.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No players have joined this table yet.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
