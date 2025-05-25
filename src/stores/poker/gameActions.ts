
import { supabase } from '@/lib/supabase';
import { PlayerAction } from '@/types/poker';
import { PokerGameEngine, GameResult } from '@/utils/poker/gameEngine';
import { toast } from '@/hooks/use-toast';

export class PokerGameActions {
  constructor(
    private getState: () => any,
    private setState: (updates: any) => void
  ) {}

  async startNewHand() {
    try {
      const { gameEngine, game } = this.getState();
      if (!gameEngine || !game) {
        throw new Error('Game engine not initialized');
      }
      
      // Start new hand using game engine
      gameEngine.startNewHand();
      
      // Update local state
      const updatedGame = gameEngine.getGameState();
      const updatedPlayers = gameEngine.getPlayers();
      
      this.setState({ 
        game: updatedGame,
        players: updatedPlayers
      });
      
      // Update database
      await supabase
        .from('table_games')
        .update({
          phase: updatedGame.phase,
          pot: updatedGame.pot,
          current_bet: updatedGame.currentBet,
          dealer_seat: updatedGame.dealerSeat,
          active_seat: updatedGame.activeSeat,
          community_cards: updatedGame.communityCards
        })
        .eq('id', game.id);
      
      // Update player states
      for (const player of updatedPlayers) {
        await supabase
          .from('table_player_states')
          .update({
            status: player.status,
            stack: player.stack,
            current_bet: player.currentBet,
            hole_cards: player.holeCards,
            is_dealer: player.isDealer,
            is_small_blind: player.isSmallBlind,
            is_big_blind: player.isBigBlind
          })
          .eq('game_id', game.id)
          .eq('player_id', player.playerId);
      }
      
      toast({
        title: 'New Hand Started',
        description: 'Cards have been dealt. Good luck!',
      });
      
    } catch (error: any) {
      console.error('Error starting new hand:', error);
      toast({
        title: 'Error Starting Hand',
        description: error.message || 'Failed to start new hand',
        variant: 'destructive',
      });
    }
  }

  async processGameAction(playerId: string, action: PlayerAction, amount?: number) {
    try {
      const { gameEngine, game } = this.getState();
      if (!gameEngine || !game) {
        throw new Error('Game engine not initialized');
      }
      
      // Process action using game engine
      const success = gameEngine.processAction(playerId, action, amount);
      if (!success) {
        throw new Error('Invalid action');
      }
      
      // Update local state
      const updatedGame = gameEngine.getGameState();
      const updatedPlayers = gameEngine.getPlayers();
      
      this.setState({ 
        game: updatedGame,
        players: updatedPlayers
      });
      
      // Record action in database
      await supabase
        .from('table_actions')
        .insert({
          game_id: game.id,
          player_id: playerId,
          action,
          amount: amount || 0
        });
      
      // Update game state in database
      await supabase
        .from('table_games')
        .update({
          phase: updatedGame.phase,
          pot: updatedGame.pot,
          current_bet: updatedGame.currentBet,
          active_seat: updatedGame.activeSeat,
          community_cards: updatedGame.communityCards
        })
        .eq('id', game.id);
      
      // Update player states
      for (const player of updatedPlayers) {
        await supabase
          .from('table_player_states')
          .update({
            status: player.status,
            stack: player.stack,
            current_bet: player.currentBet
          })
          .eq('game_id', game.id)
          .eq('player_id', player.playerId);
      }
      
      // Check for showdown
      if (updatedGame.phase === 'SHOWDOWN') {
        await this.handleShowdown();
      }
      
    } catch (error: any) {
      console.error('Error processing game action:', error);
      throw error;
    }
  }

  async handleShowdown() {
    try {
      const { gameEngine, game } = this.getState();
      if (!gameEngine || !game) return;
      
      const result: GameResult = gameEngine.processShowdown();
      
      // Update player stacks
      const updatedPlayers = gameEngine.getPlayers();
      this.setState({ players: updatedPlayers });
      
      // Update database with results
      for (const player of updatedPlayers) {
        await supabase
          .from('table_player_states')
          .update({
            stack: player.stack
          })
          .eq('game_id', game.id)
          .eq('player_id', player.playerId);
      }
      
      // Show results
      result.winners.forEach(winner => {
        toast({
          title: 'Hand Complete',
          description: `${winner.playerId} wins ${winner.winAmount} with ${winner.handRank.name}`,
          duration: 5000,
        });
      });
      
      // Auto-start next hand after delay
      setTimeout(() => {
        this.startNewHand();
      }, 5000);
      
    } catch (error: any) {
      console.error('Error handling showdown:', error);
    }
  }

  async sitDown(gameId: string, playerId: string, seatNumber: number, buyIn: number) {
    try {
      // Check if the seat is already taken
      const { data: existingSeat, error: seatCheckError } = await supabase
        .from('table_player_states')
        .select('*')
        .eq('game_id', gameId)
        .eq('seat_number', seatNumber)
        .single();
        
      if (existingSeat) {
        throw new Error('This seat is already taken');
      }
      
      // Add player to the table
      const { error: sitDownError } = await supabase
        .from('table_player_states')
        .insert({
          game_id: gameId,
          player_id: playerId,
          seat_number: seatNumber,
          stack: buyIn,
          status: 'SITTING'
        });
        
      if (sitDownError) throw sitDownError;
      
    } catch (error: any) {
      console.error('Error sitting down:', error);
      toast({
        title: 'Failed to Take Seat',
        description: error.message || 'Could not sit at the table',
        variant: 'destructive',
      });
    }
  }

  async leaveTable(playerId: string) {
    try {
      const { game, players } = this.getState();
      if (!game) {
        throw new Error('No active game');
      }
      
      const playerState = players.find((p: any) => p.playerId === playerId);
      if (!playerState) {
        throw new Error('You are not at this table');
      }
      
      // Remove player from the table
      const { error } = await supabase
        .from('table_player_states')
        .delete()
        .eq('id', playerState.id);
        
      if (error) throw error;
      
    } catch (error: any) {
      console.error('Error leaving table:', error);
      toast({
        title: 'Failed to Leave Table',
        description: error.message || 'Could not leave the table',
        variant: 'destructive',
      });
    }
  }
}
