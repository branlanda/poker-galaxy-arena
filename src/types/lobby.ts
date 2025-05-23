
// Table types
export type TableType = 'CASH' | 'TOURNAMENT' | 'ALL';
export type TableStatus = 'WAITING' | 'ACTIVE' | 'CLOSED';
export type SortOption = 'activity' | 'players' | 'newest' | 'blinds_asc' | 'blinds_desc';

// Player types
export type PlayerStatus = 'SITTING' | 'PLAYING' | 'AWAY' | 'LEFT';
export type PlayerAction = 'FOLD' | 'CHECK' | 'CALL' | 'BET' | 'RAISE' | 'ALL_IN';

// Card types
export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  hidden?: boolean;
}

// Seat state for poker table
export type SeatState = {
  playerId: string;
  playerName: string;
  stack: number;
  bet: number;
  cards?: Card[];
  isActive: boolean;
  isDealer: boolean;
  status: PlayerStatus;
  lastAction?: PlayerAction;
} | null;

// Player at table interface
export interface PlayerAtTable {
  id: string;
  player_id: string;
  table_id: string;
  player_name?: string;
  seat_number?: number;
  stack: number;
  status: PlayerStatus;
  joined_at: string;
}

// Lobby table interface
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
  active_players?: number;
  hand_number?: number;
  last_activity?: string;
  table_type: TableType;
  status: TableStatus;
  is_private: boolean;
  password?: string;
  created_at: string;
  updated_at: string;
}

// Table filters
export interface TableFilters {
  searchQuery: string;
  tableType: TableType | 'ALL';
  blindsRange: [number, number];
  buyInRange: [number, number];
  showFull: boolean;
  showEmpty: boolean;
  showPrivate: boolean;
  showActive: boolean;
  sortBy: SortOption;
}

// Room chat message
export interface RoomMessage {
  id: string;
  table_id: string;
  player_id: string;
  player_name: string;
  message: string;
  created_at: string;
}

// Default filter values
export const DEFAULT_FILTERS: TableFilters = {
  searchQuery: '',
  tableType: 'ALL',
  blindsRange: [0, 1000],
  buyInRange: [0, 10000],
  showFull: true,
  showEmpty: true,
  showPrivate: true,
  showActive: false,
  sortBy: 'activity'
};
