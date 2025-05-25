
import { PlayerState } from '@/types/poker';

export class BlindsManager {
  private readonly SMALL_BLIND = 5;
  private readonly BIG_BLIND = 10;

  getSmallBlind(): number {
    return this.SMALL_BLIND;
  }

  getBigBlind(): number {
    return this.BIG_BLIND;
  }

  postBlinds(players: PlayerState[], smallBlindPlayer: PlayerState | undefined, bigBlindPlayer: PlayerState | undefined): void {
    if (smallBlindPlayer) {
      const sbAmount = Math.min(this.SMALL_BLIND, smallBlindPlayer.stack);
      smallBlindPlayer.currentBet = sbAmount;
      smallBlindPlayer.stack -= sbAmount;
      if (smallBlindPlayer.stack === 0) smallBlindPlayer.status = 'ALL_IN';
    }

    if (bigBlindPlayer) {
      const bbAmount = Math.min(this.BIG_BLIND, bigBlindPlayer.stack);
      bigBlindPlayer.currentBet = bbAmount;
      bigBlindPlayer.stack -= bbAmount;
      if (bigBlindPlayer.stack === 0) bigBlindPlayer.status = 'ALL_IN';
    }
  }
}
