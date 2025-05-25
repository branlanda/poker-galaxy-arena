
import { GameState, PlayerState, PlayerAction } from '@/types/poker';

export class ActionProcessor {
  processAction(
    game: GameState, 
    players: PlayerState[], 
    playerId: string, 
    action: PlayerAction, 
    amount?: number
  ): boolean {
    const player = players.find(p => p.playerId === playerId);
    if (!player || player.seatNumber !== game.activeSeat) {
      return false;
    }

    const callAmount = Math.max(0, game.currentBet - player.currentBet);

    switch (action) {
      case 'FOLD':
        player.status = 'FOLDED';
        break;

      case 'CHECK':
        if (callAmount > 0) return false; // Can't check if there's a bet
        break;

      case 'CALL':
        if (callAmount === 0) return false;
        const actualCall = Math.min(callAmount, player.stack);
        player.currentBet += actualCall;
        player.stack -= actualCall;
        game.pot += actualCall;
        if (player.stack === 0) player.status = 'ALL_IN';
        break;

      case 'BET':
      case 'RAISE':
        if (!amount || amount <= 0) return false;
        const totalBet = player.currentBet + amount;
        if (totalBet <= game.currentBet) return false;
        if (amount > player.stack) return false;
        
        player.currentBet += amount;
        player.stack -= amount;
        game.pot += amount;
        game.currentBet = player.currentBet;
        if (player.stack === 0) player.status = 'ALL_IN';
        break;

      case 'ALL_IN':
        const allInAmount = player.stack;
        player.currentBet += allInAmount;
        player.stack = 0;
        player.status = 'ALL_IN';
        game.pot += allInAmount;
        if (player.currentBet > game.currentBet) {
          game.currentBet = player.currentBet;
        }
        break;

      default:
        return false;
    }

    return true;
  }

  isBettingRoundComplete(players: PlayerState[]): boolean {
    const activePlayers = players.filter(p => 
      p.status === 'PLAYING' || p.status === 'ALL_IN'
    );
    
    if (activePlayers.length <= 1) return true;

    const playingPlayers = activePlayers.filter(p => p.status === 'PLAYING');
    if (playingPlayers.length === 0) return true;

    // Check if all playing players have acted and matched the current bet
    return playingPlayers.every(p => 
      p.currentBet === playingPlayers[0].currentBet || p.stack === 0
    );
  }
}
