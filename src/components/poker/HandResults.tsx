
import React from 'react';
import { motion } from 'framer-motion';
import { GameResult } from '@/utils/poker/gameEngine';
import { Card } from '@/components/ui/card';
import { PokerCard } from './PokerCard';
import { Trophy } from 'lucide-react';

interface HandResultsProps {
  results: GameResult;
  isVisible: boolean;
  onClose: () => void;
}

export function HandResults({ results, isVisible, onClose }: HandResultsProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card className="w-full max-w-2xl mx-4 p-6 bg-navy border-emerald/30" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-6 w-6 text-emerald" />
              <h2 className="text-2xl font-bold text-white">Hand Results</h2>
            </div>
            <p className="text-gray-400">Hand complete - here are the winners</p>
          </div>
          
          <div className="space-y-4">
            {results.winners.map((winner, index) => (
              <motion.div
                key={`${winner.playerId}-${index}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-emerald/10 rounded-lg border border-emerald/20"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-emerald" />
                    <span className="font-semibold text-white">
                      Player {winner.playerId.slice(0, 8)}...
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-emerald font-medium">
                      {winner.handRank.name}
                    </div>
                    {winner.handRank.kickers.length > 0 && (
                      <div className="text-gray-400">
                        {winner.handRank.kickers.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald">
                    +{winner.winAmount}
                  </div>
                  {winner.sidePotIndex !== undefined && (
                    <div className="text-xs text-gray-400">
                      Side Pot {winner.sidePotIndex + 1}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {results.sidePots.length > 1 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Side Pots</h3>
              <div className="space-y-2">
                {results.sidePots.map((sidePot, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-navy/50 rounded-lg"
                  >
                    <span className="text-gray-300">
                      Side Pot {index + 1} ({sidePot.eligiblePlayers.length} players)
                    </span>
                    <span className="font-semibold text-white">
                      {sidePot.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-center pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-2 bg-emerald text-black font-semibold rounded-lg hover:bg-emerald/90 transition-colors"
            >
              Continue Playing
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
