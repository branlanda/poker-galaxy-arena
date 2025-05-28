
import React from 'react';
import { GameTable } from './GameTable';
import { Card, CardContent } from '@/components/ui/card';
import { GameState, PlayerState } from '@/types/poker';

interface GameRoomMainAreaProps {
  gameState: GameState | null;
  transformedPlayers: PlayerState[];
  userId?: string;
  isJoining: boolean;
  onSitDown: (seatNumber: number) => void;
}

export const GameRoomMainArea: React.FC<GameRoomMainAreaProps> = ({
  gameState,
  transformedPlayers,
  userId,
  isJoining,
  onSitDown
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
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
          <Card className="bg-slate-800/50 border-emerald/20">
            <CardContent className="h-96 flex items-center justify-center">
              <div className="text-center text-emerald-400">
                <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white">Cargando mesa de juego...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
