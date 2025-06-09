
import React, { useState } from 'react';
import { usePokerGame } from '@/hooks/usePokerGame';
import { PlayerAction } from '@/types/poker';
import { BuyInDialog } from './BuyInDialog';
import { toast } from '@/hooks/use-toast';
import { GamePhaseIndicator } from './game/GamePhaseIndicator';
import { HandVisibilityToggle } from './game/HandVisibilityToggle';
import { GameTable } from './game/GameTable';
import { GameControls } from './game/GameControls';
import { GameLoadingState } from './game/GameLoadingState';
import { GameEmptyState } from './game/GameEmptyState';

interface PokerGameProps {
  tableId: string;
  isPlayerTurn: boolean;
  isPlayerSeated: boolean;
  onAction: (action: PlayerAction, amount?: number) => Promise<void>;
  onSitDown: (seatNumber: number, buyIn?: number) => void;
}

export function PokerGame({ 
  tableId,
  isPlayerTurn,
  isPlayerSeated,
  onAction,
  onSitDown
}: PokerGameProps) {
  const {
    game,
    players,
    actions,
    isLoading,
    error,
    isJoining,
    playerHandVisible,
    playerState,
    userId,
    togglePlayerHandVisibility,
    handleLeaveTable,
  } = usePokerGame(tableId);

  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [buyInDialogOpen, setBuyInDialogOpen] = useState(false);
  
  // Show loading or error states
  const loadingState = <GameLoadingState isLoading={isLoading} error={error} />;
  if (isLoading || error) return loadingState;
  
  // Show empty state if no game
  if (!game) return <GameEmptyState />;

  const handleOpenSeatSelection = (seatNumber: number) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to join a game",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedSeat(seatNumber);
    setBuyInDialogOpen(true);
  };

  const handleConfirmBuyIn = (amount: number) => {
    if (selectedSeat !== null) {
      onSitDown(selectedSeat, amount);
      setBuyInDialogOpen(false);
      setSelectedSeat(null);
    }
  };
  
  // Current player's hole cards
  const currentPlayerCards = playerState?.holeCards;
  
  return (
    <div className="relative">
      {/* Game phase indicator */}
      <GamePhaseIndicator phase={game.phase} />
      
      {/* Toggle hand visibility */}
      <HandVisibilityToggle
        currentPlayerCards={currentPlayerCards}
        playerHandVisible={playerHandVisible}
        onToggle={togglePlayerHandVisibility}
      />
      
      {/* Game table */}
      <GameTable
        game={game}
        players={players}
        userId={userId}
        playerHandVisible={playerHandVisible}
        isJoining={isJoining}
        onSitDown={handleOpenSeatSelection}
      />
      
      {/* Game controls */}
      <GameControls
        isPlayerSeated={isPlayerSeated}
        isPlayerTurn={isPlayerTurn}
        playerState={playerState}
        currentBet={game.currentBet}
        gamePhase={game.phase}
        onAction={onAction}
        onLeaveTable={handleLeaveTable}
      />
      
      {/* Buy-in dialog */}
      <BuyInDialog
        open={buyInDialogOpen}
        onOpenChange={setBuyInDialogOpen}
        onConfirm={handleConfirmBuyIn}
        seatNumber={selectedSeat}
        minBuyIn={1000} // This should come from table settings
        maxBuyIn={10000} // This should come from table settings
      />
    </div>
  );
}
