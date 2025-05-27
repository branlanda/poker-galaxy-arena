
export interface SitAndGoGame {
  id: string;
  name: string;
  max_players: number;
  buy_in: number;
  starting_chips: number;
  blind_structure: BlindLevel[];
  payout_structure: PayoutLevel[];
  status: 'WAITING' | 'STARTING' | 'RUNNING' | 'COMPLETED' | 'CANCELLED';
  game_type: 'REGULAR' | 'TURBO' | 'HYPER_TURBO';
  current_level: number;
  level_start_time?: string;
  created_at: string;
  started_at?: string;
  finished_at?: string;
  winner_id?: string;
  created_by?: string;
  players?: SitAndGoPlayer[];
  current_players?: number;
}

export interface SitAndGoPlayer {
  id: string;
  game_id: string;
  player_id: string;
  seat_number: number;
  chips: number;
  status: 'ACTIVE' | 'ELIMINATED' | 'ALL_IN';
  final_position?: number;
  payout?: number;
  joined_at: string;
  eliminated_at?: string;
  profiles?: {
    alias?: string;
    avatar_url?: string;
  };
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

export const DEFAULT_BLIND_STRUCTURES = {
  REGULAR: [
    { level: 1, small_blind: 10, big_blind: 20, ante: 0, duration_minutes: 10 },
    { level: 2, small_blind: 15, big_blind: 30, ante: 0, duration_minutes: 10 },
    { level: 3, small_blind: 25, big_blind: 50, ante: 0, duration_minutes: 10 },
    { level: 4, small_blind: 50, big_blind: 100, ante: 0, duration_minutes: 10 },
    { level: 5, small_blind: 75, big_blind: 150, ante: 0, duration_minutes: 10 },
    { level: 6, small_blind: 100, big_blind: 200, ante: 25, duration_minutes: 10 },
    { level: 7, small_blind: 150, big_blind: 300, ante: 25, duration_minutes: 10 },
    { level: 8, small_blind: 200, big_blind: 400, ante: 50, duration_minutes: 10 },
    { level: 9, small_blind: 300, big_blind: 600, ante: 75, duration_minutes: 10 },
    { level: 10, small_blind: 400, big_blind: 800, ante: 100, duration_minutes: 10 }
  ],
  TURBO: [
    { level: 1, small_blind: 10, big_blind: 20, ante: 0, duration_minutes: 5 },
    { level: 2, small_blind: 15, big_blind: 30, ante: 0, duration_minutes: 5 },
    { level: 3, small_blind: 25, big_blind: 50, ante: 0, duration_minutes: 5 },
    { level: 4, small_blind: 50, big_blind: 100, ante: 0, duration_minutes: 5 },
    { level: 5, small_blind: 75, big_blind: 150, ante: 0, duration_minutes: 5 },
    { level: 6, small_blind: 100, big_blind: 200, ante: 25, duration_minutes: 5 },
    { level: 7, small_blind: 150, big_blind: 300, ante: 25, duration_minutes: 5 },
    { level: 8, small_blind: 200, big_blind: 400, ante: 50, duration_minutes: 5 },
    { level: 9, small_blind: 300, big_blind: 600, ante: 75, duration_minutes: 5 },
    { level: 10, small_blind: 400, big_blind: 800, ante: 100, duration_minutes: 5 }
  ],
  HYPER_TURBO: [
    { level: 1, small_blind: 10, big_blind: 20, ante: 0, duration_minutes: 3 },
    { level: 2, small_blind: 15, big_blind: 30, ante: 0, duration_minutes: 3 },
    { level: 3, small_blind: 25, big_blind: 50, ante: 0, duration_minutes: 3 },
    { level: 4, small_blind: 50, big_blind: 100, ante: 0, duration_minutes: 3 },
    { level: 5, small_blind: 75, big_blind: 150, ante: 0, duration_minutes: 3 },
    { level: 6, small_blind: 100, big_blind: 200, ante: 25, duration_minutes: 3 },
    { level: 7, small_blind: 150, big_blind: 300, ante: 25, duration_minutes: 3 },
    { level: 8, small_blind: 200, big_blind: 400, ante: 50, duration_minutes: 3 },
    { level: 9, small_blind: 300, big_blind: 600, ante: 75, duration_minutes: 3 },
    { level: 10, small_blind: 400, big_blind: 800, ante: 100, duration_minutes: 3 }
  ]
};

export const DEFAULT_PAYOUT_STRUCTURES = {
  2: [{ position: 1, percentage: 100 }],
  3: [
    { position: 1, percentage: 70 },
    { position: 2, percentage: 30 }
  ],
  6: [
    { position: 1, percentage: 50 },
    { position: 2, percentage: 30 },
    { position: 3, percentage: 20 }
  ],
  9: [
    { position: 1, percentage: 50 },
    { position: 2, percentage: 30 },
    { position: 3, percentage: 20 }
  ]
};
