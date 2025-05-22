
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useGameStore } from '@/stores/game';
import { PlayerAction } from '@/types/lobby';

interface PlayerActionsProps {
  playerId: string;
  currentBet: number;
  playerBet: number;
  stack: number;
  isActive: boolean;
}

export function PlayerActions({ playerId, currentBet, playerBet, stack, isActive }: PlayerActionsProps) {
  const { placeBet } = useGameStore();
  const [betAmount, setBetAmount] = useState(Math.min(currentBet * 2, stack));
  const [isRaising, setIsRaising] = useState(false);
  
  const toCall = currentBet - playerBet;
  const canCheck = toCall === 0;
  const canCall = toCall > 0 && toCall <= stack;
  const canRaise = stack > toCall;
  
  if (!isActive) return null;
  
  const handleAction = async (action: PlayerAction, amount?: number) => {
    if (!playerId) return;
    
    try {
      switch(action) {
        case 'FOLD':
          await placeBet(playerId, 0, 'FOLD');
          break;
        case 'CHECK':
          await placeBet(playerId, 0, 'CHECK');
          break;
        case 'CALL':
          await placeBet(playerId, toCall, 'CALL');
          break;
        case 'BET':
          if (isRaising) {
            await placeBet(playerId, amount || betAmount, 'BET');
            setIsRaising(false);
          } else {
            setIsRaising(true);
          }
          break;
        case 'RAISE':
          if (isRaising) {
            await placeBet(playerId, amount || betAmount, 'RAISE');
            setIsRaising(false);
          } else {
            setIsRaising(true);
          }
          break;
        case 'ALL_IN':
          await placeBet(playerId, stack, 'ALL_IN');
          break;
      }
    } catch (error) {
      console.error('Failed to place bet:', error);
    }
  };
  
  const handleCancelRaise = () => {
    setIsRaising(false);
  };
  
  return (
    <div className="w-full max-w-md bg-navy/30 p-4 rounded-lg border border-emerald/10">
      {!isRaising ? (
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAction('FOLD')}
          >
            Fold
          </Button>
          
          {canCheck && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAction('CHECK')}
            >
              Check
            </Button>
          )}
          
          {canCall && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => handleAction('CALL')}
            >
              Call {toCall}
            </Button>
          )}
          
          {canRaise && currentBet > 0 && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => handleAction('RAISE')}
            >
              Raise
            </Button>
          )}
          
          {canRaise && currentBet === 0 && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => handleAction('BET')}
            >
              Bet
            </Button>
          )}
          
          <Button 
            variant="secondary"
            size="sm"
            onClick={() => handleAction('ALL_IN')}
          >
            All-In ({stack})
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="bet-amount" className="block text-sm font-medium">
              {currentBet > 0 ? 'Raise to:' : 'Bet amount:'}
            </label>
            <div className="flex items-center gap-2">
              <Slider
                defaultValue={[betAmount]}
                min={currentBet > 0 ? currentBet * 2 : 1}
                max={stack}
                step={1}
                onValueChange={(values) => setBetAmount(values[0])}
                className="flex-1"
              />
              <Input
                type="number"
                min={currentBet > 0 ? currentBet * 2 : 1}
                max={stack}
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-20 text-center"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelRaise}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAction(currentBet > 0 ? 'RAISE' : 'BET', betAmount)}
            >
              Confirm {currentBet > 0 ? 'Raise' : 'Bet'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
