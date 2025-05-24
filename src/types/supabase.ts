
export interface Room {
  id: string;
  created_at?: string;
  name?: string;
  avatar?: string;
  user_id?: string;
}

export interface Profile {
  id: string;
  updated_at?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
}

// Room message type for table-specific chat
export interface RoomMessageType {
  id: string;
  table_id: string;
  player_id: string;
  player_name: string;
  message: string;
  created_at: string;
}

// Global chat message type
export interface ChatMessageType {
  id: string;
  player_id: string;
  channel_id: string;
  message: string;
  created_at: string;
  player_name?: string;
  player_avatar?: string;
}
