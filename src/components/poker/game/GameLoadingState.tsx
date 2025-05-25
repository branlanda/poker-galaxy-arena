
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameLoadingStateProps {
  isLoading: boolean;
  error?: string | null;
}

export const GameLoadingState: React.FC<GameLoadingStateProps> = ({ isLoading, error }) => {
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

  return null;
};
