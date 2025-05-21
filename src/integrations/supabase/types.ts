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
      get_player_leaderboard: {
        Args: { range_interval: unknown; result_limit?: number }
        Returns: {
          alias: string
          roi: number
          itm: number
          score: number
        }[]
      }
      update_account_balances: {
        Args: {
          p_credit_account: number
          p_debit_account: number
          p_amount: number
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
