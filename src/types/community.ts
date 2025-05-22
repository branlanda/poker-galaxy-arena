
export interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  sort_order: number;
  created_at: string;
  topic_count?: number;
  last_post?: ForumPost;
}

export interface ForumTopic {
  id: string;
  category_id: string;
  title: string;
  author_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  created_at: string;
  last_post_at: string;
  author_name?: string;
  author_avatar?: string;
  post_count?: number;
}

export interface ForumPost {
  id: string;
  topic_id: string;
  author_id: string;
  content: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_avatar?: string;
}

export interface PrivateMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject?: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
  recipient_name?: string;
  recipient_avatar?: string;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
  created_at: string;
  updated_at: string;
  friend_name?: string;
  friend_avatar?: string;
}

export interface PlayerActivity {
  id: string;
  player_id: string;
  activity_type: string;
  content?: string;
  metadata?: Record<string, any>;
  created_at: string;
  is_public: boolean;
  player_name?: string;
  player_avatar?: string;
}

export interface HomeGame {
  id: string;
  name: string;
  creator_id: string;
  description?: string;
  access_code?: string;
  is_active: boolean;
  max_players: number;
  small_blind: number;
  big_blind: number;
  min_buy_in: number;
  max_buy_in: number;
  created_at: string;
  scheduled_for?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  creator_name?: string;
  creator_avatar?: string;
  member_count?: number;
}

export interface HomeGameMember {
  id: string;
  home_game_id: string;
  player_id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joined_at: string;
  player_name?: string;
  player_avatar?: string;
}

export interface Notification {
  id: string;
  player_id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
  expires_at?: string;
}

export interface SpecialEvent {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  banner_url?: string;
  theme?: string;
  is_active: boolean;
  sponsor_info?: Record<string, any>;
  rewards?: Record<string, any>;
  created_at: string;
  participant_count?: number;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  player_id: string;
  registration_time: string;
  player_name?: string;
  player_avatar?: string;
}

export interface InfluencerCode {
  id: string;
  influencer_id: string;
  code: string;
  description?: string;
  benefit_description?: string;
  reward_chips?: number;
  is_active: boolean;
  uses_count: number;
  max_uses?: number;
  created_at: string;
  expires_at?: string;
  influencer_name?: string;
  influencer_avatar?: string;
}
