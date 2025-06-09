
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { PlayerState, GameState } from '@/types/poker';
import { Coins, TrendingUp, RotateCcw } from 'lucide-react';

interface PremiumGameControlsProps {
  gameState: GameState;
  playerState?: PlayerState;
  isPlayerTurn: boolean;
  onAction: (action: string, amount?: number) => void;
}

export const PremiumGameControls: React.FC<PremiumGameControlsProps> = ({
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
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/98 via-slate-900/95 to-slate-900/90 backdrop-blur-xl border-t-2 border-amber-500/30 shadow-2xl z-50"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      >
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col gap-6">
            
            {/* Premium player info */}
            <motion.div 
              className="text-center bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-4 border border-amber-500/20"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span className="font-semibold">Tu turno</span>
                </div>
                <div className="w-px h-6 bg-amber-500/30"></div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300">Stack:</span>
                  <span className="font-bold text-xl text-emerald-400">${playerState.stack.toLocaleString()}</span>
                </div>
                {callAmount > 0 && (
                  <>
                    <div className="w-px h-6 bg-amber-500/30"></div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300">Para igualar: ${callAmount.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Premium betting controls */}
            {canRaise && (
              <motion.div 
                className="space-y-4 bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-xl p-5 border border-amber-500/20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Premium bet amount slider */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-300 font-medium">
                      Apuesta: <span className="text-white font-bold">${betAmount.toLocaleString()}</span>
                    </span>
                    <span className="text-gray-400">
                      Máximo: <span className="text-emerald-400">${maxBet.toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="relative">
                    <Slider
                      value={[betAmount]}
                      onValueChange={handleBetChange}
                      max={maxBet}
                      min={0}
                      step={10}
                      className="w-full premium-slider"
                    />
                    <div className="absolute -top-1 left-0 w-full h-3 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 rounded-full -z-10"></div>
                  </div>
                </div>

                {/* Premium custom amount input */}
                <div className="flex gap-3 items-center">
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder="Cantidad personalizada"
                    className="flex-1 bg-slate-800/60 border-slate-600 text-white placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-500/20"
                    min={0}
                    max={maxBet}
                  />
                  <Button
                    onClick={() => setBetAmount(maxBet)}
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-red-700/50 to-red-600/50 border-red-500/50 hover:from-red-600/60 hover:to-red-500/60 text-white"
                  >
                    All-in
                  </Button>
                </div>

                {/* Premium quick bet buttons */}
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
                        className="text-xs bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-slate-500/50 hover:from-amber-600/30 hover:to-amber-500/30 hover:border-amber-500/50 text-white transition-all duration-200"
                      >
                        {bet.label}
                      </Button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Premium action buttons */}
            <motion.div 
              className="flex gap-4 justify-center flex-wrap"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              
              {/* Premium Fold button */}
              <Button
                onClick={() => onAction('FOLD')}
                size="lg"
                className="min-w-32 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white border border-red-500/50 shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:scale-105"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retirarse
              </Button>

              {/* Premium Check/Call button */}
              {canCheck ? (
                <Button
                  onClick={() => onAction('CHECK')}
                  size="lg"
                  className="min-w-32 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white border border-emerald-500/50 shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 transform hover:scale-105"
                >
                  Pasar
                </Button>
              ) : canCall ? (
                <Button
                  onClick={() => onAction('CALL', callAmount)}
                  size="lg"
                  className="min-w-32 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white border border-blue-500/50 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:scale-105"
                >
                  Igualar ${callAmount.toLocaleString()}
                </Button>
              ) : null}

              {/* Premium Bet/Raise button */}
              {canRaise && betAmount > 0 && (
                <Button
                  onClick={() => onAction(callAmount > 0 ? 'RAISE' : 'BET', betAmount)}
                  size="lg"
                  className="min-w-32 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold border border-amber-400/50 shadow-lg hover:shadow-amber-500/25 transition-all duration-200 transform hover:scale-105"
                  disabled={betAmount < (callAmount > 0 ? minRaise : 10)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {callAmount > 0 ? 'Subir' : 'Apostar'} ${betAmount.toLocaleString()}
                </Button>
              )}

              {/* Premium All-in button */}
              <Button
                onClick={() => onAction('ALL_IN', playerState.stack)}
                size="lg"
                className="min-w-32 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white border border-purple-500/50 shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105"
              >
                <Coins className="w-4 h-4 mr-2" />
                All-in
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Premium glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none"></div>
      </motion.div>
    </AnimatePresence>
  );
};
