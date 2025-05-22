import { LobbyTable } from '@/types/lobby';
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';
import { useJoinTable } from '@/hooks/useJoinTable';
import { formatDistanceToNow } from 'date-fns';
import { Activity, Clock, Flame, Lock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

interface TableCardProps {
  table: LobbyTable;
  isNew?: boolean;
}

export function TableCard({ table, isNew = false }: TableCardProps) {
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
  
  // Format creation time
  const createdTime = formatDistanceToNow(new Date(table.created_at), { addSuffix: true });

  // Format activity time
  const lastActivityTime = table.last_activity ? 
    formatDistanceToNow(new Date(table.last_activity), { addSuffix: true }) :
    createdTime;

  // Determine table activity status
  const getActivityStatus = () => {
    if (!table.last_activity) return 'idle';
    
    const lastActivity = new Date(table.last_activity).getTime();
    const now = new Date().getTime();
    const minutes = (now - lastActivity) / (1000 * 60);
    
    if (minutes < 5) return 'active';
    if (minutes < 30) return 'idle';
    return 'inactive';
  };
  
  const activityStatus = getActivityStatus();
  const activePlayerCount = table.active_players || 0;
  const isHot = activePlayerCount >= 3 || (table.current_players > 0 && table.current_players >= table.max_players * 0.7);
  
  // Calculate fill percentage for visual indicator
  const fillPercentage = Math.min(100, Math.round((table.current_players / table.max_players) * 100));

  return (
    <motion.div
      initial={isNew ? { opacity: 0, scale: 0.9 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className={`bg-navy/50 border ${isHot ? 'border-amber-500/50' : 'border-emerald/10'} h-full relative overflow-hidden`}>
        {isHot && (
          <div className="absolute top-0 right-0 mt-2 mr-2 z-10">
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 flex items-center gap-1">
              <Flame size={14} className="animate-pulse" />
              {t('hot', 'Hot')}
            </Badge>
          </div>
        )}
        
        {/* Fill indicator */}
        <div 
          className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${
            fillPercentage < 30 ? 'bg-blue-500/40' : 
            fillPercentage < 70 ? 'bg-emerald/40' : 'bg-amber-500/40'
          }`} 
          style={{ width: `${fillPercentage}%` }}
        />
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-emerald truncate flex items-center gap-2">
                {table.name}
                {table.is_private && <Lock size={14} className="text-amber-400" />}
              </h3>
              <p className="text-gray-400 text-xs">{t('created')} {createdTime}</p>
            </div>
            <div className="flex gap-1 flex-wrap justify-end">
              <Badge variant={table.table_type === 'CASH' ? "outline" : "secondary"}>{table.table_type}</Badge>
              <Badge variant={
                table.status === 'WAITING' ? 'outline' : 
                table.status === 'ACTIVE' ? 'default' :
                table.status === 'PAUSED' ? 'secondary' : 'destructive'
              }>
                {table.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4 pt-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-400">{t('blinds')}</p>
              <p className="font-medium">{table.small_blind} / {table.big_blind}</p>
            </div>
            <div>
              <p className="text-gray-400">{t('buyIn')}</p>
              <p className="font-medium">{table.min_buy_in} - {table.max_buy_in}</p>
            </div>
            <div className="flex items-center gap-1">
              <Users className={`h-4 w-4 ${table.current_players > 0 ? 'text-emerald' : 'text-gray-400'}`} />
              <div>
                <p className="text-gray-400">{t('players')}</p>
                <p className="font-medium">
                  <span>{table.current_players} / {table.max_players}</span>
                  {activePlayerCount > 0 && (
                    <span className="text-emerald ml-1">({activePlayerCount} {t('active')})</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Activity className={`h-4 w-4 ${
                activityStatus === 'active' ? 'text-emerald' :
                activityStatus === 'idle' ? 'text-amber-400' : 
                'text-gray-500'
              }`} />
              <div>
                <p className="text-gray-400">{t('activity')}</p>
                <p className="text-xs font-medium">{lastActivityTime}</p>
              </div>
            </div>
            {table.hand_number > 0 && (
              <div className="flex items-center gap-1 col-span-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-400">{t('currentHand', 'Current Hand')}</p>
                  <p className="font-medium">#{table.hand_number}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
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
        </CardFooter>
      </Card>
    </motion.div>
  );
}
