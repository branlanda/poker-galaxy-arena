
import React from 'react';
import { FriendsPanel } from '@/components/friends/FriendsPanel';

interface FriendsSectionProps {
  // Mantenemos la interfaz existente por compatibilidad
  friends?: any[];
  loading?: boolean;
  onRefresh?: () => void;
}

export const FriendsSection: React.FC<FriendsSectionProps> = () => {
  // El nuevo componente FriendsPanel maneja todo internamente
  return <FriendsPanel />;
};
