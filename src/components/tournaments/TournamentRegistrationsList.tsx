
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TournamentRegistration } from '@/types/tournaments';
import { useTranslation } from '@/hooks/useTranslation';
import { formatDistanceToNow } from 'date-fns';

interface TournamentRegistrationsListProps {
  registrations: TournamentRegistration[];
  loading: boolean;
}

export function TournamentRegistrationsList({ 
  registrations,
  loading
}: TournamentRegistrationsListProps) {
  const { t } = useTranslation();
  
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(word => word[0]?.toUpperCase() || '')
      .slice(0, 2)
      .join('');
  };
  
  if (loading) {
    return <p className="text-center py-4">{t('loading', 'Loading...')}</p>;
  }
  
  if (registrations.length === 0) {
    return (
      <p className="text-center py-4 text-muted-foreground">
        {t('tournaments.noRegistrations', 'No players registered yet')}
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('player', 'Player')}</TableHead>
          <TableHead>{t('registeredAt', 'Registered')}</TableHead>
          <TableHead className="text-right">{t('tournaments.chips', 'Chips')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map((registration) => (
          <TableRow key={registration.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {registration.player_avatar ? (
                  <AvatarImage src={registration.player_avatar} alt={registration.player_name || ''} />
                ) : null}
                <AvatarFallback>
                  {getInitials(registration.player_name || 'Unknown Player')}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{registration.player_name || 'Unknown Player'}</span>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDistanceToNow(new Date(registration.registration_time), { addSuffix: true })}
            </TableCell>
            <TableCell className="text-right font-medium">
              {registration.chips.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
