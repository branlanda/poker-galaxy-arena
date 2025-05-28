
import React from 'react';
import { GameTitleBar } from './GameTitleBar';
import { GameTabs } from './GameTabs';
import { GameTable } from './game/GameTable';
import { GameControls } from './game/GameControls';
import { GameState, PlayerState } from '@/types/poker';
import { PlayerAtTable, LobbyTable } from '@/types/lobby';

interface GameRoomContentProps {
  tableId: string;
  tableData: LobbyTable;
  players: PlayerAtTable[];
  gameState: GameState | null;
  isPlayerSeated: boolean;
  isPlayerTurn: boolean;
  isJoining: boolean;
  userId?: string;
  onSitDown: (seatNumber: number) => void;
  onAction: (action: string, amount?: number) => void;
  onLeaveTable: () => void;
}

// Helper function to transform PlayerAtTable to PlayerState
const transformPlayerAtTableToPlayerState = (player: PlayerAtTable): PlayerState => {
  return {
    id: player.id,
    gameId: '', // This will be set by the game state
    playerId: player.player_id,
    playerName: player.player_name || `Player ${player.player_id.substring(0, 4)}`,
    seatNumber: player.seat_number || 0,
    stack: player.stack,
    holeCards: undefined,
    status: player.status as any,
    currentBet: 0,
    isDealer: false,
    isSmallBlind: false,
    isBigBlind: false,
    createdAt: player.joined_at
  };
};

export const GameRoomContent: React.FC<GameRoomContentProps> = ({
  tableId,
  tableData,
  players,
  gameState,
  isPlayerSeated,
  isPlayerTurn,
  isJoining,
  userId,
  onSitDown,
  onAction,
  onLeaveTable
}) => {
  // Transform players data to PlayerState format
  const transformedPlayers: PlayerState[] = players.map(transformPlayerAtTableToPlayerState);
  
  const playerState = isPlayerSeated ? 
    transformedPlayers.find(p => p.playerId === userId) : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Title Bar */}
      <GameTitleBar 
        table={tableData}
        currentPlayers={players.length}
        gamePhase={gameState?.phase}
        pot={gameState?.pot}
      />
      
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col">
        {/* Game Table - Takes most of the space */}
        <div className="flex-1 p-6">
          <div className="h-full flex flex-col">
            {/* Game Table */}
            <div className="flex-1 mb-4">
              {gameState ? (
                <GameTable
                  game={gameState}
                  players={transformedPlayers}
                  userId={userId}
                  playerHandVisible={true}
                  isJoining={isJoining}
                  onSitDown={onSitDown}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Cargando mesa de juego...</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Game Controls */}
            {isPlayerSeated && gameState && (
              <GameControls
                isPlayerSeated={isPlayerSeated}
                isPlayerTurn={isPlayerTurn}
                playerState={playerState}
                currentBet={gameState.currentBet}
                gamePhase={gameState.phase}
                lastAction={undefined}
                onAction={async (action, amount) => {
                  onAction(action, amount);
                }}
                onLeaveTable={onLeaveTable}
              />
            )}
          </div>
        </div>
        
        {/* Game Tabs - Fixed height at bottom */}
        <div className="h-80">
          <GameTabs
            tableId={tableId}
            players={players}
            gameState={gameState}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
};
