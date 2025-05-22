
import { LobbyTable } from '@/types/lobby';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { CardFooter, Card } from "@/components/ui/card";
import { HotTableIndicator } from './table-card/HotTableIndicator';
import { TableCardHeader } from './table-card/TableCardHeader';
import { TableInfoGrid } from './table-card/TableInfoGrid';
import { JoinTableDialog } from './table-card/JoinTableDialog';
import { TableFillIndicator } from './table-card/TableFillIndicator';

interface TableCardProps {
  table: LobbyTable;
  isNew?: boolean;
}

export function TableCard({ table, isNew = false }: TableCardProps) {
  // Format creation time
  const createdTime = formatDistanceToNow(new Date(table.created_at), { addSuffix: true });

  // Format activity time
  const lastActivityTime = table.last_activity ? 
    formatDistanceToNow(new Date(table.last_activity), { addSuffix: true }) :
    createdTime;

  // Determine table activity status
  const getActivityStatus = () => {
    if (!table.last_activity) return 'idle';
    
    const lastActivity = new Date(table.last_activity).getTime();
    const now = new Date().getTime();
    const minutes = (now - lastActivity) / (1000 * 60);
    
    if (minutes < 5) return 'active';
    if (minutes < 30) return 'idle';
    return 'inactive';
  };
  
  const activityStatus = getActivityStatus();
  const activePlayerCount = table.active_players || 0;
  const isHot = activePlayerCount >= 3 || (table.current_players > 0 && table.current_players >= table.max_players * 0.7);
  
  // Calculate fill percentage for visual indicator
  const fillPercentage = Math.min(100, Math.round((table.current_players / table.max_players) * 100));

  return (
    <motion.div
      initial={isNew ? { opacity: 0, scale: 0.9 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className={`bg-navy/50 border ${isHot ? 'border-amber-500/50' : 'border-emerald/10'} h-full relative overflow-hidden`}>
        {isHot && <HotTableIndicator />}
        <TableFillIndicator fillPercentage={fillPercentage} />
        
        <TableCardHeader 
          table={table} 
          createdTime={createdTime} 
        />
        
        <TableInfoGrid 
          table={table} 
          lastActivityTime={lastActivityTime} 
          activityStatus={activityStatus} 
          activePlayerCount={activePlayerCount} 
        />
        
        <CardFooter>
          <JoinTableDialog table={table} />
        </CardFooter>
      </Card>
    </motion.div>
  );
}
