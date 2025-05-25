
import { GameState, PlayerState, PlayerAction, Card, GamePhase } from '@/types/poker';

export interface SidePot {
  amount: number;
  eligiblePlayers: string[];
}

export interface GameResult {
  winners: Array<{
    playerId: string;
    winAmount: number;
    handRank: any; // We'll import HandRank from handEvaluator
    sidePotIndex?: number;
  }>;
  sidePots: SidePot[];
}

export interface BlindConfig {
  SMALL_BLIND: number;
  BIG_BLIND: number;
}
