
// Ensure these types are available for the useTournaments hook
export interface Tournament {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  start_time: string;
  status: TournamentStatus;
  buy_in: number;
  players_registered: number;
  max_players: number;
  min_players: number;
  prize_pool: number;
  created_at: string;
  is_private?: boolean;
  is_featured?: boolean;
  access_code?: string;
  tournament_type?: TournamentType;
  registration_open_time?: string;
  registration_close_time?: string;
  starting_chips?: number;
  fee_percent: number;
  current_level?: number;
  blind_structure: Array<{
    level: number;
    small_blind: number;
    big_blind: number;
    ante: number;
    duration_minutes: number;
  }>;
  payout_structure: Array<{
    position: number;
    percentage: number;
  }>;
  rules?: string;
  [key: string]: any; // For other properties
}

export interface TournamentDetail extends Tournament {
  structure: any;
  blind_levels: any[];
  // Additional detail fields
}

export enum TournamentStatus {
  SCHEDULED = 'SCHEDULED',
  REGISTERING = 'REGISTERING',
  RUNNING = 'RUNNING',
  BREAK = 'BREAK',
  FINAL_TABLE = 'FINAL_TABLE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TournamentType {
  SIT_N_GO = 'SIT_N_GO',
  FREEROLL = 'FREEROLL',
  MULTI_TABLE = 'MULTI_TABLE',
  SPECIAL_EVENT = 'SPECIAL_EVENT',
  SATELLITE = 'SATELLITE'
}

export interface TournamentFilters {
  searchQuery?: string;
  type?: TournamentType | 'ALL';
  status?: TournamentStatus | 'ALL';
  showPrivate?: boolean;
  isPrivate?: boolean;
  isFeatured?: boolean;
  buyInRange?: [number, number];
  buyInMin?: number;
  buyInMax?: number;
}

export const DEFAULT_TOURNAMENT_FILTERS: TournamentFilters = {
  searchQuery: '',
  type: 'ALL',
  status: 'ALL',
  showPrivate: false,
  isPrivate: false,
  isFeatured: false,
  buyInRange: [0, 10000],
  buyInMin: 0,
  buyInMax: 10000
};

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  player_id: string;
  chips: number;
  status: string;
  created_at: string;
  is_active?: boolean;
  registration_time?: string;
  player_name?: string;
  player_avatar?: string;
  profiles?: {
    alias?: string;
    avatar_url?: string;
  };
  player?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface TournamentTable {
  id: string;
  tournament_id: string;
  table_number?: number;
  name?: string;
  max_players?: number;
  max_seats?: number;
  current_players?: number;
  status: string;
  is_final_table?: boolean;
  seats?: TournamentSeat[];
}

export interface TournamentSeat {
  table_id: string;
  seat_number: number;
  player_id: string;
  chips: number;
  player_name?: string;
  player_avatar?: string;
  profiles?: {
    alias?: string;
    avatar_url?: string;
  };
  player?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}
