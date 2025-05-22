
import { GameState } from '@/types/game';
import { CommunityCards } from '@/components/poker/CommunityCards';
import { PlayerSeat } from '@/components/poker/PlayerSeat';
import { PokerChip } from '@/components/poker/PokerChip';
import { PlayerActions } from '@/components/poker/PlayerActions';

interface PokerTableProps {
  gameState: GameState | null;
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  playerSeatIndex: number;
  userId: string | undefined;
  onSitDown: (seatNumber: number) => void;
}

export function PokerTable({ 
  gameState, 
  isPlayerSeated, 
  isPlayerTurn, 
  playerSeatIndex,
  userId,
  onSitDown 
}: PokerTableProps) {
  // Get current player's seat data if seated
  const playerSeat = isPlayerSeated && gameState?.seats[playerSeatIndex] 
    ? gameState.seats[playerSeatIndex] 
    : null;

  return (
    <div className="relative">
      {/* Elliptical table background */}
      <div className="aspect-[4/3] w-full bg-green-900/80 rounded-[50%] border-8 border-amber-950 shadow-xl overflow-hidden relative mb-8">
        {/* Table felt pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_#4444_1px,_transparent_1px)_repeat] bg-[size:20px_20px]"></div>
        
        {/* Center pot area */}
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
        
        {/* Player seats - using a 9-seat layout */}
        <div className="absolute inset-0">
          {/* Top row - seats 0, 1, 2 */}
          <div className="absolute top-[5%] left-0 right-0 flex justify-between px-[15%]">
            <PlayerSeat 
              position={0}
              state={gameState?.seats[0] || null}
              isCurrentPlayer={playerSeatIndex === 0}
              isActive={gameState?.activePlayerId === gameState?.seats[0]?.playerId}
              onSitDown={!isPlayerSeated ? onSitDown : undefined}
            />
            <PlayerSeat 
              position={1}
              state={gameState?.seats[1] || null}
              isCurrentPlayer={playerSeatIndex === 1}
              isActive={gameState?.activePlayerId === gameState?.seats[1]?.playerId}
              onSitDown={!isPlayerSeated ? onSitDown : undefined}
            />
            <PlayerSeat 
              position={2}
              state={gameState?.seats[2] || null}
              isCurrentPlayer={playerSeatIndex === 2}
              isActive={gameState?.activePlayerId === gameState?.seats[2]?.playerId}
              onSitDown={!isPlayerSeated ? onSitDown : undefined}
            />
          </div>
          
          {/* Left side - seats 3, 4 */}
          <div className="absolute left-[2%] top-[40%]">
            <PlayerSeat 
              position={3}
              state={gameState?.seats[3] || null}
              isCurrentPlayer={playerSeatIndex === 3}
              isActive={gameState?.activePlayerId === gameState?.seats[3]?.playerId}
              onSitDown={!isPlayerSeated ? onSitDown : undefined}
            />
          </div>
          
          {/* Right side - seats 4, 5 */}
          <div className="absolute right-[2%] top-[40%]">
            <PlayerSeat 
              position={4}
              state={gameState?.seats[4] || null}
              isCurrentPlayer={playerSeatIndex === 4}
              isActive={gameState?.activePlayerId === gameState?.seats[4]?.playerId}
              onSitDown={!isPlayerSeated ? onSitDown : undefined}
            />
          </div>
          
          {/* Bottom row - seats 5, 6, 7, 8 */}
          <div className="absolute bottom-[5%] left-0 right-0 flex justify-between px-[10%]">
            <PlayerSeat 
              position={5}
              state={gameState?.seats[5] || null}
              isCurrentPlayer={playerSeatIndex === 5}
              isActive={gameState?.activePlayerId === gameState?.seats[5]?.playerId}
              onSitDown={!isPlayerSeated ? onSitDown : undefined}
            />
            <PlayerSeat 
              position={6}
              state={gameState?.seats[6] || null}
              isCurrentPlayer={playerSeatIndex === 6}
              isActive={gameState?.activePlayerId === gameState?.seats[6]?.playerId}
              onSitDown={!isPlayerSeated ? onSitDown : undefined}
            />
            <PlayerSeat 
              position={7}
              state={gameState?.seats[7] || null}
              isCurrentPlayer={playerSeatIndex === 7}
              isActive={gameState?.activePlayerId === gameState?.seats[7]?.playerId}
              onSitDown={!isPlayerSeated ? onSitDown : undefined}
            />
            <PlayerSeat 
              position={8}
              state={gameState?.seats[8] || null}
              isCurrentPlayer={playerSeatIndex === 8}
              isActive={gameState?.activePlayerId === gameState?.seats[8]?.playerId}
              onSitDown={!isPlayerSeated ? onSitDown : undefined}
            />
          </div>
        </div>
      </div>
      
      {/* Player actions area - only shown when it's the player's turn */}
      {isPlayerTurn && isPlayerSeated && playerSeat && userId && (
        <div className="mt-4 flex justify-center">
          <PlayerActions
            playerId={userId}
            currentBet={gameState?.currentBet || 0}
            playerBet={playerSeat.bet}
            stack={playerSeat.stack}
            isActive={true}
          />
        </div>
      )}
    </div>
  );
}
