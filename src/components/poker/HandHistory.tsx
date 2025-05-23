
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface HandHistoryProps {
  tableId: string;
}

interface HandRecord {
  id: string;
  hand_number: number;
  created_at: string;
  winner_name?: string;
  pot_size?: number;
  players?: string[];
  actions?: any[];
}

export function HandHistory({ tableId }: HandHistoryProps) {
  const [handHistory, setHandHistory] = useState<HandRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHandHistory = async () => {
      setIsLoading(true);
      try {
        // This is a placeholder query - actual implementation will depend on your database structure
        const { data, error } = await supabase
          .from('hands')
          .select('*')
          .eq('table_id', tableId)
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (error) {
          console.error('Error fetching hand history:', error);
        } else {
          setHandHistory(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch hand history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHandHistory();
  }, [tableId]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-[400px] bg-navy/20 rounded-md border border-emerald/10 p-4 items-center justify-center">
        <p className="text-muted-foreground">Loading hand history...</p>
      </div>
    );
  }

  if (handHistory.length === 0) {
    return (
      <div className="flex flex-col h-[400px] bg-navy/20 rounded-md border border-emerald/10 p-4 items-center justify-center">
        <p className="text-center text-muted-foreground">
          No hand history available for this table yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[400px] bg-navy/20 rounded-md border border-emerald/10 p-4">
      <h3 className="font-medium text-sm mb-4">Recent Hands</h3>
      <div className="overflow-y-auto space-y-2">
        {handHistory.map((hand) => (
          <div 
            key={hand.id} 
            className="p-3 bg-navy/40 rounded-md border border-emerald/10"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-sm">Hand #{hand.hand_number}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(hand.created_at).toLocaleString()}
                </p>
              </div>
              {hand.pot_size && (
                <div className="text-right">
                  <span className="text-emerald-400 font-medium">${hand.pot_size}</span>
                  {hand.winner_name && (
                    <p className="text-xs text-muted-foreground">Won by {hand.winner_name}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
