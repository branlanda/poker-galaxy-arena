
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Calendar, Users } from "lucide-react";
import { useTournamentRegistration } from '@/hooks/useTournamentRegistration';
import { Tournament } from '@/types/tournaments';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';

interface TournamentRegistrationProps {
  tournament: Tournament;
  onRegistrationChange?: () => void;
}

// Define a mock registration type that matches the expected structure
interface TournamentPlayerRegistration {
  id: string;
  player_id: string;
  player?: {
    alias?: string;
    avatar_url?: string;
  };
}

export function TournamentRegistration({ tournament, onRegistrationChange }: TournamentRegistrationProps) {
  const { t } = useTranslation();
  const [accessCode, setAccessCode] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { 
    loading, 
    registered, 
    registerForTournament, 
    unregisterFromTournament 
  } = useTournamentRegistration(tournament.id);
  
  // Mock registrations data since we don't have it in the Tournament type
  const mockRegistrations: TournamentPlayerRegistration[] = [];
  
  const handleRegister = async () => {
    if (tournament.is_private && !accessCode) {
      return;
    }
    
    const success = await registerForTournament(tournament.is_private ? accessCode : undefined);
    if (success) {
      setIsDialogOpen(false);
      setAccessCode('');
      if (onRegistrationChange) {
        onRegistrationChange();
      }
    }
  };
  
  const handleUnregister = async () => {
    await unregisterFromTournament();
    if (onRegistrationChange) {
      onRegistrationChange();
    }
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t('tournaments.registration')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="text-sm text-gray-500">{t('tournaments.prizePool')}</div>
                  <div className="font-semibold">${tournament.prize_pool.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-emerald-500" />
                <div>
                  <div className="text-sm text-gray-500">{t('tournaments.startTime')}</div>
                  <div className="font-semibold">{format(new Date(tournament.start_time), 'PPpp')}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-500">{t('tournaments.players')}</div>
                  <div className="font-semibold">
                    {tournament.registered_players_count || 0} / {tournament.max_players}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <h3 className="text-sm font-medium mb-2">{t('tournaments.registeredPlayers')}</h3>
            {mockRegistrations && mockRegistrations.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {mockRegistrations.map((reg) => (
                  <div key={reg.id} className="flex items-center gap-2 p-2 rounded-md bg-navy/50">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={reg.player?.avatar_url || ''} />
                      <AvatarFallback>
                        {reg.player?.alias?.substring(0, 2) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      {reg.player?.alias || t('tournaments.unknownPlayer')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-gray-500 text-sm">
                {t('tournaments.noRegistrations')}
              </div>
            )}
          </div>
        </div>
        
        {registered ? (
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleUnregister} 
            disabled={loading}
          >
            {loading ? t('tournaments.cancelingRegistration') : t('tournaments.cancelRegistration')}
          </Button>
        ) : (
          tournament.is_private ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">{t('tournaments.register')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('tournaments.privateAccess')}</DialogTitle>
                  <DialogDescription>
                    {t('tournaments.enterAccessCode')}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="accessCode">{t('tournaments.accessCode')}</Label>
                  <Input 
                    id="accessCode"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder={t('tournaments.enterCode')}
                  />
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    {t('cancel')}
                  </Button>
                  <Button 
                    onClick={handleRegister}
                    disabled={loading || !accessCode}
                    variant="primary"
                  >
                    {loading ? t('tournaments.registering') : t('tournaments.register')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Button 
              className="w-full" 
              onClick={handleRegister} 
              disabled={loading}
            >
              {loading ? t('tournaments.registering') : t('tournaments.register')}
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
}
