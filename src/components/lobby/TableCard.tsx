
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
import { Activity, Clock, Users } from 'lucide-react';

interface TableCardProps {
  table: LobbyTable;
}

export function TableCard({ table }: TableCardProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [buyIn, setBuyIn] = useState(table.min_buy_in);
  const [password, setPassword] = useState('');
  const { joinTable, loading } = useJoinTable();
  
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

  return (
    <Card className="bg-navy/50 border border-emerald/10 h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-emerald truncate">{table.name}</h3>
            <p className="text-gray-400 text-xs">Created {createdTime}</p>
          </div>
          <div className="flex gap-1">
            <Badge variant={table.table_type === 'CASH' ? "outline" : "secondary"}>{table.table_type}</Badge>
            {table.is_private && <Badge variant="destructive">Private</Badge>}
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
            <p className="text-gray-400">Blinds</p>
            <p>{table.small_blind} / {table.big_blind}</p>
          </div>
          <div>
            <p className="text-gray-400">Buy-in</p>
            <p>{table.min_buy_in} - {table.max_buy_in}</p>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-400">Players</p>
              <p>
                <span>{table.current_players} / {table.max_players}</span>
                {activePlayerCount > 0 && (
                  <span className="text-emerald ml-1">({activePlayerCount} active)</span>
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
              <p className="text-gray-400">Activity</p>
              <p className="text-xs">{lastActivityTime}</p>
            </div>
          </div>
          {table.hand_number > 0 && (
            <div className="flex items-center gap-1 col-span-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-400">Current Hand</p>
                <p>#{table.hand_number}</p>
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
            >
              {table.current_players >= table.max_players ? 'Table Full' : 'Join Table'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join Table: {table.name}</DialogTitle>
              <DialogDescription>
                Enter your buy-in amount to join this table.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Buy-in Amount ({table.min_buy_in} - {table.max_buy_in})
                </label>
                <Input
                  type="number"
                  value={buyIn}
                  onChange={(e) => setBuyIn(Number(e.target.value))}
                  min={table.min_buy_in}
                  max={table.max_buy_in}
                />
              </div>
              
              {table.is_private && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter table password"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsJoining(false)}>
                Cancel
              </Button>
              <Button onClick={handleJoin} disabled={loading}>
                {loading ? 'Joining...' : 'Join Now'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
