
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TournamentType } from '@/types/tournaments';
import { BlindLevelEditor } from './components/BlindLevelEditor';
import { PayoutStructureEditor } from './components/PayoutStructureEditor';

interface TournamentCreateDialogProps {
  children?: React.ReactNode;
}

export function TournamentCreateDialog({ children }: TournamentCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tournamentType, setTournamentType] = useState<TournamentType>('MULTI_TABLE');
  const [startDateTime, setStartDateTime] = useState('');
  const [registrationOpenDateTime, setRegistrationOpenDateTime] = useState('');
  const [buyIn, setBuyIn] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(9);
  const [startingChips, setStartingChips] = useState(1000);
  const [blindLevels, setBlindLevels] = useState([
    { level: 1, small_blind: 5, big_blind: 10, ante: 0, duration_minutes: 15 },
    { level: 2, small_blind: 10, big_blind: 20, ante: 0, duration_minutes: 15 },
    { level: 3, small_blind: 15, big_blind: 30, ante: 0, duration_minutes: 15 },
  ]);
  const [payouts, setPayouts] = useState([
    { position: 1, percentage: 50 },
    { position: 2, percentage: 30 },
    { position: 3, percentage: 20 },
  ]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: t('errors.notLoggedIn', 'Not logged in'),
        description: t('errors.loginRequired', 'You must be logged in to create tournaments'),
        variant: 'destructive',
      });
      return;
    }
    
    // Validate form
    if (!name) {
      toast({
        title: t('errors.validationFailed', 'Validation failed'),
        description: t('errors.nameRequired', 'Tournament name is required'),
        variant: 'destructive',
      });
      return;
    }
    
    if (!startDateTime) {
      toast({
        title: t('errors.validationFailed', 'Validation failed'),
        description: t('errors.startTimeRequired', 'Start time is required'),
        variant: 'destructive',
      });
      return;
    }
    
    if (!registrationOpenDateTime) {
      toast({
        title: t('errors.validationFailed', 'Validation failed'),
        description: t('errors.registrationTimeRequired', 'Registration open time is required'),
        variant: 'destructive',
      });
      return;
    }
    
    if (isPrivate && !accessCode) {
      toast({
        title: t('errors.validationFailed', 'Validation failed'),
        description: t('errors.accessCodeRequired', 'Access code is required for private tournaments'),
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('tournaments_new')
        .insert({
          name,
          description,
          tournament_type: tournamentType,
          start_time: new Date(startDateTime).toISOString(),
          registration_open_time: new Date(registrationOpenDateTime).toISOString(),
          buy_in: buyIn,
          starting_chips: startingChips,
          max_players: maxPlayers,
          created_by: user.id,
          is_private: isPrivate,
          access_code: isPrivate ? accessCode : null,
          blind_structure: blindLevels,
          payout_structure: payouts,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: t('tournaments.created', 'Tournament Created'),
        description: t('tournaments.createdSuccess', 'Tournament "{name}" has been created successfully', { name }),
      });
      
      setOpen(false);
      navigate(`/tournaments/${data.id}`);
    } catch (err: any) {
      console.error('Error creating tournament:', err);
      toast({
        title: t('errors.creationFailed', 'Creation failed'),
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('tournaments.create', 'Create Tournament')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('tournaments.create', 'Create Tournament')}</DialogTitle>
          <DialogDescription>
            {t('tournaments.createDescription', 'Set up a new poker tournament for players to join.')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  {t('name', 'Name')} *
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  {t('description', 'Description')}
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tournamentType" className="block text-sm font-medium mb-1">
                  {t('tournaments.type', 'Tournament Type')} *
                </label>
                <select
                  id="tournamentType"
                  value={tournamentType}
                  onChange={(e) => setTournamentType(e.target.value as TournamentType)}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                >
                  <option value="MULTI_TABLE">{t('tournaments.types.multiTable', 'Multi-Table')}</option>
                  <option value="SIT_N_GO">{t('tournaments.types.sitNGo', 'Sit & Go')}</option>
                  <option value="FREEROLL">{t('tournaments.types.freeroll', 'Freeroll')}</option>
                  <option value="SPECIAL_EVENT">{t('tournaments.types.specialEvent', 'Special Event')}</option>
                  <option value="SATELLITE">{t('tournaments.types.satellite', 'Satellite')}</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="maxPlayers" className="block text-sm font-medium mb-1">
                  {t('tournaments.maxPlayers', 'Max Players')} *
                </label>
                <input
                  id="maxPlayers"
                  type="number"
                  min="2"
                  max="1000"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDateTime" className="block text-sm font-medium mb-1">
                  {t('tournaments.startTime', 'Start Time')} *
                </label>
                <input
                  id="startDateTime"
                  type="datetime-local"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="registrationOpenDateTime" className="block text-sm font-medium mb-1">
                  {t('tournaments.registrationOpenTime', 'Registration Opens')} *
                </label>
                <input
                  id="registrationOpenDateTime"
                  type="datetime-local"
                  value={registrationOpenDateTime}
                  onChange={(e) => setRegistrationOpenDateTime(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="buyIn" className="block text-sm font-medium mb-1">
                  {t('tournaments.buyIn', 'Buy-in')} *
                </label>
                <input
                  id="buyIn"
                  type="number"
                  min="0"
                  value={buyIn}
                  onChange={(e) => setBuyIn(parseFloat(e.target.value))}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('tournaments.buyInDescription', 'Set to 0 for a freeroll tournament')}
                </p>
              </div>
              
              <div>
                <label htmlFor="startingChips" className="block text-sm font-medium mb-1">
                  {t('tournaments.startingChips', 'Starting Chips')} *
                </label>
                <input
                  id="startingChips"
                  type="number"
                  min="100"
                  step="100"
                  value={startingChips}
                  onChange={(e) => setStartingChips(parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="blind-structure" className="block text-sm font-medium mb-1">
                {t('tournaments.blindStructure', 'Blind Structure')}
              </label>
              <BlindLevelEditor 
                levels={blindLevels} 
                onChange={setBlindLevels} 
              />
            </div>
            
            <div>
              <label htmlFor="payout-structure" className="block text-sm font-medium mb-1">
                {t('tournaments.payoutStructure', 'Payout Structure')}
              </label>
              <PayoutStructureEditor 
                payouts={payouts} 
                onChange={setPayouts} 
              />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  id="isPrivate"
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="isPrivate" className="text-sm font-medium">
                  {t('tournaments.makePrivate', 'Make this tournament private')}
                </label>
              </div>
              
              {isPrivate && (
                <div>
                  <label htmlFor="accessCode" className="block text-sm font-medium mb-1">
                    {t('tournaments.accessCode', 'Access Code')} *
                  </label>
                  <input
                    id="accessCode"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                    required={isPrivate}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('tournaments.accessCodeRequired', 'Required for players to join this tournament')}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? t('tournaments.creating', 'Creating...') 
                : t('tournaments.create', 'Create Tournament')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
