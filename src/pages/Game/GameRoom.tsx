
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/Button';
import { LobbyTable, PlayerAtTable } from '@/types/lobby';
import { useAuth } from '@/stores/auth';

export default function GameRoom() {
  const { tableId } = useParams<{ tableId: string }>();
  const [table, setTable] = useState<LobbyTable | null>(null);
  const [players, setPlayers] = useState<PlayerAtTable[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
    };
  }, [tableId, toast, navigate]);
  
  const leaveTable = async () => {
    if (!user || !tableId) return;
    
    try {
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 grid place-items-center h-[80vh]">
        <p>Loading game room...</p>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="container mx-auto px-4 py-6 grid place-items-center h-[80vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Table not found</h2>
          <Button onClick={() => navigate('/lobby')}>Return to Lobby</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald">{table.name}</h1>
        <Button variant="outline" onClick={leaveTable}>
          Leave Table
        </Button>
      </div>
      
      <div className="bg-navy/50 border border-emerald/10 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Table Info</h2>
            <div className="space-y-2">
              <p><span className="text-gray-400">Blinds:</span> {table.small_blind} / {table.big_blind}</p>
              <p><span className="text-gray-400">Buy-in Range:</span> {table.min_buy_in} - {table.max_buy_in}</p>
              <p><span className="text-gray-400">Type:</span> {table.table_type}</p>
              <p><span className="text-gray-400">Players:</span> {table.current_players} / {table.max_players}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Players</h2>
            {players.length > 0 ? (
              <div className="space-y-2">
                {players.map((player) => (
                  <div key={player.id} className="flex justify-between items-center p-2 border border-emerald/10 rounded">
                    <div>
                      <p>{player.player_id === user?.id ? 'You' : `Player ${player.seat_number || '(unseated)'}`}</p>
                      <p className="text-xs text-gray-400">Stack: {player.stack}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        player.status === 'ACTIVE' ? 'bg-green-900/50 text-green-300' : 
                        player.status === 'AWAY' ? 'bg-amber-900/50 text-amber-300' :
                        'bg-gray-800 text-gray-300'
                      }`}>
                        {player.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No players at this table yet.</p>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-2">Game interface coming soon!</p>
          <p className="text-sm text-gray-500">
            This is a placeholder for the full game interface that will be implemented in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}
