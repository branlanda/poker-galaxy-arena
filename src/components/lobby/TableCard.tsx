
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
          <div>
            <p className="text-gray-400">Players</p>
            <p>{table.current_players} / {table.max_players}</p>
          </div>
          <div>
            <p className="text-gray-400">Status</p>
            <p>{table.status}</p>
          </div>
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
