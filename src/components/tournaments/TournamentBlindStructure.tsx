
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface BlindLevel {
  level: number;
  small_blind: number;
  big_blind: number;
  ante: number;
  duration_minutes: number;
}

interface TournamentBlindStructureProps {
  blindStructure: BlindLevel[];
  currentLevel?: number;
}

export const TournamentBlindStructure: React.FC<TournamentBlindStructureProps> = ({
  blindStructure,
  currentLevel = 0
}) => {
  const { t } = useTranslation();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Card className="bg-navy/50 border-emerald/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald" />
          {t('tournaments.blindStructure', 'Blind Structure')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-emerald/20">
                <TableHead className="text-gray-300">Level</TableHead>
                <TableHead className="text-gray-300">Small Blind</TableHead>
                <TableHead className="text-gray-300">Big Blind</TableHead>
                <TableHead className="text-gray-300">Ante</TableHead>
                <TableHead className="text-gray-300">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blindStructure.map((level, index) => (
                <TableRow 
                  key={level.level} 
                  className={`border-emerald/10 ${
                    level.level === currentLevel ? 'bg-emerald/20' : 
                    level.level < currentLevel ? 'bg-gray-500/10' : ''
                  }`}
                >
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      {level.level === currentLevel && (
                        <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
                      )}
                      {level.level}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {level.small_blind.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {level.big_blind.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {level.ante > 0 ? level.ante.toLocaleString() : '-'}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(level.duration_minutes)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
