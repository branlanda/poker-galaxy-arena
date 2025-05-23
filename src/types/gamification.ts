
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  category: string;
  points: number;
  requirements: string;
  created_at: string;
}

export interface PlayerAchievement {
  id: string;
  player_id: string;
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  achievement?: Achievement; // Join from the achievements table
}

export interface Leaderboard {
  id: string;
  name: string;
  description: string;
  category: string;
  period: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  prize_pool?: number;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  leaderboard_id: string;
  player_id: string;
  score: number;
  rank?: number;
  created_at: string;
  player_name?: string;
  player_avatar?: string;
}

// Ensure we have proper definitions for these types
export interface LevelDefinition {
  level: number;
  xp_required: number;
  title?: string;
  rewards?: any;
}

export interface PlayerLevel {
  id: string;
  player_id: string;
  current_level: number;
  current_xp: number;
  total_xp_earned: number;
  updated_at: string;
  level_definition?: LevelDefinition | null;
}
