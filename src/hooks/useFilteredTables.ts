
import { useMemo } from 'react';
import { LobbyTable, TableFilters } from '@/types/lobby';

export function useFilteredTables(tables: LobbyTable[], filters: TableFilters) {
  return useMemo(() => {
    let filteredTables = [...tables];

    // Filtro de búsqueda por texto
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      filteredTables = filteredTables.filter(table => 
        table.name.toLowerCase().includes(searchLower)
        // Note: creator_name and description don't exist in LobbyTable schema
        // We can only search by table name for now
      );
    }

    // Filtro por tipo de mesa
    if (filters.tableType !== 'ALL') {
      filteredTables = filteredTables.filter(table => table.table_type === filters.tableType);
    }

    // Filtro por rango de buy-in
    if (filters.buyInRange) {
      filteredTables = filteredTables.filter(table => 
        table.min_buy_in >= filters.buyInRange[0] && table.max_buy_in <= filters.buyInRange[1]
      );
    }

    // Filtro por rango de blinds
    if (filters.blindsRange) {
      filteredTables = filteredTables.filter(table => 
        table.small_blind >= filters.blindsRange[0] && table.big_blind <= filters.blindsRange[1]
      );
    }

    // Filtro por mesas llenas
    if (!filters.showFull) {
      filteredTables = filteredTables.filter(table => table.current_players < table.max_players);
    }

    // Filtro por mesas vacías
    if (!filters.showEmpty) {
      filteredTables = filteredTables.filter(table => table.current_players > 0);
    }

    // Filtro por mesas activas solamente
    if (filters.showActive) {
      filteredTables = filteredTables.filter(table => table.status === 'ACTIVE');
    }

    // Filtro por mesas privadas
    if (!filters.showPrivate) {
      filteredTables = filteredTables.filter(table => !table.is_private);
    }

    // Ordenamiento
    switch (filters.sortBy) {
      case 'players':
        filteredTables.sort((a, b) => b.current_players - a.current_players);
        break;
      case 'newest':
        filteredTables.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'blinds_asc':
        filteredTables.sort((a, b) => a.big_blind - b.big_blind);
        break;
      case 'blinds_desc':
        filteredTables.sort((a, b) => b.big_blind - a.big_blind);
        break;
      case 'activity':
      default:
        filteredTables.sort((a, b) => {
          // Priorizar mesas con más jugadores activos
          const activityA = a.current_players + (a.status === 'ACTIVE' ? 10 : 0);
          const activityB = b.current_players + (b.status === 'ACTIVE' ? 10 : 0);
          return activityB - activityA;
        });
        break;
    }

    return filteredTables;
  }, [tables, filters]);
}
