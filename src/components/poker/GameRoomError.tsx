
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface GameRoomErrorProps {
  error: string | null;
  onBack?: () => void;
}

export const GameRoomError: React.FC<GameRoomErrorProps> = ({ error, onBack }) => {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-navy/30 p-8 rounded-lg border border-red-500/30">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Unable to Load Game
          </h2>
          <p className="text-gray-300 mb-6">
            {error || "There was an error loading the game. Please try again later."}
          </p>
          <div className="flex gap-4">
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Back to Tables
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
