
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { PlayerState, GameState } from '@/types/poker';

interface TexasHoldemControlsProps {
  gameState: GameState;
  playerState?: PlayerState;
  isPlayerTurn: boolean;
  onAction: (action: string, amount?: number) => void;
}

export const TexasHoldemControls: React.FC<TexasHoldemControlsProps> = ({
  gameState,
  playerState,
  isPlayerTurn,
  onAction
}) => {
  const [betAmount, setBetAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');

  if (!playerState || !isPlayerTurn) {
    return null;
  }

  const callAmount = Math.max(0, gameState.currentBet - playerState.currentBet);
  const minRaise = Math.max(gameState.currentBet * 2, playerState.currentBet + 10);
  const maxBet = playerState.stack;

  const canCheck = callAmount === 0;
  const canCall = callAmount > 0 && callAmount <= playerState.stack;
  const canRaise = playerState.stack > callAmount;

  const handleBetChange = (value: number[]) => {
    setBetAmount(value[0]);
    setCustomAmount(value[0].toString());
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= maxBet) {
      setBetAmount(numValue);
    }
  };

  const quickBetAmounts = [
    { label: '1/4 Pot', value: Math.floor(gameState.pot * 0.25) },
    { label: '1/2 Pot', value: Math.floor(gameState.pot * 0.5) },
    { label: '3/4 Pot', value: Math.floor(gameState.pot * 0.75) },
    { label: 'Pot', value: gameState.pot },
  ].filter(bet => bet.value <= maxBet && bet.value > 0);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-emerald-500/20 p-4 z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            
            {/* Player info */}
            <div className="text-center text-white">
              <div className="text-sm">Tu turno • Stack: ${playerState.stack.toLocaleString()}</div>
              {callAmount > 0 && (
                <div className="text-xs text-amber-400">Para igualar: ${callAmount.toLocaleString()}</div>
              )}
            </div>

            {/* Betting controls */}
            {canRaise && (
              <div className="space-y-3">
                {/* Bet amount slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Apuesta: ${betAmount.toLocaleString()}</span>
                    <span>Máximo: ${maxBet.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[betAmount]}
                    onValueChange={handleBetChange}
                    max={maxBet}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </div>

                {/* Custom amount input */}
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder="Cantidad personalizada"
                    className="flex-1 bg-slate-800 border-slate-600 text-white"
                    min={0}
                    max={maxBet}
                  />
                </div>

                {/* Quick bet buttons */}
                {quickBetAmounts.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {quickBetAmounts.map((bet, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBetAmount(bet.value);
                          setCustomAmount(bet.value.toString());
                        }}
                        className="text-xs bg-slate-800 border-slate-600 hover:bg-slate-700"
                      >
                        {bet.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 justify-center flex-wrap">
              
              {/* Fold */}
              <Button
                onClick={() => onAction('FOLD')}
                variant="destructive"
                size="lg"
                className="min-w-24"
              >
                Retirarse
              </Button>

              {/* Check/Call */}
              {canCheck ? (
                <Button
                  onClick={() => onAction('CHECK')}
                  variant="outline"
                  size="lg"
                  className="min-w-24 bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-600"
                >
                  Pasar
                </Button>
              ) : canCall ? (
                <Button
                  onClick={() => onAction('CALL', callAmount)}
                  variant="outline"
                  size="lg"
                  className="min-w-24 bg-blue-700 hover:bg-blue-600 text-white border-blue-600"
                >
                  Igualar ${callAmount.toLocaleString()}
                </Button>
              ) : null}

              {/* Bet/Raise */}
              {canRaise && betAmount > 0 && (
                <Button
                  onClick={() => onAction(callAmount > 0 ? 'RAISE' : 'BET', betAmount)}
                  size="lg"
                  className="min-w-24 bg-amber-600 hover:bg-amber-500"
                  disabled={betAmount < (callAmount > 0 ? minRaise : 10)}
                >
                  {callAmount > 0 ? 'Subir' : 'Apostar'} ${betAmount.toLocaleString()}
                </Button>
              )}

              {/* All-in */}
              <Button
                onClick={() => onAction('ALL_IN', playerState.stack)}
                variant="outline"
                size="lg"
                className="min-w-24 bg-red-700 hover:bg-red-600 text-white border-red-600"
              >
                All-in
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
