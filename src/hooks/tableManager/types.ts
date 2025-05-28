
export interface PlayerAtTableWithTable {
  table_id: string;
  joined_at: string;
  lobby_tables: {
    id: string;
    name: string;
    table_type: string;
    status: string;
    current_players: number;
    max_players: number;
  } | null;
}
