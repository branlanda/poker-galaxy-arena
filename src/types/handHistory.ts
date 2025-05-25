
export interface DetailedHandHistory {
  id: string;
  player_id: string;
  game_id?: string;
  hand_number: number;
  table_name: string;
  game_type: string;
  table_type: string;
  blinds: string;
  player_position?: number;
  hole_cards?: Card[];
  community_cards?: CommunityCardsProgression;
  betting_rounds: BettingRound[];
  final_pot: number;
  player_result: number;
  hand_strength?: string;
  showdown_cards?: Card[];
  duration_seconds?: number;
  played_at: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Card {
  suit: 'spades' | 'hearts' | 'diamonds' | 'clubs';
  value: string;
  code: string;
}

export interface CommunityCardsProgression {
  preflop: Card[];
  flop: Card[];
  turn: Card[];
  river: Card[];
}

export interface BettingRound {
  round: 'PREFLOP' | 'FLOP' | 'TURN' | 'RIVER';
  actions: PlayerAction[];
  pot_after_round: number;
}

export interface PlayerAction {
  player_id: string;
  player_name: string;
  action: 'FOLD' | 'CHECK' | 'CALL' | 'BET' | 'RAISE' | 'ALL_IN';
  amount?: number;
  position: number;
  stack_before: number;
  stack_after: number;
  timestamp: string;
}

export interface HandAnalysis {
  id: string;
  hand_id: string;
  player_id: string;
  analysis_type: 'MANUAL' | 'AI_SUGGESTION' | 'COMMUNITY';
  content: string;
  rating?: number;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface SharedHand {
  id: string;
  hand_id: string;
  shared_by: string;
  share_code: string;
  title?: string;
  description?: string;
  is_public: boolean;
  view_count: number;
  expires_at?: string;
  created_at: string;
}

export interface HandReport {
  id: string;
  hand_id: string;
  reported_by: string;
  reported_player_id?: string;
  report_type: 'COLLUSION' | 'BOT_PLAY' | 'SUSPICIOUS_BETTING';
  description: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  created_at: string;
}

export interface HandHistoryFilters {
  dateFrom?: string;
  dateTo?: string;
  gameType?: string;
  tableType?: string;
  result?: 'ALL' | 'WINS' | 'LOSSES';
  minPot?: number;
  maxPot?: number;
  handStrength?: string;
  tableName?: string;
}
