
import { useState, useEffect } from 'react';
import { LobbyTable } from '@/types/lobby';

interface TableGroups {
  hotTables: LobbyTable[];
  activeTables: LobbyTable[];
  waitingTables: LobbyTable[];
  otherTables: LobbyTable[];
}

export function useTableGrouping(tables: LobbyTable[]) {
  const [newTableIds, setNewTableIds] = useState<Set<string>>(new Set());
  const [lastTableCount, setLastTableCount] = useState(0);
  
  // Track new tables for animation
  useEffect(() => {
    if (tables.length > lastTableCount) {
      const currentIds = new Set(tables.map(table => table.id));
      const previousIds = new Set(tables.slice(0, lastTableCount).map(table => table.id));
      const newIds = new Set([...currentIds].filter(id => !previousIds.has(id)));
      setNewTableIds(newIds);
    }
    setLastTableCount(tables.length);
    
    // Clear new table IDs after animation
    const timer = setTimeout(() => {
      setNewTableIds(new Set());
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [tables]);
  
  // Group tables by status and activity
  const groupAndSortTables = (tables: LobbyTable[]): TableGroups => {
    // Check if hot table (3+ active players or 70%+ capacity)
    const isHot = (table: LobbyTable) => {
      return (table.active_players || 0) >= 3 || 
             (table.current_players > 0 && table.current_players >= table.max_players * 0.7);
    };
    
    const hotTables = tables.filter(isHot);
    const activeTables = tables.filter(table => 
      !isHot(table) && 
      table.status === 'ACTIVE' && 
      (table.active_players || 0) > 0
    );
    
    const waitingTables = tables.filter(table => 
      !isHot(table) && 
      !activeTables.includes(table) && 
      (table.status === 'WAITING' || ((table.status === 'ACTIVE' && (table.active_players || 0) === 0)))
    );
    
    const otherTables = tables.filter(table => 
      !isHot(table) && 
      !activeTables.includes(table) && 
      !waitingTables.includes(table)
    );
    
    return { hotTables, activeTables, waitingTables, otherTables };
  };

  return {
    newTableIds,
    groupAndSortTables
  };
}
