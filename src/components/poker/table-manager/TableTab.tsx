
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Trophy, Gamepad2, Zap, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { OpenTable, TableNotifications } from '@/types/tableManager';

interface TableTabProps {
  table: OpenTable;
  isActive: boolean;
  notifications: TableNotifications;
  keyboardShortcut: number;
  onSelect: () => void;
  onClose: () => void;
}

export const TableTab: React.FC<TableTabProps> = ({
  table,
  isActive,
  notifications,
  keyboardShortcut,
  onSelect,
  onClose
}) => {
  const getTableIcon = () => {
    switch (table.type) {
      case 'TOURNAMENT':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'SIT_AND_GO':
        return <Zap className="w-4 h-4 text-purple-400" />;
      default:
        return <Gamepad2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getStatusColor = () => {
    switch (table.status) {
      case 'RUNNING':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald/30';
      case 'WAITING':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow/30';
      case 'PAUSED':
        return 'bg-gray-500/20 text-gray-300 border-gray/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate/30';
    }
  };

  const getStatusText = () => {
    switch (table.status) {
      case 'RUNNING':
        return 'En Juego';
      case 'WAITING':
        return 'Esperando';
      case 'PAUSED':
        return 'Pausado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="relative min-w-[200px] max-w-[280px]"
    >
      <button
        onClick={onSelect}
        className={`
          w-full p-3 rounded-lg border transition-all duration-200
          flex flex-col gap-2 text-left relative overflow-hidden
          ${isActive
            ? 'bg-emerald-800/90 border-emerald/50 shadow-lg shadow-emerald/20'
            : 'bg-slate-800/70 border-slate-700 hover:border-emerald/30 hover:bg-slate-800/90'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTableIcon()}
            <span className="font-medium text-sm text-white truncate">
              {table.name}
            </span>
            {keyboardShortcut <= 8 && (
              <Badge 
                variant="outline" 
                className="text-xs px-1 py-0 h-4 bg-slate-700/50 text-slate-300"
              >
                {keyboardShortcut}
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="h-6 w-6 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/20"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Status and Players */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-300">
              {table.currentPlayers}/{table.maxPlayers} jugadores
            </span>
          </div>
          
          <Badge className={`text-xs px-2 py-0.5 ${getStatusColor()}`}>
            {getStatusText()}
          </Badge>
        </div>

        {/* Pot info if available */}
        {table.pot && table.pot > 0 && (
          <div className="text-xs text-emerald-300">
            Pot: ${table.pot.toLocaleString()}
          </div>
        )}

        {/* Notifications */}
        <div className="flex items-center gap-1 flex-wrap">
          {notifications.isPlayerTurn && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-1 bg-lime-500/20 text-lime-300 px-2 py-1 rounded text-xs"
            >
              <Clock className="w-3 h-3" />
              ¡Tu turno!
            </motion.div>
          )}
          
          {notifications.unreadMessages > 0 && (
            <Badge className="bg-pink-500/20 text-pink-300 text-xs">
              {notifications.unreadMessages} msg
            </Badge>
          )}
          
          {notifications.hasAlert && (
            <Badge className="bg-red-500/20 text-red-300 text-xs">
              <AlertCircle className="w-3 h-3" />
            </Badge>
          )}
        </div>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"
            layoutId="activeTab"
          />
        )}
      </button>
    </motion.div>
  );
};
