
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LobbyTable } from '@/types/lobby';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { Gamepad2, Lock, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface JoinTableDialogProps {
  table: LobbyTable;
}

export function JoinTableDialog({ table }: JoinTableDialogProps) {
  const [buyIn, setBuyIn] = useState(table.min_buy_in);
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoinTable = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join a table",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (table.is_private && !password) {
      toast({
        title: "Password Required",
        description: "This is a private table, please enter the password",
        variant: "destructive",
      });
      return;
    }

    if (buyIn < table.min_buy_in || buyIn > table.max_buy_in) {
      toast({
        title: "Invalid Buy-in",
        description: `Buy-in must be between $${table.min_buy_in} and $${table.max_buy_in}`,
        variant: "destructive",
      });
      return;
    }

    // Navigate to the game room
    navigate(`/game/${table.id}`);
    setIsOpen(false);
  };

  const isFull = table.current_players >= table.max_players;
  const isWaiting = table.status === 'WAITING';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-emerald hover:bg-emerald-600 text-white font-medium"
          disabled={isFull}
        >
          <Gamepad2 className="w-4 h-4 mr-2" />
          {isFull ? 'Table Full' : 'Join My Table'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800/95 backdrop-blur-sm border-emerald/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-emerald flex items-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            Join Table: {table.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Table Info */}
          <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Blinds:</span>
              <span className="text-white">${table.small_blind}/${table.big_blind}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Players:</span>
              <span className="text-white">{table.current_players}/{table.max_players}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Buy-in Range:</span>
              <span className="text-white">${table.min_buy_in} - ${table.max_buy_in}</span>
            </div>
            {table.is_private && (
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <Lock className="w-4 h-4" />
                Private Table
              </div>
            )}
          </div>

          {/* Buy-in Input */}
          <div className="space-y-2">
            <Label htmlFor="buyIn" className="text-gray-300">Buy-in Amount</Label>
            <Input
              id="buyIn"
              type="number"
              value={buyIn}
              onChange={(e) => setBuyIn(Number(e.target.value))}
              min={table.min_buy_in}
              max={table.max_buy_in}
              className="bg-slate-700/50 border-emerald/20 text-white"
            />
            <p className="text-xs text-gray-400">
              Min: ${table.min_buy_in} - Max: ${table.max_buy_in}
            </p>
          </div>

          {/* Password Input for Private Tables */}
          {table.is_private && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Table Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700/50 border-emerald/20 text-white"
                placeholder="Enter table password"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-emerald/20 text-gray-300 hover:bg-slate-700/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinTable}
              className="flex-1 bg-emerald hover:bg-emerald-600 text-white"
              disabled={isFull}
            >
              <Users className="w-4 h-4 mr-2" />
              Join Table
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
