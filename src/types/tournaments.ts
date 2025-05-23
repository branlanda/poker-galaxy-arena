// Ensure these types are available for the useTournaments hook
export interface Tournament {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  status: string;
  buy_in: number;
  players_registered: number;
  max_players: number;
  prize_pool: number;
  created_at: string;
  [key: string]: any; // For other properties
}

export interface TournamentDetail extends Tournament {
  structure: any;
  blind_levels: any[];
  // Additional detail fields
}
