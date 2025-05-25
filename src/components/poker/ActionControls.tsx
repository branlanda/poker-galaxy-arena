
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
  const [betAmount, setBetAmount] = useState(currentBet * 2);
  const [isRaising, setIsRaising] = useState(false);
  
  const toCall = currentBet - playerState.currentBet;
  const canCheck = toCall === 0;
  const canCall = toCall > 0 && toCall <= playerState.stack;
  const canRaise = playerState.stack > toCall;
  
  const handleAction = async (action: PlayerAction) => {
    switch(action) {
      case 'FOLD':
      case 'CHECK':
        await onAction(action);
        break;
      case 'CALL':
        await onAction(action, toCall);
        break;
      case 'BET':
      case 'RAISE':
        if (isRaising) {
          await onAction(action, betAmount);
          setIsRaising(false);
        } else {
          setIsRaising(true);
        }
        break;
      case 'ALL_IN':
        await onAction(action, playerState.stack);
        break;
    }
  };
  
  const handleCancelRaise = () => {
    setIsRaising(false);
  };
  
  return (
    <div className="p-4 bg-navy/80 border border-emerald/20 rounded-lg shadow-lg backdrop-blur-sm">
      {!isRaising ? (
        <div className="flex flex-wrap justify-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleAction('FOLD')}
            className="font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400"
          >
            Fold
          </Button>
          
          {canCheck && (
            <Button 
              variant="outline" 
              onClick={() => handleAction('CHECK')}
              className="font-medium"
            >
              Check
            </Button>
          )}
          
          {canCall && (
            <Button 
              variant="secondary" 
              onClick={() => handleAction('CALL')}
              className="font-medium"
            >
              Call {toCall}
            </Button>
          )}
          
          {canRaise && currentBet > 0 && (
            <Button 
              variant="default" 
              onClick={() => handleAction('RAISE')}
              className="font-medium"
            >
              Raise
            </Button>
          )}
          
          {canRaise && currentBet === 0 && (
            <Button 
              variant="default" 
              onClick={() => handleAction('BET')}
              className="font-medium"
            >
              Bet
            </Button>
          )}
          
          <Button 
            variant="accent"
            onClick={() => handleAction('ALL_IN')}
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
                defaultValue={[betAmount]}
                min={currentBet > 0 ? currentBet * 2 : 1}
                max={playerState.stack}
                step={1}
                onValueChange={(values) => setBetAmount(values[0])}
                className="flex-1"
              />
              <Input
                type="number"
                min={currentBet > 0 ? currentBet * 2 : 1}
                max={playerState.stack}
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-20 text-center"
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={handleCancelRaise}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => handleAction(currentBet > 0 ? 'RAISE' : 'BET')}
              className="font-medium"
            >
              Confirm {currentBet > 0 ? 'Raise' : 'Bet'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
