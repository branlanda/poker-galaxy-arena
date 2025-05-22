
export type TableStatus = 'WAITING' | 'ACTIVE' | 'PAUSED' | 'FINISHED';
export type TableType = 'CASH' | 'TOURNAMENT';
export type PlayerStatus = 'SITTING' | 'ACTIVE' | 'AWAY' | 'LEFT';

export interface LobbyTable {
  id: string;
  name: string;
  creator_id: string;
  small_blind: number;
  big_blind: number;
  min_buy_in: number;
  max_buy_in: number;
  max_players: number;
  current_players: number;
  table_type: TableType;
  status: TableStatus;
  is_private: boolean;
  password?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlayerAtTable {
  id: string;
  player_id: string;
  table_id: string;
  seat_number: number | null;
  stack: number;
  status: PlayerStatus;
  joined_at: string;
}

export interface TableFilters {
  searchQuery: string;
  tableType: TableType | 'ALL';
  blindsRange: [number, number];
  buyInRange: [number, number];
  showFull: boolean;
  showEmpty: boolean;
  showPrivate: boolean;
}

export const DEFAULT_FILTERS: TableFilters = {
  searchQuery: '',
  tableType: 'ALL',
  blindsRange: [0, 10000],
  buyInRange: [0, 10000],
  showFull: true,
  showEmpty: true,
  showPrivate: true
};
