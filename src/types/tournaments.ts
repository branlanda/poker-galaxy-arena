
export type TournamentType = 'SIT_N_GO' | 'FREEROLL' | 'MULTI_TABLE' | 'SPECIAL_EVENT' | 'SATELLITE';
export type TournamentStatus = 'SCHEDULED' | 'REGISTERING' | 'RUNNING' | 'BREAK' | 'FINAL_TABLE' | 'COMPLETED' | 'CANCELLED';

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  tournament_type: TournamentType;
  status: TournamentStatus;
  start_time: string;
  registration_open_time: string;
  registration_close_time?: string;
  buy_in: number;
  prize_pool: number;
  fee_percent: number;
  starting_chips: number;
  min_players: number;
  max_players: number;
  late_registration_minutes?: number;
  rebuy_allowed: boolean;
  addon_allowed: boolean;
  created_by?: string;
  is_private: boolean;
  access_code?: string;
  blind_structure: BlindLevel[];
  payout_structure: PayoutLevel[];
  current_level: number;
  is_featured: boolean;
  rules?: string;
  banner_url?: string;
  created_at: string;
  updated_at: string;
  registered_players_count?: number;
}

export interface BlindLevel {
  level: number;
  small_blind: number;
  big_blind: number;
  ante: number;
  duration_minutes: number;
}

export interface PayoutLevel {
  position: number;
  percentage: number;
}

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  player_id: string;
  registration_time: string;
  is_active: boolean;
  chips: number;
  rebuys: number;
  addons: number;
  final_position?: number;
  payout?: number;
  player_name?: string;
  player_avatar?: string;
}

export interface TournamentTable {
  id: string;
  tournament_id: string;
  table_number: number;
  max_seats: number;
  is_final_table: boolean;
  status: string;
  created_at: string;
  seats?: TournamentSeat[];
}

export interface TournamentSeat {
  id: string;
  table_id: string;
  player_id: string;
  seat_number: number;
  is_active: boolean;
  player_name?: string;
  player_avatar?: string;
}

export interface TournamentRound {
  id: string;
  tournament_id: string;
  round_number: number;
  start_time?: string;
  end_time?: string;
  small_blind: number;
  big_blind: number;
  ante: number;
  duration_minutes: number;
}

export interface TournamentChatMessage {
  id: string;
  tournament_id: string;
  player_id: string;
  message: string;
  created_at: string;
  player_name?: string;
  player_avatar?: string;
}

export interface TournamentFilters {
  type?: TournamentType | 'ALL';
  status?: TournamentStatus | 'ALL';
  buyInRange?: [number, number];
  showPrivate?: boolean;
  searchQuery?: string;
}

export const DEFAULT_TOURNAMENT_FILTERS: TournamentFilters = {
  type: 'ALL',
  status: 'ALL',
  buyInRange: [0, 10000],
  showPrivate: false,
  searchQuery: '',
};
