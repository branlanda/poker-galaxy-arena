
import React, { useState } from 'react';
import { usePokerGame } from '@/hooks/usePokerGame';
import { Card, GamePhase, PlayerAction, PlayerState } from '@/types/poker';
import { TableLayout } from './TableLayout';
import { PlayerSeat } from './PlayerSeat';
import { ActionControls } from './ActionControls';
import { CommunityCards } from './CommunityCards';
import { BuyInDialog } from './BuyInDialog';
import { GameInfo } from './GameInfo';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-300">Loading poker table...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-navy/50 rounded-lg border border-red-500/30 text-center">
        <h3 className="text-xl font-medium text-red-400 mb-3">Error Loading Game</h3>
        <p className="text-gray-300 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
    );
  }
  
  if (!game) {
    return (
      <div className="p-6 bg-navy/50 rounded-lg border border-emerald/30 text-center">
        <h3 className="text-xl font-medium text-emerald mb-3">No Active Game</h3>
        <p className="text-gray-300 mb-4">There is no active game at this table.</p>
      </div>
    );
  }

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
  
  // Get seats with players
  const occupiedSeats = players.reduce<Record<number, PlayerState>>((acc, player) => {
    acc[player.seatNumber] = player;
    return acc;
  }, {});
  
  // Determine max number of seats
  const maxSeats = 9; // Default max seats
  
  // Generate array of seat positions (0-indexed)
  const seatPositions = Array.from({ length: maxSeats }, (_, i) => i);
  
  // Current player's hole cards
  const currentPlayerCards = playerState?.holeCards;
  
  return (
    <div className="relative">
      {/* Game phase indicator */}
      <div className="absolute top-4 left-4 z-10">
        <Badge 
          variant="outline" 
          className={`px-3 py-1 font-medium text-sm ${
            game.phase === 'WAITING' ? 'bg-gray-800/60 text-gray-300' :
            game.phase === 'PREFLOP' ? 'bg-blue-900/60 text-blue-300' :
            game.phase === 'FLOP' ? 'bg-green-900/60 text-green-300' :
            game.phase === 'TURN' ? 'bg-amber-900/60 text-amber-300' :
            game.phase === 'RIVER' ? 'bg-purple-900/60 text-purple-300' :
            'bg-red-900/60 text-red-300'
          }`}
        >
          {game.phase}
        </Badge>
      </div>
      
      {/* Toggle hand visibility */}
      {currentPlayerCards && currentPlayerCards.length > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePlayerHandVisibility}
            className="flex items-center gap-1"
          >
            {playerHandVisible ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span className="ml-1">Hide Cards</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span className="ml-1">Show Cards</span>
              </>
            )}
          </Button>
        </div>
      )}
      
      <TableLayout pot={game.pot}>
        {/* Render all seats */}
        {seatPositions.map((seatIndex) => {
          const player = occupiedSeats[seatIndex];
          const isCurrentPlayer = player?.playerId === userId;
          const isActive = game.activeSeat === seatIndex;
          
          return (
            <PlayerSeat
              key={seatIndex}
              position={seatIndex}
              player={player}
              isCurrentPlayer={isCurrentPlayer}
              isActive={isActive}
              isDealer={player?.isDealer ?? false}
              isSmallBlind={player?.isSmallBlind ?? false}
              isBigBlind={player?.isBigBlind ?? false}
              holeCards={isCurrentPlayer && playerHandVisible ? player?.holeCards : undefined}
              onSitDown={() => handleOpenSeatSelection(seatIndex)}
              disabled={isJoining || !!player}
            />
          );
        })}
        
        {/* Community cards */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <CommunityCards 
            cards={game.communityCards || []} 
            phase={game.phase as GamePhase} 
          />
        </div>
      </TableLayout>
      
      {/* Player action controls */}
      {isPlayerSeated && isPlayerTurn && playerState && (
        <div className="mt-4">
          <ActionControls
            playerState={playerState}
            currentBet={game.currentBet}
            onAction={async (action, amount) => {
              await onAction(action, amount);
            }}
          />
        </div>
      )}
      
      {/* Game info and action buttons */}
      <div className="mt-6 flex items-start justify-between">
        <GameInfo 
          gamePhase={game.phase}
          lastAction={actions[0]}
          smallBlind={10} // This should come from table settings
          bigBlind={20}   // This should come from table settings
        />
        
        <div className="space-y-2">
          {isPlayerSeated ? (
            <Button 
              variant="outline"
              onClick={handleLeaveTable}
              className="w-full"
            >
              Leave Table
            </Button>
          ) : (
            <p className="text-sm text-gray-400 text-center px-4">
              Select an empty seat to join the game
            </p>
          )}
        </div>
      </div>
      
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
