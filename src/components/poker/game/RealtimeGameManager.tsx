
import React, { useState, useCallback } from 'react';
import { useRealtimeGameEngine } from '@/hooks/useRealtimeGameEngine';
import { GameTable } from './GameTable';
import { GameControls } from './GameControls';
import { ConnectionStatus } from './ConnectionStatus';
import { GameState, PlayerState, PlayerAction } from '@/types/poker';
import { toast } from '@/hooks/use-toast';

interface RealtimeGameManagerProps {
  tableId: string;
  userId?: string;
  initialGameState?: GameState;
  initialPlayers?: PlayerState[];
}

export const RealtimeGameManager: React.FC<RealtimeGameManagerProps> = ({
  tableId,
  userId,
  initialGameState,
  initialPlayers = []
}) => {
  const [gameState, setGameState] = useState<GameState | null>(initialGameState || null);
  const [players, setPlayers] = useState<PlayerState[]>(initialPlayers);
  const [isConnected, setIsConnected] = useState(false);
  const [playerHandVisible, setPlayerHandVisible] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  // Handle game updates from realtime
  const handleGameUpdate = useCallback((update: any) => {
    console.log('Processing game update:', update);
    
    if (update.gameState) {
      // Transform the database game state to our frontend format
      const transformedGameState: GameState = {
        id: tableId,
        tableId: tableId,
        phase: update.gameState.game_phase,
        pot: update.gameState.pot_amount,
        currentBet: update.gameState.current_bet,
        communityCards: update.gameState.community_cards || [],
        dealerSeat: update.gameState.dealer_position,
        activeSeat: update.gameState.current_player_position,
        lastActionTime: update.gameState.updated_at,
        createdAt: update.gameState.created_at
      };
      
      setGameState(transformedGameState);
    }

    if (update.recentActions && update.recentActions.length > 0) {
      const latestAction = update.recentActions[0];
      toast({
        title: 'Player Action',
        description: `Player performed ${latestAction.action_type}${latestAction.amount ? ` for ${latestAction.amount}` : ''}`,
        duration: 3000,
      });
    }

    // Handle update type specific logic
    switch (update.updateType) {
      case 'START_HAND':
        toast({
          title: 'New Hand Started',
          description: 'A new poker hand has been dealt',
          duration: 5000,
        });
        break;
      case 'SHOWDOWN':
        toast({
          title: 'Showdown!',
          description: 'Revealing cards to determine winner',
          duration: 5000,
        });
        break;
    }
  }, [tableId]);

  // Handle player actions
  const handlePlayerAction = useCallback((actionData: any) => {
    console.log('Player action received:', actionData);
    // This can be used for additional UI feedback
  }, []);

  // Setup realtime connection
  const { sendAction, startNewHand, isConnected: engineConnected } = useRealtimeGameEngine({
    tableId,
    onGameUpdate: handleGameUpdate,
    onPlayerAction: handlePlayerAction,
    onConnectionChange: setIsConnected
  });

  // Handle player actions
  const handleAction = useCallback(async (action: PlayerAction, amount?: number) => {
    try {
      await sendAction(action, amount);
    } catch (error) {
      console.error('Failed to send action:', error);
    }
  }, [sendAction]);

  // Handle sit down
  const handleSitDown = useCallback(async (seatNumber: number) => {
    setIsJoining(true);
    try {
      // This would typically involve a separate API call to join the table
      // For now, we'll simulate it
      toast({
        title: 'Joining Table',
        description: `Taking seat ${seatNumber + 1}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to sit down:', error);
      toast({
        title: 'Failed to Join',
        description: 'Could not take the seat',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  }, []);

  // Check if current user is seated
  const isPlayerSeated = userId && players.some(p => p.playerId === userId);
  
  // Check if it's player's turn
  const isPlayerTurn = userId && gameState?.activeSeat !== undefined && 
    players.some(p => p.playerId === userId && p.seatNumber === gameState.activeSeat);

  // Get player state
  const playerState = userId ? players.find(p => p.playerId === userId) : undefined;

  return (
    <div className="relative">
      {/* Connection Status */}
      <ConnectionStatus 
        isConnected={isConnected && engineConnected} 
        tableId={tableId}
      />

      {/* Game Table */}
      {gameState && (
        <GameTable
          game={gameState}
          players={players}
          userId={userId}
          playerHandVisible={playerHandVisible}
          isJoining={isJoining}
          onSitDown={handleSitDown}
        />
      )}

      {/* Game Controls */}
      <GameControls
        isPlayerSeated={!!isPlayerSeated}
        isPlayerTurn={!!isPlayerTurn}
        playerState={playerState}
        currentBet={gameState?.currentBet || 0}
        gamePhase={gameState?.phase || 'WAITING'}
        onAction={handleAction}
        onStartNewHand={startNewHand}
        onToggleHandVisibility={() => setPlayerHandVisible(!playerHandVisible)}
      />
    </div>
  );
};
