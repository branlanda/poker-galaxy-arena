
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TournamentStatus } from '@/types/tournaments';
import { useTranslation } from '@/hooks/useTranslation';

interface TournamentStatusBadgeProps {
  status: TournamentStatus;
}

export function TournamentStatusBadge({ status }: TournamentStatusBadgeProps) {
  const { t } = useTranslation();
  
  const getStatusColor = (): string => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
      case 'REGISTERING':
        return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20';
      case 'RUNNING':
        return 'bg-amber-500/20 text-amber-500 border-amber-500/20';
      case 'BREAK':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/20';
      case 'FINAL_TABLE':
        return 'bg-pink-500/20 text-pink-500 border-pink-500/20';
      case 'COMPLETED':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/20';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-500 border-red-500/20';
      default:
        return '';
    }
  };
  
  const getStatusText = (): string => {
    switch (status) {
      case 'SCHEDULED':
        return t('tournaments.status.scheduled', 'Scheduled');
      case 'REGISTERING':
        return t('tournaments.status.registering', 'Registering');
      case 'RUNNING':
        return t('tournaments.status.running', 'Running');
      case 'BREAK':
        return t('tournaments.status.break', 'Break');
      case 'FINAL_TABLE':
        return t('tournaments.status.finalTable', 'Final Table');
      case 'COMPLETED':
        return t('tournaments.status.completed', 'Completed');
      case 'CANCELLED':
        return t('tournaments.status.cancelled', 'Cancelled');
      default:
        return status;
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusColor()} font-medium`}
    >
      {getStatusText()}
    </Badge>
  );
}
