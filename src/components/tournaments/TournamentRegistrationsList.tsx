
import React, { useState } from 'react';
import { TournamentRegistration } from '@/types/tournaments';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { SearchIcon, UsersIcon } from 'lucide-react';

interface TournamentRegistrationsListProps {
  registrations: TournamentRegistration[];
}

export function TournamentRegistrationsList({ registrations }: TournamentRegistrationsListProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('time');
  
  // Filter registrations by search query
  const filteredRegistrations = registrations.filter(reg => 
    reg.player_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort registrations by selected criteria
  const sortedRegistrations = [...filteredRegistrations].sort((a, b) => {
    if (sortBy === 'time') {
      return new Date(a.registration_time).getTime() - new Date(b.registration_time).getTime();
    } else if (sortBy === 'name') {
      return (a.player_name || '').localeCompare(b.player_name || '');
    }
    return 0;
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <UsersIcon className="h-5 w-5 mr-2" />
            {t('tournaments.registeredPlayers')}
          </div>
          <div className="text-sm font-normal text-muted-foreground">
            {registrations.length} {t('tournaments.players')}
          </div>
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('tournaments.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">{t('tournaments.registrationTime')}</SelectItem>
              <SelectItem value="name">{t('tournaments.playerName')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {registrations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t('tournaments.noRegistrationsYet')}
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('tournaments.player')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('tournaments.registrationTime')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('tournaments.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRegistrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          {reg.player_avatar && <AvatarImage src={reg.player_avatar} alt={reg.player_name} />}
                          <AvatarFallback>{reg.player_name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div>{reg.player_name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(reg.registration_time), 'PPp')}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="inline-flex items-center rounded-full bg-green-100/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
                        {reg.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
