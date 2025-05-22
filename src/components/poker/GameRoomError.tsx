
import React from 'react';
import { ErrorState } from '@/components/poker/ErrorState';

interface GameRoomErrorProps {
  error: string | null;
}

export const GameRoomError: React.FC<GameRoomErrorProps> = ({ error }) => {
  return <ErrorState error={error} />;
};
