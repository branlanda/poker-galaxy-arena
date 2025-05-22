
import { useState, useEffect, useCallback } from 'react';
import { LobbyTable } from '@/types/lobby';

export function useTableGrouping(tables: LobbyTable[]) {
  const [newTableIds, setNewTableIds] = useState<Set<string>>(new Set());
  const [previousTables, setPreviousTables] = useState<LobbyTable[]>([]);

  // Track new tables by comparing with previous tables
  useEffect(() => {
    const existingIds = new Set(previousTables.map(table => table.id));
    const newIds = new Set<string>();
    
    tables.forEach(table => {
      if (!existingIds.has(table.id)) {
        newIds.add(table.id);
        
        // Remove the new table indicator after 10 seconds
        setTimeout(() => {
          setNewTableIds(current => {
            const updated = new Set(current);
            updated.delete(table.id);
            return updated;
          });
        }, 10000);
      }
    });
    
    setNewTableIds(prev => new Set([...prev, ...newIds]));
    setPreviousTables(tables);
  }, [tables]);

  // Function to group and sort tables by various criteria
  const groupAndSortTables = useCallback((tables: LobbyTable[]) => {
    const now = new Date().getTime();
    
    // Find hot tables (most players or high activity)
    const hotTables = tables.filter(table => {
      const isNearlyFull = table.current_players >= Math.floor(table.max_players * 0.7);
      const hasActivity = table.active_players >= 3;
      return isNearlyFull || hasActivity;
    });
    
    // Find active tables (with active players but not "hot")
    const activeTables = tables.filter(table => {
      return table.active_players > 0 && 
             !hotTables.some(hot => hot.id === table.id);
    });
    
    // Find tables with players waiting but not active yet
    const waitingTables = tables.filter(table => {
      return table.current_players > 0 && 
             table.active_players === 0 &&
             !hotTables.some(hot => hot.id === table.id) &&
             !activeTables.some(active => active.id === table.id);
    });
    
    // All other tables
    const otherTables = tables.filter(table => {
      return !hotTables.some(hot => hot.id === table.id) &&
             !activeTables.some(active => active.id === table.id) &&
             !waitingTables.some(waiting => waiting.id === table.id);
    });
    
    // Sort hot tables by player count
    hotTables.sort((a, b) => b.current_players - a.current_players);
    
    // Sort active tables by activity
    activeTables.sort((a, b) => {
      const aTimeActive = a.last_activity ? new Date(a.last_activity).getTime() : 0;
      const bTimeActive = b.last_activity ? new Date(b.last_activity).getTime() : 0;
      return bTimeActive - aTimeActive;
    });
    
    // Sort waiting tables by number of players
    waitingTables.sort((a, b) => b.current_players - a.current_players);
    
    // Sort other tables by creation date (newest first)
    otherTables.sort((a, b) => {
      const aCreated = new Date(a.created_at).getTime();
      const bCreated = new Date(b.created_at).getTime();
      return bCreated - aCreated;
    });
    
    return {
      hotTables,
      activeTables,
      waitingTables,
      otherTables
    };
  }, []);
  
  return { newTableIds, groupAndSortTables };
}
