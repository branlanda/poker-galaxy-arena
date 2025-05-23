
import { useState, useEffect } from 'react';
import { Card } from '@/types/lobby';
import { PokerCard } from './PokerCard';

interface HandHistoryProps {
  tableId: string;
}

interface HandRecord {
  id: string;
  hand_number: number;
  timestamp: string;
  pot: number;
  winner: string;
  cards: Card[];
}

export function HandHistory({ tableId }: HandHistoryProps) {
  const [hands, setHands] = useState<HandRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching hand history data
    const fetchHandHistory = async () => {
      setIsLoading(true);
      
      try {
        // This would be replaced with an actual API call
        // For now, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockHands: HandRecord[] = [
          {
            id: '1',
            hand_number: 1,
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            pot: 250,
            winner: 'Player1',
            cards: [
              { suit: 'hearts', value: 'A', rank: 'A' },
              { suit: 'hearts', value: 'K', rank: 'K' },
              { suit: 'hearts', value: 'Q', rank: 'Q' },
              { suit: 'hearts', value: '10', rank: '10' },
              { suit: 'hearts', value: 'J', rank: 'J' }
            ]
          },
          {
            id: '2',
            hand_number: 2,
            timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
            pot: 180,
            winner: 'Player2',
            cards: [
              { suit: 'clubs', value: '8', rank: '8' },
              { suit: 'clubs', value: '8', rank: '8' },
              { suit: 'diamonds', value: '8', rank: '8' },
              { suit: 'hearts', value: 'A', rank: 'A' },
              { suit: 'spades', value: 'K', rank: 'K' }
            ]
          },
        ];
        
        setHands(mockHands);
      } catch (error) {
        console.error('Error fetching hand history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHandHistory();
  }, [tableId]);
  
  // Format timestamp to a readable format
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recent Hands</h3>
      
      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-pulse text-emerald-500">Loading hand history...</div>
        </div>
      ) : hands.length === 0 ? (
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-400">No hand history available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {hands.map((hand) => (
            <div 
              key={hand.id}
              className="border border-emerald/10 rounded-lg p-4 bg-navy/20 space-y-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">
                    Hand #{hand.hand_number}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTime(hand.timestamp)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-500 font-medium">
                    ${hand.pot}
                  </div>
                  <div className="text-xs">
                    Winner: {hand.winner}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-1">
                {hand.cards.map((card, i) => (
                  <PokerCard 
                    key={i} 
                    card={card} 
                    size="sm" 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
