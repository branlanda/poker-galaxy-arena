
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PokerCard } from './PokerCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface HandRecord {
  id: string;
  created_at: string;
  pot: number;
  community_cards: { rank: string; suit: string }[];
  winners: { player_id: string; player_name: string; amount: number; hand_description: string }[];
}

export function HandHistory() {
  const { id: tableId } = useParams<{ id: string }>();
  const [handHistory, setHandHistory] = useState<HandRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!tableId) return;
    
    const fetchHandHistory = async () => {
      try {
        setLoading(true);
        
        // This is a mock implementation - in a real app, you'd fetch from your hands table
        // For now, let's just set a mock hand history after a delay
        setTimeout(() => {
          setHandHistory([
            {
              id: '1',
              created_at: new Date().toISOString(),
              pot: 240,
              community_cards: [
                { rank: 'A', suit: 'hearts' },
                { rank: 'K', suit: 'hearts' },
                { rank: 'Q', suit: 'hearts' },
                { rank: 'J', suit: 'clubs' },
                { rank: '10', suit: 'diamonds' }
              ],
              winners: [
                {
                  player_id: 'player-1',
                  player_name: 'Alex',
                  amount: 240,
                  hand_description: 'Flush, Ace high'
                }
              ]
            },
            {
              id: '2',
              created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
              pot: 180,
              community_cards: [
                { rank: '2', suit: 'clubs' },
                { rank: '5', suit: 'diamonds' },
                { rank: '7', suit: 'hearts' },
                { rank: 'J', suit: 'spades' },
                { rank: 'A', suit: 'diamonds' }
              ],
              winners: [
                {
                  player_id: 'player-2',
                  player_name: 'Taylor',
                  amount: 180,
                  hand_description: 'Pair of Aces'
                }
              ]
            }
          ]);
          setLoading(false);
        }, 1000);
        
        // In the real implementation, you'd use something like:
        /*
        const { data, error } = await supabase
          .from('hand_history')
          .select('*')
          .eq('table_id', tableId)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        setHandHistory(data || []);
        */
      } catch (error: any) {
        toast({
          title: 'Error loading hand history',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchHandHistory();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel(`table_hands_${tableId}`)
      .on('broadcast', { event: 'hand_completed' }, (payload) => {
        setHandHistory(prev => [payload.payload as HandRecord, ...prev.slice(0, 9)]);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableId, toast]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-navy-dark/50">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-4/5 mb-2" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="h-8 w-6" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {handHistory.length === 0 ? (
          <p className="text-center py-8 text-gray-400">
            No hand history available yet. Complete some hands to see them here.
          </p>
        ) : (
          handHistory.map((hand) => (
            <Card key={hand.id} className="bg-navy-dark/50 border-emerald/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Hand #{hand.id} - {new Date(hand.created_at).toLocaleTimeString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs mb-1">Pot: <span className="font-medium text-emerald">${hand.pot}</span></p>
                <p className="text-xs mb-3">
                  Winner: <span className="font-medium text-yellow-400">{hand.winners[0].player_name}</span> with <span className="italic">{hand.winners[0].hand_description}</span>
                </p>
                
                <div className="flex gap-1 justify-center mb-1">
                  <p className="text-xs font-medium text-gray-400">Community Cards:</p>
                </div>
                <div className="flex gap-1 justify-center">
                  {hand.community_cards.map((card, idx) => (
                    <PokerCard key={`${card.rank}-${card.suit}-${idx}`} card={card} size="sm" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
