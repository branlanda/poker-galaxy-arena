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

// Add this new interface for the table_chat_messages
export interface RoomMessageType {
  id: string;
  table_id: string;
  player_id: string;
  player_name: string;
  message: string;
  created_at: string;
}
