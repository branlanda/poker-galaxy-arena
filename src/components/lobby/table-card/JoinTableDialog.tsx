
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { useTranslation } from '@/hooks/useTranslation';
import { LobbyTable } from '@/types/lobby';
import { useJoinTable } from '@/hooks/useJoinTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface JoinTableDialogProps {
  table: LobbyTable;
}

export function JoinTableDialog({ table }: JoinTableDialogProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [buyIn, setBuyIn] = useState(table.min_buy_in);
  const [password, setPassword] = useState('');
  const { joinTable, loading } = useJoinTable();
  const { t } = useTranslation();
  
  const handleJoin = async () => {
    const success = await joinTable(table.id, buyIn, password);
    if (!success) {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={isJoining} onOpenChange={setIsJoining}>
      <DialogTrigger asChild>
        <Button 
          className="w-full" 
          disabled={table.current_players >= table.max_players}
          variant={table.current_players >= table.max_players ? "outline" : "primary"}
        >
          {table.current_players >= table.max_players ? t('tableFull', 'Table Full') : t('joinTable', 'Join Table')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('joinTableName', 'Join Table')}: {table.name}</DialogTitle>
          <DialogDescription>
            {t('enterBuyIn', 'Enter your buy-in amount to join this table.')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('buyInAmount', 'Buy-in Amount')} ({table.min_buy_in} - {table.max_buy_in})
            </label>
            <div className="relative">
              <Input
                type="number"
                value={buyIn}
                onChange={(e) => setBuyIn(Number(e.target.value))}
                min={table.min_buy_in}
                max={table.max_buy_in}
                className="pl-6"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
            </div>
          </div>
          
          {table.is_private && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('password', 'Password')}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('enterTablePassword', 'Enter table password')}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsJoining(false)}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button onClick={handleJoin} disabled={loading}>
            {loading ? t('joining', 'Joining...') : t('joinNow', 'Join Now')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
