
import { GameState, SeatState } from '@/types/game';
import { CommunityCards } from '@/components/poker/CommunityCards';
import { PlayerSeat } from '@/components/poker/PlayerSeat';
import { PokerChip } from '@/components/poker/PokerChip';
import { BetActions } from '@/components/poker/BetActions';

interface PokerTableProps {
  gameState: GameState | null;
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  playerSeat: number;
  userId: string | undefined;
  onSitDown: (seatNumber: number) => void;
}

export function PokerTable({ 
  gameState, 
  isPlayerSeated, 
  isPlayerTurn, 
  playerSeat, 
  userId,
  onSitDown 
}: PokerTableProps) {
  return (
    <div className="relative">
      {/* Elliptical table background */}
      <div className="aspect-[4/3] w-full bg-green-900/80 rounded-[50%] border-8 border-amber-950 shadow-xl overflow-hidden relative mb-8">
        {/* Table felt pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
        
        {/* Center info area */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {gameState?.pot > 0 && (
            <div className="flex flex-col items-center mb-4">
              <div className="flex gap-1">
                <PokerChip value={gameState.pot} size="lg" />
              </div>
              <p className="text-white font-medium mt-2">Pot: {gameState.pot}</p>
            </div>
          )}
          
          {/* Community cards */}
          <div className="mb-4">
            <CommunityCards 
              cards={gameState?.communityCards || []}
              phase={gameState?.phase || 'WAITING'} 
            />
          </div>
          
          {/* Game phase display */}
          <div className="bg-black/30 px-4 py-1 rounded-full">
            <p className="text-sm font-medium text-gray-300">
              {gameState?.phase || 'Waiting for players'}
            </p>
          </div>
        </div>
        
        {/* Player positions - 9-player layout */}
        <div className="absolute inset-0">
          {/* Top row (seats 0-2) */}
          <div className="absolute top-[5%] left-0 right-0 flex justify-between px-[15%]">
            <div><PlayerSeat position={0} state={gameState?.seats[0] || null} isCurrentPlayer={playerSeat === 0} onSitDown={!isPlayerSeated ? onSitDown : undefined} /></div>
            <div><PlayerSeat position={1} state={gameState?.seats[1] || null} isCurrentPlayer={playerSeat === 1} onSitDown={!isPlayerSeated ? onSitDown : undefined} /></div>
            <div><PlayerSeat position={2} state={gameState?.seats[2] || null} isCurrentPlayer={playerSeat === 2} onSitDown={!isPlayerSeated ? onSitDown : undefined} /></div>
          </div>
          
          {/* Left middle (seat 3) */}
          <div className="absolute top-[40%] left-[2%]">
            <PlayerSeat position={3} state={gameState?.seats[3] || null} isCurrentPlayer={playerSeat === 3} onSitDown={!isPlayerSeated ? onSitDown : undefined} />
          </div>
          
          {/* Right middle (seat 4) */}
          <div className="absolute top-[40%] right-[2%]">
            <PlayerSeat position={4} state={gameState?.seats[4] || null} isCurrentPlayer={playerSeat === 4} onSitDown={!isPlayerSeated ? onSitDown : undefined} />
          </div>
          
          {/* Bottom row (seats 5-8) */}
          <div className="absolute bottom-[5%] left-0 right-0 flex justify-between px-[10%]">
            <div><PlayerSeat position={5} state={gameState?.seats[5] || null} isCurrentPlayer={playerSeat === 5} onSitDown={!isPlayerSeated ? onSitDown : undefined} /></div>
            <div><PlayerSeat position={6} state={gameState?.seats[6] || null} isCurrentPlayer={playerSeat === 6} onSitDown={!isPlayerSeated ? onSitDown : undefined} /></div>
            <div><PlayerSeat position={7} state={gameState?.seats[7] || null} isCurrentPlayer={playerSeat === 7} onSitDown={!isPlayerSeated ? onSitDown : undefined} /></div>
            <div><PlayerSeat position={8} state={gameState?.seats[8] || null} isCurrentPlayer={playerSeat === 8} onSitDown={!isPlayerSeated ? onSitDown : undefined} /></div>
          </div>
        </div>
      </div>
      
      {/* Action area (only shown when it's the player's turn) */}
      {isPlayerTurn && isPlayerSeated && gameState?.seats[playerSeat] && userId && (
        <div className="mt-4 flex justify-center">
          <BetActions
            playerId={userId}
            playerStack={gameState.seats[playerSeat]!.stack}
            currentBet={gameState.currentBet}
            playerBet={gameState.seats[playerSeat]!.bet}
          />
        </div>
      )}
    </div>
  );
}
