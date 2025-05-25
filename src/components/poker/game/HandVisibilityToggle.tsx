
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Card } from '@/types/poker';

interface HandVisibilityToggleProps {
  currentPlayerCards: Card[] | undefined;
  playerHandVisible: boolean;
  onToggle: () => void;
}

export const HandVisibilityToggle: React.FC<HandVisibilityToggleProps> = ({
  currentPlayerCards,
  playerHandVisible,
  onToggle
}) => {
  if (!currentPlayerCards || currentPlayerCards.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
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
  );
};
