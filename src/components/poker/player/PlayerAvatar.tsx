
import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Timer } from 'lucide-react';

interface PlayerAvatarProps {
  initials: string;
  isCurrentPlayer: boolean;
  isActive: boolean;
  onlineStatus?: boolean;
}

export function PlayerAvatar({ 
  initials, 
  isCurrentPlayer, 
  isActive, 
  onlineStatus = true 
}: PlayerAvatarProps) {
  return (
    <div className="flex flex-col items-center mb-3">
      <div className="relative">
        <motion.div 
          className={`p-1 rounded-full ${
            isCurrentPlayer 
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
              : 'bg-gradient-to-r from-slate-600 to-slate-700'
          }`}
          animate={isActive ? {
            background: [
              'linear-gradient(to right, #10b981, #059669)', 
              'linear-gradient(to right, #34d399, #10b981)', 
              'linear-gradient(to right, #10b981, #059669)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Avatar className="h-14 w-14 border-2 border-white/20">
            <AvatarImage src="#" />
            <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white font-bold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        
        {/* Online status indicator */}
        {onlineStatus && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
        )}
        
        {/* Turn timer */}
        {isActive && (
          <motion.div 
            className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <Timer className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
