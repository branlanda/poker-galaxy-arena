import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { Calendar } from 'lucide-react';
import { Calendar as CalendarDate } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/stores/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TournamentCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onTournamentCreated: () => void;
}

export const TournamentCreateDialog: React.FC<TournamentCreateDialogProps> = ({
  open,
  onClose,
  onTournamentCreated
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [buyIn, setBuyIn] = useState(10);
  const [startTime, setStartTime] = useState<Date | undefined>(new Date());
  const [maxPlayers, setMaxPlayers] = useState(50);
  const [creating, setCreating] = useState(false);
  const [gameType, setGameType] = useState('NLH'); // Default to No-Limit Hold'em

  const handleSubmit = async () => {
    if (!user) return;
    
    if (!name.trim()) {
      toast({
        title: t('errors.missingField'),
        description: t('errors.tournamentNameRequired'),
        variant: 'destructive',
      });
      return;
    }
    
    if (!startTime) {
      toast({
        title: t('errors.missingField'),
        description: t('errors.tournamentStartTimeRequired'),
        variant: 'destructive',
      });
      return;
    }
    
    setCreating(true);
    
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .insert({
          name: name.trim(),
          buy_in: buyIn,
          start_time: startTime.toISOString(),
          max_players: maxPlayers,
          creator_id: user.id,
          game_type: gameType,
          status: 'scheduled'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: t('tournaments.tournamentCreated'),
        description: t('tournaments.tournamentCreatedSuccess'),
      });
      
      onTournamentCreated();
      onClose();
    } catch (error: any) {
      toast({
        title: t('errors.creationFailed'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-navy/90 backdrop-blur-lg border border-emerald/20">
        <DialogHeader>
          <DialogTitle>{t('tournaments.createTournament')}</DialogTitle>
          <DialogDescription>
            {t('tournaments.createTournamentDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">{t('name')}</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="buyIn" className="text-right">{t('tournaments.buyIn')}</Label>
            <Input
              id="buyIn"
              type="number"
              value={buyIn.toString()}
              onChange={(e) => setBuyIn(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gameType" className="text-right">{t('tournaments.gameType')}</Label>
            <Select value={gameType} onValueChange={setGameType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t('tournaments.selectGameType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NLH">No-Limit Hold'em</SelectItem>
                <SelectItem value="PLO">Pot-Limit Omaha</SelectItem>
                {/* Add more game types as needed */}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">{t('tournaments.startTime')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 pl-3 text-left font-normal",
                    !startTime && "text-muted-foreground"
                  )}
                >
                  {startTime ? format(startTime, "PPP p") : (
                    <span>{t('tournaments.pickDate')}</span>
                  )}
                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarDate
                  mode="single"
                  selected={startTime}
                  onSelect={setStartTime}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxPlayers" className="text-right">{t('tournaments.maxPlayers')}</Label>
            <Input
              id="maxPlayers"
              type="number"
              value={maxPlayers.toString()}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={creating}>
            {t('cancel')}
          </Button>
          <Button 
            variant="primary"
            onClick={handleSubmit}
            loading={creating}
          >
            {t('tournaments.createTournament')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
