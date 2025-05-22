
import { PlayerAction } from '@/types/lobby';
import { Badge } from '@/components/ui/badge';

interface GameInfoProps {
  gamePhase: string;
  lastAction?: {
    playerId: string;
    action: PlayerAction;
    amount?: number;
  } | null;
  smallBlind: number;
  bigBlind: number;
}

export function GameInfo({ gamePhase, lastAction, smallBlind, bigBlind }: GameInfoProps) {
  // Format the last action for display
  const formatAction = () => {
    if (!lastAction) return null;
    
    const { action, amount } = lastAction;
    
    switch (action) {
      case 'FOLD':
        return 'folded';
      case 'CHECK':
        return 'checked';
      case 'CALL':
        return `called ${amount}`;
      case 'BET':
        return `bet ${amount}`;
      case 'RAISE':
        return `raised to ${amount}`;
      case 'ALL_IN':
        return 'went ALL IN';
      default:
        return action;
    }
  };
  
  // Get phase badge color
  const getPhaseBadgeColor = () => {
    switch (gamePhase) {
      case 'PREFLOP':
        return 'bg-blue-900/50 text-blue-300';
      case 'FLOP':
        return 'bg-green-900/50 text-green-300';
      case 'TURN':
        return 'bg-amber-900/50 text-amber-300';
      case 'RIVER':
        return 'bg-purple-900/50 text-purple-300';
      case 'SHOWDOWN':
        return 'bg-red-900/50 text-red-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-300">Table Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col space-y-1">
            <p className="text-gray-400">Blinds:</p>
            <p className="font-medium">{smallBlind} / {bigBlind}</p>
          </div>
          
          <div className="flex flex-col space-y-1">
            <p className="text-gray-400">Current Phase:</p>
            <div>
              <span className={`px-2 py-1 text-xs rounded-full ${getPhaseBadgeColor()}`}>
                {gamePhase}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {lastAction && (
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-300">Last Action</h3>
          <p className="text-sm">
            Last player {formatAction()}
          </p>
        </div>
      )}
      
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-300">Hand Rankings</h3>
        <div className="text-xs space-y-1 text-gray-300">
          <p>Royal Flush</p>
          <p>Straight Flush</p>
          <p>Four of a Kind</p>
          <p>Full House</p>
          <p>Flush</p>
          <p>Straight</p>
          <p>Three of a Kind</p>
          <p>Two Pair</p>
          <p>Pair</p>
          <p>High Card</p>
        </div>
      </div>
    </div>
  );
}
