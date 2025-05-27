
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Trophy, DollarSign } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { TournamentRegistration } from '@/types/tournaments';

interface TournamentPlayersTableProps {
  registrations: TournamentRegistration[];
  tournamentStatus: string;
  prizePool: number;
  payoutStructure: Array<{
    position: number;
    percentage: number;
  }>;
}

export const TournamentPlayersTable: React.FC<TournamentPlayersTableProps> = ({
  registrations,
  tournamentStatus,
  prizePool,
  payoutStructure
}) => {
  const { t } = useTranslation();

  const calculatePrize = (position: number) => {
    const payout = payoutStructure.find(p => p.position === position);
    if (!payout) return 0;
    return (prizePool * payout.percentage) / 100;
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return 'bg-yellow-500/20 text-yellow-500';
    if (position === 2) return 'bg-gray-400/20 text-gray-400';
    if (position === 3) return 'bg-orange-500/20 text-orange-500';
    return 'bg-emerald/20 text-emerald';
  };

  const sortedRegistrations = [...registrations].sort((a, b) => {
    if (tournamentStatus === 'COMPLETED' && a.final_position && b.final_position) {
      return a.final_position - b.final_position;
    }
    return new Date(a.registration_time || a.created_at).getTime() - 
           new Date(b.registration_time || b.created_at).getTime();
  });

  const isCompleted = tournamentStatus === 'COMPLETED';

  return (
    <Card className="bg-navy/50 border-emerald/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald" />
          {isCompleted ? 'Final Results' : 'Registered Players'}
          <Badge variant="secondary" className="bg-emerald/20 text-emerald">
            {registrations.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {registrations.length > 0 ? (
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-emerald/20">
                  {isCompleted && <TableHead className="text-gray-300">Position</TableHead>}
                  <TableHead className="text-gray-300">Player</TableHead>
                  <TableHead className="text-gray-300">Chips</TableHead>
                  {isCompleted && <TableHead className="text-gray-300">Prize</TableHead>}
                  <TableHead className="text-gray-300">
                    {isCompleted ? 'Eliminated' : 'Registered'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRegistrations.map((registration) => (
                  <TableRow key={registration.id} className="border-emerald/10">
                    {isCompleted && (
                      <TableCell>
                        {registration.final_position && (
                          <Badge className={getPositionColor(registration.final_position)}>
                            #{registration.final_position}
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={registration.player_avatar || registration.profiles?.avatar_url} 
                            alt={registration.player_name} 
                          />
                          <AvatarFallback className="bg-emerald/20 text-emerald">
                            {(registration.player_name || registration.profiles?.alias || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-white">
                            {registration.player_name || registration.profiles?.alias || 'Unknown Player'}
                          </div>
                          {registration.final_position === 1 && isCompleted && (
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Trophy className="h-3 w-3" />
                              <span className="text-xs">Winner</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {registration.chips.toLocaleString()}
                    </TableCell>
                    {isCompleted && (
                      <TableCell className="text-gray-300">
                        {registration.payout ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-emerald" />
                            <span className="text-emerald font-medium">
                              {registration.payout.toLocaleString()}
                            </span>
                          </div>
                        ) : registration.final_position && registration.final_position <= payoutStructure.length ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-emerald" />
                            <span className="text-emerald font-medium">
                              {calculatePrize(registration.final_position).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-gray-300 text-sm">
                      {new Date(registration.registration_time || registration.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400 text-lg font-medium mb-2">
              No players registered yet
            </p>
            <p className="text-gray-500 text-sm">
              Be the first to join this tournament!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
