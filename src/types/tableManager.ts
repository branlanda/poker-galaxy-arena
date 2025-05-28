
export interface OpenTable {
  id: string;
  name: string;
  type: 'CASH_GAME' | 'TOURNAMENT' | 'SIT_AND_GO';
  status: 'WAITING' | 'RUNNING' | 'PAUSED' | 'FINISHED';
  currentPlayers: number;
  maxPlayers: number;
  pot?: number;
  gamePhase?: string;
  lastActivity: Date;
  joinedAt: Date;
}

export interface TableNotifications {
  isPlayerTurn: boolean;
  unreadMessages: number;
  hasAlert: boolean;
  timeRemaining?: number;
}

export interface TableManagerState {
  openTables: OpenTable[];
  activeTableId: string | null;
  notifications: Record<string, TableNotifications>;
}
