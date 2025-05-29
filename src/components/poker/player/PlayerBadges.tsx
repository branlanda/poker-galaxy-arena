
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap } from 'lucide-react';
import { PlayerStatus } from '@/types/poker';

interface PlayerBadgesProps {
  isDealer?: boolean;
  isSmallBlind?: boolean;
  isBigBlind?: boolean;
  status: PlayerStatus;
}

export function PlayerBadges({ 
  isDealer = false, 
  isSmallBlind = false, 
  isBigBlind = false, 
  status 
}: PlayerBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1 mb-3 justify-center">
      <AnimatePresence>
        {isDealer && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 10 }}
          >
            <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs px-2 py-1 shadow-lg">
              <Crown className="w-3 h-3 mr-1" />
              D
            </Badge>
          </motion.div>
        )}
        {isSmallBlind && (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-1">
            SB
          </Badge>
        )}
        {isBigBlind && (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1">
            BB
          </Badge>
        )}
        {status === 'FOLDED' && (
          <Badge className="bg-gray-700 text-gray-300 text-xs px-2 py-1">
            Folded
          </Badge>
        )}
        {status === 'ALL_IN' && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-1">
              <Zap className="w-3 h-3 mr-1" />
              ALL IN!
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
