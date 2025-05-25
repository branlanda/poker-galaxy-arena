
import React, { useState } from 'react';
import { PlayerState, PlayerAction } from '@/types/poker';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface ActionControlsProps {
  playerState: PlayerState;
  currentBet: number;
  onAction: (action: PlayerAction, amount?: number) => Promise<void>;
}

export function ActionControls({ playerState, currentBet, onAction }: ActionControlsProps) {
  const [betAmount, setBetAmount] = useState(() => {
    const minRaise = currentBet * 2;
    return Math.min(minRaise, playerState.stack);
  });
  const [isRaising, setIsRaising] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const callAmount = Math.max(0, currentBet - playerState.currentBet);
  const canCheck = callAmount === 0;
  const canCall = callAmount > 0 && callAmount <= playerState.stack;
  const canRaise = playerState.stack > callAmount;
  const minRaise = currentBet > 0 ? currentBet * 2 : 1;
  const maxBet = playerState.stack;
  
  const handleAction = async (action: PlayerAction, amount?: number) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      switch(action) {
        case 'FOLD':
        case 'CHECK':
          await onAction(action);
          break;
        case 'CALL':
          await onAction(action, callAmount);
          break;
        case 'BET':
        case 'RAISE':
          if (isRaising) {
            await onAction(action, amount || betAmount);
            setIsRaising(false);
          } else {
            setIsRaising(true);
            return; // Don't set processing to false yet
          }
          break;
        case 'ALL_IN':
          await onAction(action, playerState.stack);
          break;
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCancelRaise = () => {
    setIsRaising(false);
    setIsProcessing(false);
  };
  
  const isValidBet = (amount: number): boolean => {
    if (amount <= 0) return false;
    if (amount > playerState.stack) return false;
    if (currentBet > 0 && amount < minRaise) return false;
    return true;
  };
  
  return (
    <div className="p-4 bg-navy/80 border border-emerald/20 rounded-lg shadow-lg backdrop-blur-sm">
      {!isRaising ? (
        <div className="flex flex-wrap justify-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleAction('FOLD')}
            disabled={isProcessing}
            className="font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400"
          >
            Fold
          </Button>
          
          {canCheck && (
            <Button 
              variant="outline" 
              onClick={() => handleAction('CHECK')}
              disabled={isProcessing}
              className="font-medium"
            >
              Check
            </Button>
          )}
          
          {canCall && (
            <Button 
              variant="secondary" 
              onClick={() => handleAction('CALL')}
              disabled={isProcessing}
              className="font-medium"
            >
              Call {callAmount}
            </Button>
          )}
          
          {canRaise && currentBet > 0 && (
            <Button 
              variant="default" 
              onClick={() => handleAction('RAISE')}
              disabled={isProcessing}
              className="font-medium"
            >
              Raise
            </Button>
          )}
          
          {canRaise && currentBet === 0 && (
            <Button 
              variant="default" 
              onClick={() => handleAction('BET')}
              disabled={isProcessing}
              className="font-medium"
            >
              Bet
            </Button>
          )}
          
          <Button 
            variant="accent"
            onClick={() => handleAction('ALL_IN')}
            disabled={isProcessing}
            className="font-medium"
          >
            All-In ({playerState.stack})
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="bet-amount" className="block text-sm font-medium text-gray-200">
              {currentBet > 0 ? 'Raise to:' : 'Bet amount:'}
            </label>
            <div className="flex items-center gap-2">
              <Slider
                value={[betAmount]}
                min={minRaise}
                max={maxBet}
                step={1}
                onValueChange={(values) => setBetAmount(values[0])}
                className="flex-1"
              />
              <Input
                type="number"
                min={minRaise}
                max={maxBet}
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-24 text-center"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Min: {minRaise}</span>
              <span>Max: {maxBet}</span>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={handleCancelRaise}
              disabled={isProcessing}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => handleAction(currentBet > 0 ? 'RAISE' : 'BET', betAmount)}
              disabled={isProcessing || !isValidBet(betAmount)}
              className="font-medium"
            >
              {isProcessing ? 'Processing...' : `Confirm ${currentBet > 0 ? 'Raise' : 'Bet'}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
