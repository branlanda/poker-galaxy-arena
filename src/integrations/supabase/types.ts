export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string | null
          description: string
          icon_url: string | null
          id: string
          name: string
          points: number
          requirements: Json
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          icon_url?: string | null
          id?: string
          name: string
          points?: number
          requirements: Json
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          icon_url?: string | null
          id?: string
          name?: string
          points?: number
          requirements?: Json
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id: string
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          type?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      avatar_collection: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_nft: boolean | null
          name: string
          nft_contract_address: string | null
          nft_token_id: string | null
          rarity: string | null
          unlock_requirement: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_nft?: boolean | null
          name: string
          nft_contract_address?: string | null
          nft_token_id?: string | null
          rarity?: string | null
          unlock_requirement?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_nft?: boolean | null
          name?: string
          nft_contract_address?: string | null
          nft_token_id?: string | null
          rarity?: string | null
          unlock_requirement?: string | null
        }
        Relationships: []
      }
      cash_tables: {
        Row: {
          big_blind: number
          created_at: string | null
          id: number
          max_players: number
          rake_percent: number
          small_blind: number
          state: Database["public"]["Enums"]["table_state"]
          table_code: string
          variant: Database["public"]["Enums"]["table_variant"]
        }
        Insert: {
          big_blind: number
          created_at?: string | null
          id?: number
          max_players: number
          rake_percent?: number
          small_blind: number
          state?: Database["public"]["Enums"]["table_state"]
          table_code: string
          variant?: Database["public"]["Enums"]["table_variant"]
        }
        Update: {
          big_blind?: number
          created_at?: string | null
          id?: number
          max_players?: number
          rake_percent?: number
          small_blind?: number
          state?: Database["public"]["Enums"]["table_state"]
          table_code?: string
          variant?: Database["public"]["Enums"]["table_variant"]
        }
        Relationships: []
      }
      chat_banned_words: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          replacement: string | null
          severity: string | null
          word: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          replacement?: string | null
          severity?: string | null
          word: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          replacement?: string | null
          severity?: string | null
          word?: string
        }
        Relationships: []
      }
      chat_channels: {
        Row: {
          channel_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          max_message_length: number | null
          name: string
          table_id: string | null
        }
        Insert: {
          channel_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_message_length?: number | null
          name: string
          table_id?: string | null
        }
        Update: {
          channel_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_message_length?: number | null
          name?: string
          table_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          channel_id: string
          created_at: string
          edited_at: string | null
          id: string
          is_deleted: boolean | null
          is_system_message: boolean | null
          mentions: Json | null
          message: string
          player_id: string
          reply_to_message_id: string | null
        }
        Insert: {
          channel_id?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_system_message?: boolean | null
          mentions?: Json | null
          message: string
          player_id: string
          reply_to_message_id?: string | null
        }
        Update: {
          channel_id?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_system_message?: boolean | null
          mentions?: Json | null
          message?: string
          player_id?: string
          reply_to_message_id?: string | null
        }
        Relationships: []
      }
      chat_moderation: {
        Row: {
          action_taken: string | null
          created_at: string | null
          id: string
          message_id: string | null
          moderator_id: string | null
          notes: string | null
          reason: string
          reporter_id: string | null
          resolved_at: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          message_id?: string | null
          moderator_id?: string | null
          notes?: string | null
          reason: string
          reporter_id?: string | null
          resolved_at?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          message_id?: string | null
          moderator_id?: string | null
          notes?: string | null
          reason?: string
          reporter_id?: string | null
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_moderation_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_typing_indicators: {
        Row: {
          channel_id: string
          id: string
          is_typing: boolean | null
          player_id: string
          updated_at: string | null
        }
        Insert: {
          channel_id: string
          id?: string
          is_typing?: boolean | null
          player_id: string
          updated_at?: string | null
        }
        Update: {
          channel_id?: string
          id?: string
          is_typing?: boolean | null
          player_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_user_preferences: {
        Row: {
          channel_id: string | null
          created_at: string | null
          emoji_enabled: boolean | null
          id: string
          is_muted: boolean | null
          notification_enabled: boolean | null
          player_id: string
          updated_at: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          emoji_enabled?: boolean | null
          id?: string
          is_muted?: boolean | null
          notification_enabled?: boolean | null
          player_id: string
          updated_at?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          emoji_enabled?: boolean | null
          id?: string
          is_muted?: boolean | null
          notification_enabled?: boolean | null
          player_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      compliance_reports: {
        Row: {
          created_at: string | null
          file_path: string
          hash_root_path: string
          id: number
          report_date: string
          signature_path: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          hash_root_path: string
          id?: number
          report_date: string
          signature_path: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          hash_root_path?: string
          id?: number
          report_date?: string
          signature_path?: string
        }
        Relationships: []
      }
      cosmetic_items: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_premium: boolean | null
          name: string
          preview_url: string | null
          price: number | null
          rarity: string
          unlock_requirements: Json | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_premium?: boolean | null
          name: string
          preview_url?: string | null
          price?: number | null
          rarity: string
          unlock_requirements?: Json | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_premium?: boolean | null
          name?: string
          preview_url?: string | null
          price?: number | null
          rarity?: string
          unlock_requirements?: Json | null
        }
        Relationships: []
      }
      daily_hash_root: {
        Row: {
          day: string
          hash_root: string
          inserted_at: string | null
        }
        Insert: {
          day: string
          hash_root: string
          inserted_at?: string | null
        }
        Update: {
          day?: string
          hash_root?: string
          inserted_at?: string | null
        }
        Relationships: []
      }
      daily_missions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          name: string
          requirements: Json
          reward_chips: number | null
          reward_xp: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          name: string
          requirements: Json
          reward_chips?: number | null
          reward_xp?: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          requirements?: Json
          reward_chips?: number | null
          reward_xp?: number
        }
        Relationships: []
      }
      detailed_hand_history: {
        Row: {
          betting_rounds: Json
          blinds: string
          community_cards: Json | null
          created_at: string
          duration_seconds: number | null
          final_pot: number
          game_id: string | null
          game_type: string
          hand_number: number
          hand_strength: string | null
          hole_cards: Json | null
          id: string
          metadata: Json | null
          played_at: string
          player_id: string
          player_position: number | null
          player_result: number
          showdown_cards: Json | null
          table_name: string
          table_type: string
        }
        Insert: {
          betting_rounds?: Json
          blinds: string
          community_cards?: Json | null
          created_at?: string
          duration_seconds?: number | null
          final_pot?: number
          game_id?: string | null
          game_type?: string
          hand_number: number
          hand_strength?: string | null
          hole_cards?: Json | null
          id?: string
          metadata?: Json | null
          played_at?: string
          player_id: string
          player_position?: number | null
          player_result?: number
          showdown_cards?: Json | null
          table_name: string
          table_type?: string
        }
        Update: {
          betting_rounds?: Json
          blinds?: string
          community_cards?: Json | null
          created_at?: string
          duration_seconds?: number | null
          final_pot?: number
          game_id?: string | null
          game_type?: string
          hand_number?: number
          hand_strength?: string | null
          hole_cards?: Json | null
          id?: string
          metadata?: Json | null
          played_at?: string
          player_id?: string
          player_position?: number | null
          player_result?: number
          showdown_cards?: Json | null
          table_name?: string
          table_type?: string
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          event_id: string
          id: string
          player_id: string
          registration_time: string | null
        }
        Insert: {
          event_id: string
          id?: string
          player_id: string
          registration_time?: string | null
        }
        Update: {
          event_id?: string
          id?: string
          player_id?: string
          registration_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "special_events"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          is_edited: boolean | null
          topic_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          topic_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_edited?: boolean | null
          topic_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          author_id: string
          category_id: string
          created_at: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_post_at: string | null
          title: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category_id: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_post_at?: string | null
          title: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_post_at?: string | null
          title?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          blocked_at: string | null
          blocked_by: string | null
          created_at: string | null
          friend_id: string
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          blocked_at?: string | null
          blocked_by?: string | null
          created_at?: string | null
          friend_id: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          blocked_at?: string | null
          blocked_by?: string | null
          created_at?: string | null
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      game_history: {
        Row: {
          buy_in: number | null
          duration: unknown | null
          game_type: string
          id: string
          metadata: Json | null
          played_at: string | null
          player_id: string
          position: number | null
          result: number | null
          table_name: string | null
        }
        Insert: {
          buy_in?: number | null
          duration?: unknown | null
          game_type: string
          id?: string
          metadata?: Json | null
          played_at?: string | null
          player_id: string
          position?: number | null
          result?: number | null
          table_name?: string | null
        }
        Update: {
          buy_in?: number | null
          duration?: unknown | null
          game_type?: string
          id?: string
          metadata?: Json | null
          played_at?: string | null
          player_id?: string
          position?: number | null
          result?: number | null
          table_name?: string | null
        }
        Relationships: []
      }
      game_invitations: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          invitation_type: string
          message: string | null
          recipient_id: string
          responded_at: string | null
          sender_id: string
          status: string
          table_id: string | null
          tournament_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invitation_type: string
          message?: string | null
          recipient_id: string
          responded_at?: string | null
          sender_id: string
          status?: string
          table_id?: string | null
          tournament_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invitation_type?: string
          message?: string | null
          recipient_id?: string
          responded_at?: string | null
          sender_id?: string
          status?: string
          table_id?: string | null
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_invitations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "lobby_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_invitations_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments_new"
            referencedColumns: ["id"]
          },
        ]
      }
      hand_analysis: {
        Row: {
          analysis_type: string
          content: string
          created_at: string
          hand_id: string
          id: string
          is_public: boolean | null
          player_id: string
          rating: number | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          analysis_type: string
          content: string
          created_at?: string
          hand_id: string
          id?: string
          is_public?: boolean | null
          player_id: string
          rating?: number | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          analysis_type?: string
          content?: string
          created_at?: string
          hand_id?: string
          id?: string
          is_public?: boolean | null
          player_id?: string
          rating?: number | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hand_analysis_hand_id_fkey"
            columns: ["hand_id"]
            isOneToOne: false
            referencedRelation: "detailed_hand_history"
            referencedColumns: ["id"]
          },
        ]
      }
      hand_audit: {
        Row: {
          created_at: string | null
          hand_id: number
          hash_curr: string | null
          hash_prev: string | null
        }
        Insert: {
          created_at?: string | null
          hand_id: number
          hash_curr?: string | null
          hash_prev?: string | null
        }
        Update: {
          created_at?: string | null
          hand_id?: number
          hash_curr?: string | null
          hash_prev?: string | null
        }
        Relationships: []
      }
      hand_reports: {
        Row: {
          created_at: string
          description: string
          hand_id: string
          id: string
          moderator_id: string | null
          moderator_notes: string | null
          report_type: string
          reported_by: string
          reported_player_id: string | null
          resolved_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description: string
          hand_id: string
          id?: string
          moderator_id?: string | null
          moderator_notes?: string | null
          report_type: string
          reported_by: string
          reported_player_id?: string | null
          resolved_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string
          hand_id?: string
          id?: string
          moderator_id?: string | null
          moderator_notes?: string | null
          report_type?: string
          reported_by?: string
          reported_player_id?: string | null
          resolved_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "hand_reports_hand_id_fkey"
            columns: ["hand_id"]
            isOneToOne: false
            referencedRelation: "detailed_hand_history"
            referencedColumns: ["id"]
          },
        ]
      }
      hands: {
        Row: {
          actions_json: Json
          community_json: Json
          created_at: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake: number
          table_id: number
          table_kind: string | null
          winners_json: Json
        }
        Insert: {
          actions_json: Json
          community_json: Json
          created_at?: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake?: number
          table_id: number
          table_kind?: string | null
          winners_json: Json
        }
        Update: {
          actions_json?: Json
          community_json?: Json
          created_at?: string
          hand_no?: number
          id?: number
          players_json?: Json
          pot?: number
          rake?: number
          table_id?: number
          table_kind?: string | null
          winners_json?: Json
        }
        Relationships: []
      }
      hands_2025_05: {
        Row: {
          actions_json: Json
          community_json: Json
          created_at: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake: number
          table_id: number
          table_kind: string | null
          winners_json: Json
        }
        Insert: {
          actions_json: Json
          community_json: Json
          created_at?: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake?: number
          table_id: number
          table_kind?: string | null
          winners_json: Json
        }
        Update: {
          actions_json?: Json
          community_json?: Json
          created_at?: string
          hand_no?: number
          id?: number
          players_json?: Json
          pot?: number
          rake?: number
          table_id?: number
          table_kind?: string | null
          winners_json?: Json
        }
        Relationships: []
      }
      hands_2025_06: {
        Row: {
          actions_json: Json
          community_json: Json
          created_at: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake: number
          table_id: number
          table_kind: string | null
          winners_json: Json
        }
        Insert: {
          actions_json: Json
          community_json: Json
          created_at?: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake?: number
          table_id: number
          table_kind?: string | null
          winners_json: Json
        }
        Update: {
          actions_json?: Json
          community_json?: Json
          created_at?: string
          hand_no?: number
          id?: number
          players_json?: Json
          pot?: number
          rake?: number
          table_id?: number
          table_kind?: string | null
          winners_json?: Json
        }
        Relationships: []
      }
      hands_2025_07: {
        Row: {
          actions_json: Json
          community_json: Json
          created_at: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake: number
          table_id: number
          table_kind: string | null
          winners_json: Json
        }
        Insert: {
          actions_json: Json
          community_json: Json
          created_at?: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake?: number
          table_id: number
          table_kind?: string | null
          winners_json: Json
        }
        Update: {
          actions_json?: Json
          community_json?: Json
          created_at?: string
          hand_no?: number
          id?: number
          players_json?: Json
          pot?: number
          rake?: number
          table_id?: number
          table_kind?: string | null
          winners_json?: Json
        }
        Relationships: []
      }
      hands_2025_08: {
        Row: {
          actions_json: Json
          community_json: Json
          created_at: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake: number
          table_id: number
          table_kind: string | null
          winners_json: Json
        }
        Insert: {
          actions_json: Json
          community_json: Json
          created_at?: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake?: number
          table_id: number
          table_kind?: string | null
          winners_json: Json
        }
        Update: {
          actions_json?: Json
          community_json?: Json
          created_at?: string
          hand_no?: number
          id?: number
          players_json?: Json
          pot?: number
          rake?: number
          table_id?: number
          table_kind?: string | null
          winners_json?: Json
        }
        Relationships: []
      }
      hands_2025_09: {
        Row: {
          actions_json: Json
          community_json: Json
          created_at: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake: number
          table_id: number
          table_kind: string | null
          winners_json: Json
        }
        Insert: {
          actions_json: Json
          community_json: Json
          created_at?: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake?: number
          table_id: number
          table_kind?: string | null
          winners_json: Json
        }
        Update: {
          actions_json?: Json
          community_json?: Json
          created_at?: string
          hand_no?: number
          id?: number
          players_json?: Json
          pot?: number
          rake?: number
          table_id?: number
          table_kind?: string | null
          winners_json?: Json
        }
        Relationships: []
      }
      hands_2025_10: {
        Row: {
          actions_json: Json
          community_json: Json
          created_at: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake: number
          table_id: number
          table_kind: string | null
          winners_json: Json
        }
        Insert: {
          actions_json: Json
          community_json: Json
          created_at?: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake?: number
          table_id: number
          table_kind?: string | null
          winners_json: Json
        }
        Update: {
          actions_json?: Json
          community_json?: Json
          created_at?: string
          hand_no?: number
          id?: number
          players_json?: Json
          pot?: number
          rake?: number
          table_id?: number
          table_kind?: string | null
          winners_json?: Json
        }
        Relationships: []
      }
      hands_2025_11: {
        Row: {
          actions_json: Json
          community_json: Json
          created_at: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake: number
          table_id: number
          table_kind: string | null
          winners_json: Json
        }
        Insert: {
          actions_json: Json
          community_json: Json
          created_at?: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake?: number
          table_id: number
          table_kind?: string | null
          winners_json: Json
        }
        Update: {
          actions_json?: Json
          community_json?: Json
          created_at?: string
          hand_no?: number
          id?: number
          players_json?: Json
          pot?: number
          rake?: number
          table_id?: number
          table_kind?: string | null
          winners_json?: Json
        }
        Relationships: []
      }
      hands_2025_12: {
        Row: {
          actions_json: Json
          community_json: Json
          created_at: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake: number
          table_id: number
          table_kind: string | null
          winners_json: Json
        }
        Insert: {
          actions_json: Json
          community_json: Json
          created_at?: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake?: number
          table_id: number
          table_kind?: string | null
          winners_json: Json
        }
        Update: {
          actions_json?: Json
          community_json?: Json
          created_at?: string
          hand_no?: number
          id?: number
          players_json?: Json
          pot?: number
          rake?: number
          table_id?: number
          table_kind?: string | null
          winners_json?: Json
        }
        Relationships: []
      }
      hands_2026_01: {
        Row: {
          actions_json: Json
          community_json: Json
          created_at: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake: number
          table_id: number
          table_kind: string | null
          winners_json: Json
        }
        Insert: {
          actions_json: Json
          community_json: Json
          created_at?: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake?: number
          table_id: number
          table_kind?: string | null
          winners_json: Json
        }
        Update: {
          actions_json?: Json
          community_json?: Json
          created_at?: string
          hand_no?: number
          id?: number
          players_json?: Json
          pot?: number
          rake?: number
          table_id?: number
          table_kind?: string | null
          winners_json?: Json
        }
        Relationships: []
      }
      hands_2026_02: {
        Row: {
          actions_json: Json
          community_json: Json
          created_at: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake: number
          table_id: number
          table_kind: string | null
          winners_json: Json
        }
        Insert: {
          actions_json: Json
          community_json: Json
          created_at?: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake?: number
          table_id: number
          table_kind?: string | null
          winners_json: Json
        }
        Update: {
          actions_json?: Json
          community_json?: Json
          created_at?: string
          hand_no?: number
          id?: number
          players_json?: Json
          pot?: number
          rake?: number
          table_id?: number
          table_kind?: string | null
          winners_json?: Json
        }
        Relationships: []
      }
      hands_2026_03: {
        Row: {
          actions_json: Json
          community_json: Json
          created_at: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake: number
          table_id: number
          table_kind: string | null
          winners_json: Json
        }
        Insert: {
          actions_json: Json
          community_json: Json
          created_at?: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake?: number
          table_id: number
          table_kind?: string | null
          winners_json: Json
        }
        Update: {
          actions_json?: Json
          community_json?: Json
          created_at?: string
          hand_no?: number
          id?: number
          players_json?: Json
          pot?: number
          rake?: number
          table_id?: number
          table_kind?: string | null
          winners_json?: Json
        }
        Relationships: []
      }
      hands_2026_04: {
        Row: {
          actions_json: Json
          community_json: Json
          created_at: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake: number
          table_id: number
          table_kind: string | null
          winners_json: Json
        }
        Insert: {
          actions_json: Json
          community_json: Json
          created_at?: string
          hand_no: number
          id: number
          players_json: Json
          pot: number
          rake?: number
          table_id: number
          table_kind?: string | null
          winners_json: Json
        }
        Update: {
          actions_json?: Json
          community_json?: Json
          created_at?: string
          hand_no?: number
          id?: number
          players_json?: Json
          pot?: number
          rake?: number
          table_id?: number
          table_kind?: string | null
          winners_json?: Json
        }
        Relationships: []
      }
      home_game_members: {
        Row: {
          home_game_id: string
          id: string
          joined_at: string | null
          player_id: string
          role: string
        }
        Insert: {
          home_game_id: string
          id?: string
          joined_at?: string | null
          player_id: string
          role?: string
        }
        Update: {
          home_game_id?: string
          id?: string
          joined_at?: string | null
          player_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "home_game_members_home_game_id_fkey"
            columns: ["home_game_id"]
            isOneToOne: false
            referencedRelation: "home_games"
            referencedColumns: ["id"]
          },
        ]
      }
      home_games: {
        Row: {
          access_code: string | null
          big_blind: number
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          is_active: boolean | null
          is_recurring: boolean | null
          max_buy_in: number
          max_players: number
          min_buy_in: number
          name: string
          recurrence_pattern: string | null
          scheduled_for: string | null
          small_blind: number
        }
        Insert: {
          access_code?: string | null
          big_blind: number
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          max_buy_in: number
          max_players?: number
          min_buy_in: number
          name: string
          recurrence_pattern?: string | null
          scheduled_for?: string | null
          small_blind: number
        }
        Update: {
          access_code?: string | null
          big_blind?: number
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          max_buy_in?: number
          max_players?: number
          min_buy_in?: number
          name?: string
          recurrence_pattern?: string | null
          scheduled_for?: string | null
          small_blind?: number
        }
        Relationships: []
      }
      influencer_codes: {
        Row: {
          benefit_description: string | null
          code: string
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          influencer_id: string
          is_active: boolean | null
          max_uses: number | null
          reward_chips: number | null
          uses_count: number | null
        }
        Insert: {
          benefit_description?: string | null
          code: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          influencer_id: string
          is_active?: boolean | null
          max_uses?: number | null
          reward_chips?: number | null
          uses_count?: number | null
        }
        Update: {
          benefit_description?: string | null
          code?: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          influencer_id?: string
          is_active?: boolean | null
          max_uses?: number | null
          reward_chips?: number | null
          uses_count?: number | null
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: {
          id: string
          leaderboard_id: string
          player_id: string
          rank: number | null
          score: number
          updated_at: string | null
        }
        Insert: {
          id?: string
          leaderboard_id: string
          player_id: string
          rank?: number | null
          score?: number
          updated_at?: string | null
        }
        Update: {
          id?: string
          leaderboard_id?: string
          player_id?: string
          rank?: number | null
          score?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_leaderboard_id_fkey"
            columns: ["leaderboard_id"]
            isOneToOne: false
            referencedRelation: "leaderboards"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboards: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          period: string
          prize_pool: number | null
          start_date: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          period: string
          prize_pool?: number | null
          start_date?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          period?: string
          prize_pool?: number | null
          start_date?: string | null
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          amount: number
          created_at: string | null
          credit_account: number
          debit_account: number
          id: number
          meta: Json
          tx_hash: string | null
          tx_type: Database["public"]["Enums"]["tx_type"]
        }
        Insert: {
          amount: number
          created_at?: string | null
          credit_account: number
          debit_account: number
          id?: number
          meta?: Json
          tx_hash?: string | null
          tx_type: Database["public"]["Enums"]["tx_type"]
        }
        Update: {
          amount?: number
          created_at?: string | null
          credit_account?: number
          debit_account?: number
          id?: number
          meta?: Json
          tx_hash?: string | null
          tx_type?: Database["public"]["Enums"]["tx_type"]
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_credit_account_fkey"
            columns: ["credit_account"]
            isOneToOne: false
            referencedRelation: "wallet_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_debit_account_fkey"
            columns: ["debit_account"]
            isOneToOne: false
            referencedRelation: "wallet_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      level_definitions: {
        Row: {
          level: number
          rewards: Json | null
          title: string | null
          xp_required: number
        }
        Insert: {
          level: number
          rewards?: Json | null
          title?: string | null
          xp_required: number
        }
        Update: {
          level?: number
          rewards?: Json | null
          title?: string | null
          xp_required?: number
        }
        Relationships: []
      }
      lobby_tables: {
        Row: {
          big_blind: number
          created_at: string
          creator_id: string
          current_players: number
          id: string
          is_private: boolean
          max_buy_in: number
          max_players: number
          min_buy_in: number
          name: string
          password: string | null
          small_blind: number
          status: string
          table_type: string
          updated_at: string
        }
        Insert: {
          big_blind: number
          created_at?: string
          creator_id: string
          current_players?: number
          id?: string
          is_private?: boolean
          max_buy_in: number
          max_players?: number
          min_buy_in: number
          name: string
          password?: string | null
          small_blind: number
          status?: string
          table_type?: string
          updated_at?: string
        }
        Update: {
          big_blind?: number
          created_at?: string
          creator_id?: string
          current_players?: number
          id?: string
          is_private?: boolean
          max_buy_in?: number
          max_players?: number
          min_buy_in?: number
          name?: string
          password?: string | null
          small_blind?: number
          status?: string
          table_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          player_id: string
          title: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          player_id: string
          title: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          player_id?: string
          title?: string
        }
        Relationships: []
      }
      player_achievements: {
        Row: {
          achievement_id: string
          completed: boolean | null
          id: string
          player_id: string
          progress: number | null
          unlocked_at: string | null
        }
        Insert: {
          achievement_id: string
          completed?: boolean | null
          id?: string
          player_id: string
          progress?: number | null
          unlocked_at?: string | null
        }
        Update: {
          achievement_id?: string
          completed?: boolean | null
          id?: string
          player_id?: string
          progress?: number | null
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      player_activities: {
        Row: {
          activity_type: string
          content: string | null
          created_at: string | null
          id: string
          is_public: boolean | null
          metadata: Json | null
          player_id: string
        }
        Insert: {
          activity_type: string
          content?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          player_id: string
        }
        Update: {
          activity_type?: string
          content?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          player_id?: string
        }
        Relationships: []
      }
      player_avatars: {
        Row: {
          acquired_at: string | null
          avatar_id: string
          id: string
          player_id: string
        }
        Insert: {
          acquired_at?: string | null
          avatar_id: string
          id?: string
          player_id: string
        }
        Update: {
          acquired_at?: string | null
          avatar_id?: string
          id?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_avatars_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "avatar_collection"
            referencedColumns: ["id"]
          },
        ]
      }
      player_cosmetics: {
        Row: {
          acquired_at: string | null
          id: string
          is_equipped: boolean | null
          item_id: string
          player_id: string
        }
        Insert: {
          acquired_at?: string | null
          id?: string
          is_equipped?: boolean | null
          item_id: string
          player_id: string
        }
        Update: {
          acquired_at?: string | null
          id?: string
          is_equipped?: boolean | null
          item_id?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_cosmetics_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "cosmetic_items"
            referencedColumns: ["id"]
          },
        ]
      }
      player_levels: {
        Row: {
          current_level: number
          current_xp: number
          id: string
          player_id: string
          total_xp_earned: number
          updated_at: string | null
        }
        Insert: {
          current_level?: number
          current_xp?: number
          id?: string
          player_id: string
          total_xp_earned?: number
          updated_at?: string | null
        }
        Update: {
          current_level?: number
          current_xp?: number
          id?: string
          player_id?: string
          total_xp_earned?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      player_missions: {
        Row: {
          assigned_at: string | null
          completed_at: string | null
          expires_at: string
          id: string
          mission_id: string
          player_id: string
          progress: number | null
        }
        Insert: {
          assigned_at?: string | null
          completed_at?: string | null
          expires_at: string
          id?: string
          mission_id: string
          player_id: string
          progress?: number | null
        }
        Update: {
          assigned_at?: string | null
          completed_at?: string | null
          expires_at?: string
          id?: string
          mission_id?: string
          player_id?: string
          progress?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "daily_missions"
            referencedColumns: ["id"]
          },
        ]
      }
      player_reputation: {
        Row: {
          player_id: string
          score: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          player_id: string
          score?: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          player_id?: string
          score?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_reputation_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "player_reputation_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "vw_player_balance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      player_statistics: {
        Row: {
          average_position: number | null
          biggest_loss: number | null
          biggest_win: number | null
          created_at: string | null
          current_level: number | null
          games_lost: number | null
          games_won: number | null
          hands_played: number | null
          id: string
          player_id: string
          total_losses: number | null
          total_winnings: number | null
          total_xp: number | null
          tournaments_played: number | null
          tournaments_won: number | null
          updated_at: string | null
          win_rate: number | null
        }
        Insert: {
          average_position?: number | null
          biggest_loss?: number | null
          biggest_win?: number | null
          created_at?: string | null
          current_level?: number | null
          games_lost?: number | null
          games_won?: number | null
          hands_played?: number | null
          id?: string
          player_id: string
          total_losses?: number | null
          total_winnings?: number | null
          total_xp?: number | null
          tournaments_played?: number | null
          tournaments_won?: number | null
          updated_at?: string | null
          win_rate?: number | null
        }
        Update: {
          average_position?: number | null
          biggest_loss?: number | null
          biggest_win?: number | null
          created_at?: string | null
          current_level?: number | null
          games_lost?: number | null
          games_won?: number | null
          hands_played?: number | null
          id?: string
          player_id?: string
          total_losses?: number | null
          total_winnings?: number | null
          total_xp?: number | null
          tournaments_played?: number | null
          tournaments_won?: number | null
          updated_at?: string | null
          win_rate?: number | null
        }
        Relationships: []
      }
      player_tournament_history: {
        Row: {
          average_finish: number | null
          best_finish: number | null
          id: string
          player_id: string
          roi: number | null
          total_prize_money: number | null
          tournaments_final_table: number | null
          tournaments_played: number | null
          tournaments_won: number | null
          updated_at: string
        }
        Insert: {
          average_finish?: number | null
          best_finish?: number | null
          id?: string
          player_id: string
          roi?: number | null
          total_prize_money?: number | null
          tournaments_final_table?: number | null
          tournaments_played?: number | null
          tournaments_won?: number | null
          updated_at?: string
        }
        Update: {
          average_finish?: number | null
          best_finish?: number | null
          id?: string
          player_id?: string
          roi?: number | null
          total_prize_money?: number | null
          tournaments_final_table?: number | null
          tournaments_played?: number | null
          tournaments_won?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          alias: string
          country_iso: string | null
          created_at: string | null
          kyc_level: number
          last_login_at: string | null
          role: Database["public"]["Enums"]["player_role"]
          show_public_stats: boolean | null
          user_id: string
        }
        Insert: {
          alias: string
          country_iso?: string | null
          created_at?: string | null
          kyc_level?: number
          last_login_at?: string | null
          role?: Database["public"]["Enums"]["player_role"]
          show_public_stats?: boolean | null
          user_id: string
        }
        Update: {
          alias?: string
          country_iso?: string | null
          created_at?: string | null
          kyc_level?: number
          last_login_at?: string | null
          role?: Database["public"]["Enums"]["player_role"]
          show_public_stats?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      players_at_table: {
        Row: {
          id: string
          joined_at: string
          player_id: string
          seat_number: number | null
          stack: number
          status: string
          table_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          player_id: string
          seat_number?: number | null
          stack: number
          status?: string
          table_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          player_id?: string
          seat_number?: number | null
          stack?: number
          status?: string
          table_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_at_table_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "lobby_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      private_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          alias: string | null
          avatar_url: string | null
          created_at: string | null
          id: string
          show_public_stats: boolean | null
          updated_at: string | null
          wallet_address: string | null
        }
        Insert: {
          alias?: string | null
          avatar_url?: string | null
          created_at?: string | null
          id: string
          show_public_stats?: boolean | null
          updated_at?: string | null
          wallet_address?: string | null
        }
        Update: {
          alias?: string | null
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          show_public_stats?: boolean | null
          updated_at?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      room_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          player_id: string
          player_name: string
          table_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          player_id: string
          player_name: string
          table_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          player_id?: string
          player_name?: string
          table_id?: string
        }
        Relationships: []
      }
      seats: {
        Row: {
          id: number
          player_id: string | null
          sat_down_at: string | null
          seat_no: number
          stack: number
          table_id: number | null
        }
        Insert: {
          id?: number
          player_id?: string | null
          sat_down_at?: string | null
          seat_no: number
          stack: number
          table_id?: number | null
        }
        Update: {
          id?: number
          player_id?: string | null
          sat_down_at?: string | null
          seat_no?: number
          stack?: number
          table_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "seats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "vw_player_balance"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "seats_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "cash_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_hands: {
        Row: {
          created_at: string
          description: string | null
          expires_at: string | null
          hand_id: string
          id: string
          is_public: boolean | null
          share_code: string
          shared_by: string
          title: string | null
          view_count: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          expires_at?: string | null
          hand_id: string
          id?: string
          is_public?: boolean | null
          share_code: string
          shared_by: string
          title?: string | null
          view_count?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          expires_at?: string | null
          hand_id?: string
          id?: string
          is_public?: boolean | null
          share_code?: string
          shared_by?: string
          title?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_hands_hand_id_fkey"
            columns: ["hand_id"]
            isOneToOne: false
            referencedRelation: "detailed_hand_history"
            referencedColumns: ["id"]
          },
        ]
      }
      special_events: {
        Row: {
          banner_url: string | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          rewards: Json | null
          sponsor_info: Json | null
          start_date: string
          theme: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          rewards?: Json | null
          sponsor_info?: Json | null
          start_date: string
          theme?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          rewards?: Json | null
          sponsor_info?: Json | null
          start_date?: string
          theme?: string | null
        }
        Relationships: []
      }
      table_actions: {
        Row: {
          action: string
          amount: number | null
          created_at: string | null
          game_id: string | null
          id: string
          player_id: string | null
        }
        Insert: {
          action: string
          amount?: number | null
          created_at?: string | null
          game_id?: string | null
          id?: string
          player_id?: string | null
        }
        Update: {
          action?: string
          amount?: number | null
          created_at?: string | null
          game_id?: string | null
          id?: string
          player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_actions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "table_games"
            referencedColumns: ["id"]
          },
        ]
      }
      table_games: {
        Row: {
          active_seat: number | null
          community_cards: Json | null
          created_at: string | null
          current_bet: number | null
          dealer_seat: number | null
          id: string
          last_action_time: string | null
          phase: string
          pot: number
          table_id: string | null
        }
        Insert: {
          active_seat?: number | null
          community_cards?: Json | null
          created_at?: string | null
          current_bet?: number | null
          dealer_seat?: number | null
          id?: string
          last_action_time?: string | null
          phase?: string
          pot?: number
          table_id?: string | null
        }
        Update: {
          active_seat?: number | null
          community_cards?: Json | null
          created_at?: string | null
          current_bet?: number | null
          dealer_seat?: number | null
          id?: string
          last_action_time?: string | null
          phase?: string
          pot?: number
          table_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_games_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "lobby_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      table_player_states: {
        Row: {
          created_at: string | null
          current_bet: number | null
          game_id: string | null
          hole_cards: Json | null
          id: string
          is_big_blind: boolean | null
          is_dealer: boolean | null
          is_small_blind: boolean | null
          player_id: string | null
          seat_number: number
          stack: number
          status: string
        }
        Insert: {
          created_at?: string | null
          current_bet?: number | null
          game_id?: string | null
          hole_cards?: Json | null
          id?: string
          is_big_blind?: boolean | null
          is_dealer?: boolean | null
          is_small_blind?: boolean | null
          player_id?: string | null
          seat_number: number
          stack: number
          status?: string
        }
        Update: {
          created_at?: string | null
          current_bet?: number | null
          game_id?: string | null
          hole_cards?: Json | null
          id?: string
          is_big_blind?: boolean | null
          is_dealer?: boolean | null
          is_small_blind?: boolean | null
          player_id?: string | null
          seat_number?: number
          stack?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_player_states_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "table_games"
            referencedColumns: ["id"]
          },
        ]
      }
      telemetry_raw: {
        Row: {
          created_at: string | null
          id: number
          payload: Json
          player_id: string | null
          table_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          payload: Json
          player_id?: string | null
          table_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          payload?: Json
          player_id?: string | null
          table_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_raw_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "telemetry_raw_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "vw_player_balance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tournament_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          player_id: string
          tournament_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          player_id: string
          tournament_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          player_id?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_chat_messages_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments_new"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          player_id: string | null
          title: string
          tournament_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          player_id?: string | null
          title: string
          tournament_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          player_id?: string | null
          title?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_notifications_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments_new"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_player_stats: {
        Row: {
          chips_won: number | null
          created_at: string
          elimination_hand: Json | null
          final_position: number | null
          hands_played: number | null
          hands_won: number | null
          id: string
          play_duration: unknown | null
          player_id: string
          prize_amount: number | null
          tournament_id: string
        }
        Insert: {
          chips_won?: number | null
          created_at?: string
          elimination_hand?: Json | null
          final_position?: number | null
          hands_played?: number | null
          hands_won?: number | null
          id?: string
          play_duration?: unknown | null
          player_id: string
          prize_amount?: number | null
          tournament_id: string
        }
        Update: {
          chips_won?: number | null
          created_at?: string
          elimination_hand?: Json | null
          final_position?: number | null
          hands_played?: number | null
          hands_won?: number | null
          id?: string
          play_duration?: unknown | null
          player_id?: string
          prize_amount?: number | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_player_stats_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments_new"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_players: {
        Row: {
          id: number
          player_id: string | null
          seat_no: number | null
          stack: number | null
          status: string | null
          tournament_id: number | null
        }
        Insert: {
          id?: number
          player_id?: string | null
          seat_no?: number | null
          stack?: number | null
          status?: string | null
          tournament_id?: number | null
        }
        Update: {
          id?: number
          player_id?: string | null
          seat_no?: number | null
          stack?: number | null
          status?: string | null
          tournament_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tournament_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "vw_player_balance"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tournament_players_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_registrations: {
        Row: {
          addons: number | null
          chips: number
          final_position: number | null
          id: string
          is_active: boolean | null
          payout: number | null
          player_id: string
          rebuys: number | null
          registration_time: string | null
          tournament_id: string
        }
        Insert: {
          addons?: number | null
          chips: number
          final_position?: number | null
          id?: string
          is_active?: boolean | null
          payout?: number | null
          player_id: string
          rebuys?: number | null
          registration_time?: string | null
          tournament_id: string
        }
        Update: {
          addons?: number | null
          chips?: number
          final_position?: number | null
          id?: string
          is_active?: boolean | null
          payout?: number | null
          player_id?: string
          rebuys?: number | null
          registration_time?: string | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_registrations_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments_new"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_rounds: {
        Row: {
          ante: number | null
          big_blind: number
          duration_minutes: number
          end_time: string | null
          id: string
          round_number: number
          small_blind: number
          start_time: string | null
          tournament_id: string
        }
        Insert: {
          ante?: number | null
          big_blind: number
          duration_minutes: number
          end_time?: string | null
          id?: string
          round_number: number
          small_blind: number
          start_time?: string | null
          tournament_id: string
        }
        Update: {
          ante?: number | null
          big_blind?: number
          duration_minutes?: number
          end_time?: string | null
          id?: string
          round_number?: number
          small_blind?: number
          start_time?: string | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_rounds_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments_new"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_seats: {
        Row: {
          id: string
          is_active: boolean | null
          player_id: string
          seat_number: number
          table_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          player_id: string
          seat_number: number
          table_id: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          player_id?: string
          seat_number?: number
          table_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_seats_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tournament_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_tables: {
        Row: {
          created_at: string | null
          id: string
          is_final_table: boolean | null
          max_seats: number
          status: string | null
          table_number: number
          tournament_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_final_table?: boolean | null
          max_seats?: number
          status?: string | null
          table_number: number
          tournament_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_final_table?: boolean | null
          max_seats?: number
          status?: string | null
          table_number?: number
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_tables_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments_new"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          blind_json: Json
          buy_in: number
          created_at: string | null
          current_level: number
          entrants: number
          fee_percent: number
          id: number
          name: string
          phase: Database["public"]["Enums"]["tournament_phase"]
          prize_pool: number
          starting_stack: number
          uuid: string
          variant: Database["public"]["Enums"]["table_variant"]
        }
        Insert: {
          blind_json: Json
          buy_in: number
          created_at?: string | null
          current_level?: number
          entrants?: number
          fee_percent: number
          id?: number
          name: string
          phase?: Database["public"]["Enums"]["tournament_phase"]
          prize_pool?: number
          starting_stack: number
          uuid?: string
          variant?: Database["public"]["Enums"]["table_variant"]
        }
        Update: {
          blind_json?: Json
          buy_in?: number
          created_at?: string | null
          current_level?: number
          entrants?: number
          fee_percent?: number
          id?: number
          name?: string
          phase?: Database["public"]["Enums"]["tournament_phase"]
          prize_pool?: number
          starting_stack?: number
          uuid?: string
          variant?: Database["public"]["Enums"]["table_variant"]
        }
        Relationships: []
      }
      tournaments_new: {
        Row: {
          access_code: string | null
          addon_allowed: boolean | null
          banner_url: string | null
          blind_structure: Json
          buy_in: number | null
          created_at: string | null
          created_by: string | null
          current_level: number | null
          description: string | null
          fee_percent: number
          id: string
          is_featured: boolean | null
          is_private: boolean | null
          late_registration_minutes: number | null
          max_players: number
          min_players: number
          name: string
          payout_structure: Json
          prize_pool: number | null
          rebuy_allowed: boolean | null
          registration_close_time: string | null
          registration_open_time: string
          rules: string | null
          start_time: string
          starting_chips: number
          status: Database["public"]["Enums"]["tournament_status"]
          tournament_type: Database["public"]["Enums"]["tournament_type"]
          updated_at: string | null
        }
        Insert: {
          access_code?: string | null
          addon_allowed?: boolean | null
          banner_url?: string | null
          blind_structure?: Json
          buy_in?: number | null
          created_at?: string | null
          created_by?: string | null
          current_level?: number | null
          description?: string | null
          fee_percent?: number
          id?: string
          is_featured?: boolean | null
          is_private?: boolean | null
          late_registration_minutes?: number | null
          max_players?: number
          min_players?: number
          name: string
          payout_structure?: Json
          prize_pool?: number | null
          rebuy_allowed?: boolean | null
          registration_close_time?: string | null
          registration_open_time: string
          rules?: string | null
          start_time: string
          starting_chips?: number
          status?: Database["public"]["Enums"]["tournament_status"]
          tournament_type?: Database["public"]["Enums"]["tournament_type"]
          updated_at?: string | null
        }
        Update: {
          access_code?: string | null
          addon_allowed?: boolean | null
          banner_url?: string | null
          blind_structure?: Json
          buy_in?: number | null
          created_at?: string | null
          created_by?: string | null
          current_level?: number | null
          description?: string | null
          fee_percent?: number
          id?: string
          is_featured?: boolean | null
          is_private?: boolean | null
          late_registration_minutes?: number | null
          max_players?: number
          min_players?: number
          name?: string
          payout_structure?: Json
          prize_pool?: number | null
          rebuy_allowed?: boolean | null
          registration_close_time?: string | null
          registration_open_time?: string
          rules?: string | null
          start_time?: string
          starting_chips?: number
          status?: Database["public"]["Enums"]["tournament_status"]
          tournament_type?: Database["public"]["Enums"]["tournament_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          blockchain_tx_hash: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          blockchain_tx_hash?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          status: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          blockchain_tx_hash?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          created_at: string | null
          current_game_type: string | null
          current_table_id: string | null
          id: string
          is_online: boolean | null
          last_seen: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_game_type?: string | null
          current_table_id?: string | null
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_game_type?: string | null
          current_table_id?: string | null
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_presence_current_table_id_fkey"
            columns: ["current_table_id"]
            isOneToOne: false
            referencedRelation: "lobby_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_accounts: {
        Row: {
          balance: number
          created_at: string | null
          id: number
          player_id: string | null
        }
        Insert: {
          balance?: number
          created_at?: string | null
          id?: number
          player_id?: string | null
        }
        Update: {
          balance?: number
          created_at?: string | null
          id?: number
          player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_accounts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "wallet_accounts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "vw_player_balance"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      vw_player_balance: {
        Row: {
          alias: string | null
          balance: number | null
          total_in: number | null
          total_out: number | null
          user_id: string | null
        }
        Relationships: []
      }
      vw_rake_daily: {
        Row: {
          day: string | null
          total_rake: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_next_hands_partition: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      filter_chat_message: {
        Args: { content: string }
        Returns: string
      }
      generate_share_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_friends_with_status: {
        Args: { p_user_id: string }
        Returns: {
          friend_id: string
          friend_alias: string
          friend_avatar_url: string
          is_online: boolean
          current_table_id: string
          current_game_type: string
          last_seen: string
          friendship_status: string
          became_friends_at: string
        }[]
      }
      get_player_leaderboard: {
        Args: { range_interval: unknown; result_limit?: number }
        Returns: {
          alias: string
          roi: number
          itm: number
          score: number
        }[]
      }
      get_player_statistics: {
        Args: { player_uuid: string }
        Returns: {
          total_games_played: number
          total_hands: number
          win_rate: number
          biggest_pot: number
          total_winnings: number
          average_position: number
          best_hand: string
          favorite_game: string
          tournament_wins: number
          rank_position: number
          rank: number
          level: number
          xp: number
        }[]
      }
      perform_game_action: {
        Args: {
          p_game_id: string
          p_player_id: string
          p_action: string
          p_amount?: number
        }
        Returns: string
      }
      update_account_balances: {
        Args: {
          p_credit_account: number
          p_debit_account: number
          p_amount: number
        }
        Returns: undefined
      }
      update_typing_indicator: {
        Args: {
          p_channel_id: string
          p_player_id: string
          p_is_typing: boolean
        }
        Returns: undefined
      }
      update_user_presence: {
        Args: {
          p_is_online?: boolean
          p_table_id?: string
          p_game_type?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      player_role: "PLAYER" | "ADMIN" | "SUPPORT" | "SYSTEM"
      table_state: "WAITING" | "ACTIVE" | "PAUSED" | "CLOSED"
      table_variant: "HOLD_EM" | "OMAHA"
      tournament_phase:
        | "REGISTERING"
        | "RUNNING"
        | "BREAK"
        | "FINAL_TABLE"
        | "COMPLETED"
        | "CANCELLED"
      tournament_status:
        | "SCHEDULED"
        | "REGISTERING"
        | "RUNNING"
        | "BREAK"
        | "FINAL_TABLE"
        | "COMPLETED"
        | "CANCELLED"
      tournament_type:
        | "SIT_N_GO"
        | "FREEROLL"
        | "MULTI_TABLE"
        | "SPECIAL_EVENT"
        | "SATELLITE"
      tx_type:
        | "DEPOSIT"
        | "WITHDRAW"
        | "BET_HOLD"
        | "BET_RELEASE"
        | "FEE"
        | "RAKE"
        | "PAYOUT"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      player_role: ["PLAYER", "ADMIN", "SUPPORT", "SYSTEM"],
      table_state: ["WAITING", "ACTIVE", "PAUSED", "CLOSED"],
      table_variant: ["HOLD_EM", "OMAHA"],
      tournament_phase: [
        "REGISTERING",
        "RUNNING",
        "BREAK",
        "FINAL_TABLE",
        "COMPLETED",
        "CANCELLED",
      ],
      tournament_status: [
        "SCHEDULED",
        "REGISTERING",
        "RUNNING",
        "BREAK",
        "FINAL_TABLE",
        "COMPLETED",
        "CANCELLED",
      ],
      tournament_type: [
        "SIT_N_GO",
        "FREEROLL",
        "MULTI_TABLE",
        "SPECIAL_EVENT",
        "SATELLITE",
      ],
      tx_type: [
        "DEPOSIT",
        "WITHDRAW",
        "BET_HOLD",
        "BET_RELEASE",
        "FEE",
        "RAKE",
        "PAYOUT",
      ],
    },
  },
} as const
