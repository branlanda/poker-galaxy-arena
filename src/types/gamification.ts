
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  category: string;
  points: number;
  requirements: Record<string, any>;
  created_at: string;
}

export interface PlayerAchievement {
  id: string;
  player_id: string;
  achievement_id: string;
  unlocked_at?: string;
  progress: number;
  completed: boolean;
  achievement?: Achievement;
}

export interface PlayerLevel {
  id: string;
  player_id: string;
  current_level: number;
  current_xp: number;
  total_xp_earned: number;
  updated_at: string;
  level_definition?: LevelDefinition;
}

export interface LevelDefinition {
  level: number;
  xp_required: number;
  rewards?: Record<string, any>;
  title?: string;
}

export interface DailyMission {
  id: string;
  name: string;
  description: string;
  reward_xp: number;
  reward_chips?: number;
  requirements: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface PlayerMission {
  id: string;
  player_id: string;
  mission_id: string;
  assigned_at: string;
  completed_at?: string;
  progress: number;
  expires_at: string;
  mission?: DailyMission;
}

export interface Leaderboard {
  id: string;
  name: string;
  description?: string;
  category: string;
  period: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  prize_pool?: number;
  created_at: string;
  entries?: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  id: string;
  leaderboard_id: string;
  player_id: string;
  score: number;
  rank?: number;
  updated_at: string;
  player_name?: string;
  player_avatar?: string;
}

export interface CosmeticItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  rarity: string;
  image_url?: string;
  preview_url?: string;
  price?: number;
  is_premium: boolean;
  unlock_requirements?: Record<string, any>;
  created_at: string;
}

export interface PlayerCosmetic {
  id: string;
  player_id: string;
  item_id: string;
  acquired_at: string;
  is_equipped: boolean;
  item?: CosmeticItem;
}
