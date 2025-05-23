import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { TournamentRegistration, TournamentTable } from '@/types/tournaments';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeInfo, LayoutGrid, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';

interface TournamentBracketProps {
  tournamentId: string;
  registrations: TournamentRegistration[];
  tables: TournamentTable[];
}

export function TournamentBracket({ 
  tournamentId,
  registrations,
  tables 
}: TournamentBracketProps) {
  const { t } = useTranslation();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [bracketMode, setBracketMode] = useState<'standard' | 'tables'>('standard');

  const increaseZoom = () => {
    if (zoomLevel < 1.5) {
      setZoomLevel(zoomLevel + 0.1);
    }
  };

  const decreaseZoom = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel(zoomLevel - 0.1);
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  // For real tournaments, this would be generated from actual tournament rounds
  // This is a simplified implementation for demonstration purposes
  const generateMockBracket = () => {
    const playerCount = registrations.length;
    const rounds = Math.ceil(Math.log2(playerCount));
    
    // Create bracket structure
    let bracket: any[] = [];
    let currentRoundMatches = Math.ceil(playerCount / 2);
    
    for (let round = 0; round < rounds; round++) {
      let roundMatches = [];
      
      for (let match = 0; match < currentRoundMatches; match++) {
        if (round === 0) {
          // First round, use actual players
          const player1Index = match * 2;
          const player2Index = match * 2 + 1;
          
          roundMatches.push({
            id: `R1M${match}`,
            player1: player1Index < playerCount ? registrations[player1Index] : null,
            player2: player2Index < playerCount ? registrations[player2Index] : null,
            winner: null,
            completed: false
          });
        } else {
          // Subsequent rounds
          roundMatches.push({
            id: `R${round + 1}M${match}`,
            player1: null,
            player2: null,
            winner: null,
            completed: false
          });
        }
      }
      
      bracket.push({
        round: round + 1,
        matches: roundMatches
      });
      
      currentRoundMatches = Math.ceil(currentRoundMatches / 2);
    }
    
    return bracket;
  };

  const mockBracket = generateMockBracket();

  const renderStandardBracket = () => {
    return (
      <div 
        className="bracket-container overflow-auto py-6 px-4"
        style={{ 
          transform: `scale(${zoomLevel})`, 
          transformOrigin: 'top left',
          minWidth: `${100 / zoomLevel}%`
        }}
      >
        <div className="flex gap-8">
          {mockBracket.map((round, roundIdx) => (
            <div key={`round-${round.round}`} className="flex flex-col space-y-8">
              <div className="text-center font-medium mb-4">
                {roundIdx === mockBracket.length - 1 
                  ? t('tournaments.final')
                  : roundIdx === mockBracket.length - 2
                  ? t('tournaments.semifinals')
                  : roundIdx === mockBracket.length - 3
                  ? t('tournaments.quarterfinals')
                  : `${t('tournaments.round')} ${round.round}`
                }
              </div>
              
              {round.matches.map((match: any, matchIdx: number) => {
                // Calculate the proper spacing between matches
                const matchCount = round.matches.length;
                const spacingMultiplier = Math.pow(2, roundIdx);
                const marginTop = matchIdx > 0 ? `${spacingMultiplier * 4}rem` : '0';
                
                return (
                  <div 
                    key={match.id}
                    className="match-container"
                    style={{ marginTop }}
                  >
                    <Card className="w-56 relative">
                      <CardContent className="p-3">
                        {/* Player 1 */}
                        <div className={`p-2 rounded-t border-b flex items-center ${
                          match.player1 ? 'bg-navy/30' : 'bg-navy/10 text-muted-foreground'
                        }`}>
                          {match.player1 ? (
                            <div className="truncate">{match.player1.player_name}</div>
                          ) : (
                            <div>TBD</div>
                          )}
                        </div>
                        
                        {/* Player 2 */}
                        <div className={`p-2 rounded-b flex items-center ${
                          match.player2 ? 'bg-navy/30' : 'bg-navy/10 text-muted-foreground'
                        }`}>
                          {match.player2 ? (
                            <div className="truncate">{match.player2.player_name}</div>
                          ) : (
                            <div>TBD</div>
                          )}
                        </div>
                        
                        {/* Match status */}
                        {match.completed && (
                          <div className="absolute -right-2 -top-2">
                            <Badge className="bg-emerald/90">
                              {t('tournaments.completed')}
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTablesBracket = () => {
    if (tables.length === 0) {
      return (
        <div className="text-center py-8">
          <BadgeInfo className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-lg font-medium text-gray-300 mb-2">
            {t('tournaments.noTableData')}
          </p>
          <p className="text-gray-400 max-w-md mx-auto">
            {t('tournaments.waitingForTables')}
          </p>
        </div>
      );
    }
    
    return (
      <div 
        className="tables-bracket overflow-auto py-6 px-4"
        style={{ 
          transform: `scale(${zoomLevel})`, 
          transformOrigin: 'top left',
          minWidth: `${100 / zoomLevel}%`
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map(table => (
            <Card key={table.id} className={`${table.is_final_table ? 'border-amber-500/50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-medium text-lg">
                    {t('tournaments.table')} {table.table_number}
                  </div>
                  {table.is_final_table ? (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      {t('tournaments.finalTable')}
                    </Badge>
                  ) : (
                    <Badge className={
                      table.status === 'WAITING' ? 'bg-blue-500/10 text-blue-500' :
                      table.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' :
                      'bg-gray-500/10 text-gray-500'
                    }>
                      {table.status}
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: table.max_seats }).map((_, seatIndex) => {
                    const seatNumber = seatIndex + 1;
                    const occupiedSeat = table.seats?.find(s => s.seat_number === seatNumber);
                    
                    return (
                      <div 
                        key={seatNumber} 
                        className={`p-2 rounded-md text-center ${
                          occupiedSeat ? 'bg-navy/40 border border-navy/60' : 'bg-navy/20'
                        }`}
                      >
                        <div className="text-xs text-muted-foreground">
                          {seatNumber}
                        </div>
                        {occupiedSeat ? (
                          <div className="text-xs truncate">
                            {occupiedSeat.player_name}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">-</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="tournament-bracket">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={bracketMode === 'standard' ? 'bg-emerald/10' : ''}
            onClick={() => setBracketMode('standard')}
          >
            <BadgeInfo className="h-4 w-4 mr-2" />
            {t('tournaments.bracket')}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={bracketMode === 'tables' ? 'bg-emerald/10' : ''}
            onClick={() => setBracketMode('tables')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            {t('tournaments.tables')}
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={decreaseZoom}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={resetZoom}>
            {Math.round(zoomLevel * 100)}%
          </Button>
          <Button variant="outline" size="icon" onClick={increaseZoom}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card className="border-dotted overflow-hidden">
        {bracketMode === 'standard' ? renderStandardBracket() : renderTablesBracket()}
      </Card>
      
      <div className="text-center text-xs text-muted-foreground mt-2">
        {t('tournaments.scrollZoom')}
      </div>
    </div>
  );
}
