
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { GameAction } from '@/types/poker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

interface HandHistoryProps {
  tableId: string;
}

export function HandHistory({ tableId }: HandHistoryProps) {
  const [actions, setActions] = useState<GameAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchHandHistory() {
      try {
        setLoading(true);
        
        // First get the game id for this table
        const { data: gameData, error: gameError } = await supabase
          .from('table_games')
          .select('id')
          .eq('table_id', tableId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (gameError) {
          if (gameError.code === 'PGRST116') {
            // No game found
            setActions([]);
            return;
          }
          throw gameError;
        }
        
        const gameId = gameData.id;
        
        // Now get the actions for this game
        const { data, error } = await supabase
          .from('table_actions')
          .select('*')
          .eq('game_id', gameId)
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        
        setActions(data.map((action: any) => ({
          id: action.id,
          gameId: action.game_id,
          playerId: action.player_id,
          action: action.action,
          amount: action.amount,
          createdAt: action.created_at
        })));
        
      } catch (err: any) {
        console.error('Error fetching hand history:', err);
        setError(err.message || 'Failed to load hand history');
      } finally {
        setLoading(false);
      }
    }
    
    fetchHandHistory();
    
    // Subscribe to new actions
    const channel = supabase
      .channel(`hand-history-${tableId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT',
          schema: 'public',
          table: 'table_actions'
        },
        (payload) => {
          const newAction = {
            id: payload.new.id,
            gameId: payload.new.game_id,
            playerId: payload.new.player_id,
            action: payload.new.action,
            amount: payload.new.amount,
            createdAt: payload.new.created_at
          };
          setActions(prev => [newAction, ...prev.slice(0, 49)]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-emerald" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-400">
        {error}
      </div>
    );
  }
  
  if (actions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        No hand history available for this table.
      </div>
    );
  }
  
  // Format the action for display
  const formatAction = (action: GameAction) => {
    const actionText = {
      'FOLD': 'folded',
      'CHECK': 'checked',
      'CALL': `called ${action.amount}`,
      'BET': `bet ${action.amount}`,
      'RAISE': `raised to ${action.amount}`,
      'ALL_IN': `went ALL IN with ${action.amount}`
    }[action.action] || action.action;
    
    const timestamp = new Date(action.createdAt).toLocaleTimeString([], { 
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    return `[${timestamp}] Player ${action.playerId.substring(0, 4)} ${actionText}`;
  };
  
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-2">
        {actions.map(action => (
          <div key={action.id} className="text-sm p-2 rounded bg-navy/30">
            {formatAction(action)}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
