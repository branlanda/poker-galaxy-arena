
import { useState, useEffect, useCallback } from 'react';
import { LobbyTable } from '@/types/lobby';

export const useTableGrouping = (tables: LobbyTable[]) => {
  const [newTableIds, setNewTableIds] = useState<Set<string>>(new Set());
  
  // Identify and track new tables for animation and highlighting
  useEffect(() => {
    const newTables = tables.filter(table => {
      const creationTime = new Date(table.created_at).getTime();
      const now = Date.now();
      // Mark tables as "new" if they were created in the last 30 seconds
      return now - creationTime < 30000;
    });
    
    if (newTables.length > 0) {
      setNewTableIds(prev => {
        const updated = new Set(prev);
        newTables.forEach(table => updated.add(table.id));
        return updated;
      });
      
      // Remove "new" status after 30 seconds
      const timers = newTables.map(table => {
        const creationTime = new Date(table.created_at).getTime();
        const now = Date.now();
        const timeLeft = Math.max(0, 30000 - (now - creationTime));
        
        return setTimeout(() => {
          setNewTableIds(prev => {
            const updated = new Set(prev);
            updated.delete(table.id);
            return updated;
          });
        }, timeLeft);
      });
      
      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [tables]);
  
  // Group tables into categories for display
  const groupAndSortTables = useCallback((tables: LobbyTable[]) => {
    const hotTables = tables.filter(table => {
      // Hot tables have high activity or are nearly full
      const isNearlyFull = table.current_players >= table.max_players * 0.7;
      const hasHighActivity = table.active_players >= 3;
      return isNearlyFull || hasHighActivity;
    });
    
    const activeTables = tables.filter(table => {
      // Active tables have some players and ongoing activity
      return table.active_players > 0 && !hotTables.includes(table);
    });
    
    const waitingTables = tables.filter(table => {
      // Waiting tables have players but no active game yet
      return table.current_players > 0 && table.active_players === 0 && 
             !hotTables.includes(table) && !activeTables.includes(table);
    });
    
    const otherTables = tables.filter(table => {
      // All other tables (empty, etc)
      return !hotTables.includes(table) && 
             !activeTables.includes(table) && 
             !waitingTables.includes(table);
    });
    
    return {
      hotTables,
      activeTables,
      waitingTables,
      otherTables
    };
  }, []);
  
  return {
    newTableIds,
    groupAndSortTables
  };
};
