
import { GameState, PlayerState } from '@/types/poker';
import { evaluateHand, compareHands } from '../handEvaluator';
import { GameResult, SidePot } from './types';

export class ShowdownProcessor {
  processShowdown(game: GameState, players: PlayerState[]): GameResult {
    const activePlayers = players.filter(p => 
      p.status === 'PLAYING' || p.status === 'ALL_IN'
    );

    if (activePlayers.length === 0) {
      return { winners: [], sidePots: [] };
    }

    // If only one player remains, they win everything
    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      winner.stack += game.pot;
      return {
        winners: [{
          playerId: winner.playerId,
          winAmount: game.pot,
          handRank: { rank: 0, name: 'Winner by Default', cards: [], kickers: [] }
        }],
        sidePots: [{ amount: game.pot, eligiblePlayers: [winner.playerId] }]
      };
    }

    // Create side pots based on all-in amounts
    const sidePots = this.calculateSidePots(players);
    const winners: GameResult['winners'] = [];

    // Evaluate hands for each side pot
    sidePots.forEach((sidePot, index) => {
      const eligiblePlayers = activePlayers.filter(p => 
        sidePot.eligiblePlayers.includes(p.playerId) && p.holeCards
      );

      if (eligiblePlayers.length === 0) return;

      // Evaluate hands
      const playerHands = eligiblePlayers.map(player => ({
        player,
        handRank: evaluateHand(player.holeCards!, game.communityCards)
      }));

      // Find the best hand(s)
      let bestHand = playerHands[0].handRank;
      playerHands.forEach(ph => {
        if (compareHands(ph.handRank, bestHand) > 0) {
          bestHand = ph.handRank;
        }
      });

      // Find all players with the best hand
      const potWinners = playerHands.filter(ph => 
        compareHands(ph.handRank, bestHand) === 0
      );

      // Distribute pot among winners
      const winAmount = Math.floor(sidePot.amount / potWinners.length);
      potWinners.forEach(winner => {
        winner.player.stack += winAmount;
        winners.push({
          playerId: winner.player.playerId,
          winAmount,
          handRank: winner.handRank,
          sidePotIndex: index
        });
      });
    });

    // Reset pot
    game.pot = 0;

    return { winners, sidePots };
  }

  private calculateSidePots(players: PlayerState[]): SidePot[] {
    const activePlayers = players.filter(p => 
      p.status === 'PLAYING' || p.status === 'ALL_IN'
    );

    // Get all unique bet amounts
    const betAmounts = [...new Set(activePlayers.map(p => p.currentBet))]
      .sort((a, b) => a - b);

    const sidePots: SidePot[] = [];
    let previousAmount = 0;

    betAmounts.forEach(amount => {
      const potSize = (amount - previousAmount) * activePlayers.filter(p => 
        p.currentBet >= amount
      ).length;

      if (potSize > 0) {
        sidePots.push({
          amount: potSize,
          eligiblePlayers: activePlayers
            .filter(p => p.currentBet >= amount)
            .map(p => p.playerId)
        });
      }

      previousAmount = amount;
    });

    return sidePots;
  }
}
