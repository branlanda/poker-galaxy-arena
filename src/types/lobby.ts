
export type TableStatus = 'WAITING' | 'ACTIVE' | 'PAUSED' | 'FINISHED';
export type TableType = 'CASH' | 'TOURNAMENT' | 'ALL';
export type PlayerStatus = 'SITTING' | 'ACTIVE' | 'AWAY' | 'LEFT';
export type PlayerAction = 'FOLD' | 'CHECK' | 'CALL' | 'BET' | 'RAISE' | 'ALL_IN';
export type GamePhase = 'WAITING' | 'PREFLOP' | 'FLOP' | 'TURN' | 'RIVER' | 'SHOWDOWN';
export type Card = {
  rank: string;
  suit: string;
};

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
  active_players: number; // New field
  hand_number: number; // New field
  last_activity: string; // New field
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

export interface GameState {
  tableId: string;
  phase: GamePhase;
  pot: number;
  currentBet: number;
  activePlayerId: string | null;
  dealer: number;
  smallBlind: number;
  bigBlind: number;
  communityCards: Card[];
  seats: (SeatState | null)[];
  lastAction: {
    playerId: string;
    action: PlayerAction;
    amount?: number;
  } | null;
}

export interface SeatState {
  playerId: string;
  playerName: string;
  stack: number;
  bet: number;
  cards: Card[] | null;
  isActive: boolean;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
  isFolded: boolean;
  isAllIn: boolean;
  isWinner: boolean;
  winAmount?: number;
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

export interface RoomMessage {
  id: string;
  table_id: string;
  player_id: string;
  player_name: string;
  message: string;
  created_at: string;
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
