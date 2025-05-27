
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Users, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface GameNotificationBadgeProps {
  gameCount: number;
  activeTables: number;
  totalPot: number;
  hasNotifications: boolean;
  onClick: () => void;
}

export const GameNotificationBadge: React.FC<GameNotificationBadgeProps> = ({
  gameCount,
  activeTables,
  totalPot,
  hasNotifications,
  onClick
}) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-30"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={onClick}
        className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-2xl border border-emerald/30 rounded-2xl p-4 h-auto"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6" />
            {hasNotifications && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          
          <div className="text-left">
            <div className="font-bold text-sm">Poker Tables</div>
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {activeTables}
              </div>
              {totalPot > 0 && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {totalPot.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {gameCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
            {gameCount}
          </Badge>
        )}
      </Button>
    </motion.div>
  );
};
