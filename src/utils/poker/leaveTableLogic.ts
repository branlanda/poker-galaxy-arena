
import { PlayerState, GameState } from '@/types/poker';
import { supabase } from '@/lib/supabase';

export interface LeaveTableResult {
  success: boolean;
  finalStack: number;
  penaltyApplied: boolean;
  message: string;
}

/**
 * Advanced poker logic for handling player departures
 */
export class LeaveTableLogic {
  
  /**
   * Determines if a player can leave immediately or needs to wait
   */
  static canLeaveImmediately(
    playerState: PlayerState,
    gameState: GameState
  ): boolean {
    // Can always leave if not in a hand
    if (gameState.phase === 'WAITING') return true;
    
    // Can't leave if it's their turn
    if (gameState.activeSeat === playerState.seatNumber) return false;
    
    // Can leave if they've folded
    if (playerState.status === 'FOLDED') return true;
    
    // Can leave if all-in (no more decisions to make)
    if (playerState.status === 'ALL_IN') return true;
    
    // Otherwise, must wait for hand to complete
    return false;
  }

  /**
   * Calculates reputation penalty for leaving at inappropriate times
   */
  static calculateReputationPenalty(
    playerState: PlayerState,
    gameState: GameState
  ): number {
    if (this.canLeaveImmediately(playerState, gameState)) {
      return 0; // No penalty for clean exits
    }

    let penalty = 0;

    // Penalty for leaving during turn
    if (gameState.activeSeat === playerState.seatNumber) {
      penalty += 5;
    }

    // Penalty for leaving mid-hand with active bet
    if (playerState.currentBet > 0 && playerState.status === 'PLAYING') {
      penalty += 3;
    }

    // Reduced penalty in early phases
    if (gameState.phase === 'PREFLOP') {
      penalty = Math.floor(penalty * 0.7);
    }

    return Math.min(penalty, 10); // Cap at 10 points
  }

  /**
   * Processes the actual leave table action
   */
  static async processLeaveTable(
    playerId: string,
    tableId: string,
    playerState: PlayerState,
    gameState: GameState
  ): Promise<LeaveTableResult> {
    try {
      const canLeave = this.canLeaveImmediately(playerState, gameState);
      const reputationPenalty = this.calculateReputationPenalty(playerState, gameState);
      
      // If player can't leave immediately, force fold
      if (!canLeave && gameState.activeSeat === playerState.seatNumber) {
        await this.performForcedFold(playerId, gameState.id);
      }

      // Convert remaining stack to balance
      const finalStack = playerState.stack;
      if (finalStack > 0) {
        await this.convertStackToBalance(playerId, finalStack);
      }

      // Apply reputation penalty if needed
      if (reputationPenalty > 0) {
        await this.applyReputationPenalty(playerId, reputationPenalty);
      }

      // Remove player from table
      await this.removePlayerFromTable(playerId, tableId);

      // Update game state if needed
      await this.updateGameStateAfterLeave(gameState, playerState);

      // Send notifications to other players
      await this.notifyOtherPlayers(tableId, playerId, playerState.playerName || 'Player');

      return {
        success: true,
        finalStack,
        penaltyApplied: reputationPenalty > 0,
        message: this.getLeaveMessage(canLeave, reputationPenalty, finalStack)
      };

    } catch (error: any) {
      console.error('Error processing leave table:', error);
      return {
        success: false,
        finalStack: 0,
        penaltyApplied: false,
        message: `Error al salir de la mesa: ${error.message}`
      };
    }
  }

  /**
   * Performs a forced fold for a leaving player
   */
  private static async performForcedFold(playerId: string, gameId: string): Promise<void> {
    await supabase.rpc('perform_game_action', {
      p_game_id: gameId,
      p_player_id: playerId,
      p_action: 'FOLD',
      p_amount: 0
    });
  }

  /**
   * Converts player's stack back to their balance
   */
  private static async convertStackToBalance(playerId: string, amount: number): Promise<void> {
    // This would typically involve the wallet system
    // For now, we'll update a hypothetical balance table
    const { error } = await supabase
      .from('player_balances')
      .upsert({
        player_id: playerId,
        balance: amount
      }, {
        onConflict: 'player_id',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Error converting stack to balance:', error);
    }
  }

  /**
   * Applies reputation penalty using direct SQL update
   */
  private static async applyReputationPenalty(playerId: string, penalty: number): Promise<void> {
    // Get current score first
    const { data: currentRep } = await supabase
      .from('player_reputation')
      .select('score')
      .eq('player_id', playerId)
      .single();

    const currentScore = currentRep?.score || 50;
    const newScore = Math.max(0, currentScore - penalty);

    await supabase
      .from('player_reputation')
      .update({
        score: newScore,
        updated_at: new Date().toISOString()
      })
      .eq('player_id', playerId);
  }

  /**
   * Removes player from the table
   */
  private static async removePlayerFromTable(playerId: string, tableId: string): Promise<void> {
    // Update player status to LEFT
    await supabase
      .from('players_at_table')
      .update({
        status: 'LEFT',
        left_at: new Date().toISOString()
      })
      .eq('player_id', playerId)
      .eq('table_id', tableId);

    // Remove from active game state
    await supabase
      .from('table_player_states')
      .delete()
      .eq('player_id', playerId);
  }

  /**
   * Updates game state after a player leaves
   */
  private static async updateGameStateAfterLeave(
    gameState: GameState,
    leavingPlayer: PlayerState
  ): Promise<void> {
    // If the leaving player was the dealer, move dealer button
    if (gameState.dealerSeat === leavingPlayer.seatNumber) {
      // Logic to move dealer button would go here
      // This depends on remaining players
    }

    // If only one player remains, end the game
    const { data: remainingPlayers } = await supabase
      .from('table_player_states')
      .select('*')
      .eq('game_id', gameState.id);

    if (remainingPlayers && remainingPlayers.length <= 1) {
      await supabase
        .from('table_games')
        .update({
          phase: 'WAITING',
          status: 'PAUSED'
        })
        .eq('id', gameState.id);
    }
  }

  /**
   * Notifies other players about the departure
   */
  private static async notifyOtherPlayers(
    tableId: string,
    leavingPlayerId: string,
    playerName: string
  ): Promise<void> {
    await supabase.channel(`game:${tableId}`).send({
      type: 'broadcast',
      event: 'player_left',
      payload: {
        playerId: leavingPlayerId,
        playerName,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Generates appropriate leave message
   */
  private static getLeaveMessage(
    canLeave: boolean,
    penalty: number,
    finalStack: number
  ): string {
    let message = `Has abandonado la mesa. `;
    
    if (finalStack > 0) {
      message += `Tu stack de $${finalStack.toLocaleString()} ha sido agregado a tu balance. `;
    }
    
    if (penalty > 0) {
      message += `Se aplicó una penalización de ${penalty} puntos de reputación por salir durante una mano activa.`;
    } else {
      message += `No se aplicaron penalizaciones.`;
    }
    
    return message;
  }
}
