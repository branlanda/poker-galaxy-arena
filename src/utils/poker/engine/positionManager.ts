
import { GameState, PlayerState } from '@/types/poker';

export class PositionManager {
  assignPositions(game: GameState, players: PlayerState[]): void {
    const activePlayers = players.filter(p => p.status === 'PLAYING');
    if (activePlayers.length < 2) return;

    // Move dealer button
    let dealerIndex = game.dealerSeat || 0;
    do {
      dealerIndex = (dealerIndex + 1) % 9;
    } while (!activePlayers.find(p => p.seatNumber === dealerIndex));

    game.dealerSeat = dealerIndex;

    // Assign dealer, small blind, big blind
    const dealer = activePlayers.find(p => p.seatNumber === dealerIndex);
    if (dealer) dealer.isDealer = true;

    if (activePlayers.length === 2) {
      // Heads up: dealer is small blind
      if (dealer) dealer.isSmallBlind = true;
      const opponent = activePlayers.find(p => p.seatNumber !== dealerIndex);
      if (opponent) opponent.isBigBlind = true;
    } else {
      // Find small blind (next player after dealer)
      let sbIndex = dealerIndex;
      do {
        sbIndex = (sbIndex + 1) % 9;
      } while (!activePlayers.find(p => p.seatNumber === sbIndex));
      
      const smallBlind = activePlayers.find(p => p.seatNumber === sbIndex);
      if (smallBlind) smallBlind.isSmallBlind = true;

      // Find big blind (next player after small blind)
      let bbIndex = sbIndex;
      do {
        bbIndex = (bbIndex + 1) % 9;
      } while (!activePlayers.find(p => p.seatNumber === bbIndex));
      
      const bigBlind = activePlayers.find(p => p.seatNumber === bbIndex);
      if (bigBlind) bigBlind.isBigBlind = true;
    }
  }

  setNextActivePlayer(game: GameState, players: PlayerState[]): void {
    const activePlayers = players.filter(p => 
      p.status === 'PLAYING' || p.status === 'ALL_IN'
    );
    
    if (activePlayers.length === 0) {
      game.activeSeat = undefined;
      return;
    }

    let currentSeat = game.activeSeat || 0;
    let attempts = 0;
    
    do {
      currentSeat = (currentSeat + 1) % 9;
      attempts++;
    } while (
      attempts < 9 && 
      !activePlayers.find(p => p.seatNumber === currentSeat && p.status === 'PLAYING')
    );

    const activePlayer = activePlayers.find(p => 
      p.seatNumber === currentSeat && p.status === 'PLAYING'
    );
    
    game.activeSeat = activePlayer ? activePlayer.seatNumber : undefined;
  }

  setFirstPlayerToAct(game: GameState, players: PlayerState[]): void {
    const activePlayers = players.filter(p => p.status === 'PLAYING');
    
    if (activePlayers.length === 0) {
      game.activeSeat = undefined;
      return;
    }

    // Start with small blind position
    let currentSeat = game.dealerSeat || 0;
    let attempts = 0;
    
    do {
      currentSeat = (currentSeat + 1) % 9;
      attempts++;
    } while (
      attempts < 9 && 
      !activePlayers.find(p => p.seatNumber === currentSeat)
    );

    game.activeSeat = currentSeat;
  }
}
