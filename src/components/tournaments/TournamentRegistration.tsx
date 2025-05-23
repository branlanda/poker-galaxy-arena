
import React, { useState } from 'react';
import { Tournament } from '@/types/tournaments';
import { useTournamentRegistration } from '@/hooks/useTournamentRegistration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/useTranslation';
import { Trophy, Users, Lock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TournamentRegistrationProps {
  tournament: Tournament;
  onRegistrationChange?: () => void;
}

export const TournamentRegistration: React.FC<TournamentRegistrationProps> = ({ 
  tournament, 
  onRegistrationChange 
}) => {
  const { t } = useTranslation();
  const [accessCodeDialogOpen, setAccessCodeDialogOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  
  const { 
    loading, 
    registered, 
    registration,
    registerForTournament, 
    unregisterFromTournament 
  } = useTournamentRegistration(tournament);
  
  const handleRegisterClick = () => {
    if (tournament.is_private && tournament.access_code) {
      setAccessCodeDialogOpen(true);
    } else {
      registerForTournament();
    }
  };
  
  const handleUnregisterClick = async () => {
    const success = await unregisterFromTournament();
    if (success && onRegistrationChange) {
      onRegistrationChange();
    }
  };
  
  const handleAccessCodeSubmit = async () => {
    const success = await registerForTournament(accessCode);
    if (success && onRegistrationChange) {
      onRegistrationChange();
    }
    setAccessCodeDialogOpen(false);
  };
  
  const renderRegistrationStatus = () => {
    if (loading) {
      return <p>{t('loading')}</p>;
    }
    
    if (registered && registration) {
      return (
        <>
          <p className="text-sm text-muted-foreground">
            {t('tournaments.youAreRegistered')}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Users className="h-4 w-4 text-emerald" />
            <span>{tournament.registered_players_count} / {tournament.max_players} {t('tournaments.players')}</span>
          </div>
          <Button 
            variant="accent" 
            onClick={handleUnregisterClick}
            disabled={loading}
            className="w-full mt-4"
          >
            {t('tournaments.unregister')}
          </Button>
        </>
      );
    } else {
      return (
        <>
          <p className="text-sm text-muted-foreground">
            {t('tournaments.registerNow')}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Users className="h-4 w-4 text-emerald" />
            <span>{tournament.registered_players_count} / {tournament.max_players} {t('tournaments.players')}</span>
          </div>
          <Button 
            onClick={handleRegisterClick}
            disabled={loading}
            className="w-full mt-4"
          >
            {t('tournaments.register')}
          </Button>
        </>
      );
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('tournaments.registration')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{format(new Date(tournament.start_time), 'PPP')}</p>
            <p className="text-xs text-muted-foreground">{format(new Date(tournament.start_time), 'p')}</p>
          </div>
        </div>
        
        {tournament.is_private && tournament.access_code && (
          <div className="flex items-center gap-4">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm">{t('tournaments.privateTournament')}</p>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <Trophy className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm">
            {tournament.buy_in > 0 
              ? `${tournament.buy_in} USDT`
              : t('tournaments.freeroll')}
          </p>
        </div>
        
        {renderRegistrationStatus()}
      </CardContent>
      
      <Dialog open={accessCodeDialogOpen} onOpenChange={setAccessCodeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('tournaments.enterAccessCode')}</DialogTitle>
          </DialogHeader>
          <Input
            type="password"
            placeholder={t('tournaments.accessCode')}
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleAccessCodeSubmit} disabled={loading}>
              {t('submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
