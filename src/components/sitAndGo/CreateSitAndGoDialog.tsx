
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { SitAndGoGame, DEFAULT_BLIND_STRUCTURES, DEFAULT_PAYOUT_STRUCTURES } from '@/types/sitAndGo';

interface CreateSitAndGoDialogProps {
  onCreateGame: (gameData: Partial<SitAndGoGame>) => Promise<any>;
}

export const CreateSitAndGoDialog: React.FC<CreateSitAndGoDialogProps> = ({ onCreateGame }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    max_players: 6,
    buy_in: 10,
    starting_chips: 1500,
    game_type: 'TURBO' as 'REGULAR' | 'TURBO' | 'HYPER_TURBO'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const gameData = {
      ...formData,
      blind_structure: DEFAULT_BLIND_STRUCTURES[formData.game_type],
      payout_structure: DEFAULT_PAYOUT_STRUCTURES[formData.max_players as keyof typeof DEFAULT_PAYOUT_STRUCTURES] || DEFAULT_PAYOUT_STRUCTURES[6]
    };

    const result = await onCreateGame(gameData);
    if (result) {
      setOpen(false);
      setFormData({
        name: '',
        max_players: 6,
        buy_in: 10,
        starting_chips: 1500,
        game_type: 'TURBO'
      });
    }
  };

  const getGameTypeDescription = (type: string) => {
    switch (type) {
      case 'REGULAR':
        return '10 min levels - Standard pace';
      case 'TURBO':
        return '5 min levels - Fast pace';
      case 'HYPER_TURBO':
        return '3 min levels - Ultra fast';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Sit & Go
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Sit & Go Game</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Game Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter game name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_players">Max Players</Label>
              <Select
                value={formData.max_players.toString()}
                onValueChange={(value) => setFormData({ ...formData, max_players: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Players</SelectItem>
                  <SelectItem value="3">3 Players</SelectItem>
                  <SelectItem value="6">6 Players</SelectItem>
                  <SelectItem value="9">9 Players</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buy_in">Buy-in ($)</Label>
              <Input
                id="buy_in"
                type="number"
                min="1"
                value={formData.buy_in}
                onChange={(e) => setFormData({ ...formData, buy_in: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="starting_chips">Starting Chips</Label>
            <Input
              id="starting_chips"
              type="number"
              min="500"
              step="500"
              value={formData.starting_chips}
              onChange={(e) => setFormData({ ...formData, starting_chips: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="game_type">Game Type</Label>
            <Select
              value={formData.game_type}
              onValueChange={(value: 'REGULAR' | 'TURBO' | 'HYPER_TURBO') => 
                setFormData({ ...formData, game_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REGULAR">Regular</SelectItem>
                <SelectItem value="TURBO">Turbo</SelectItem>
                <SelectItem value="HYPER_TURBO">Hyper Turbo</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {getGameTypeDescription(formData.game_type)}
            </p>
          </div>

          {/* Payout Preview */}
          <Card className="bg-navy/30">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium text-white mb-2">Payout Structure</h4>
              <div className="space-y-1 text-xs text-gray-300">
                {(DEFAULT_PAYOUT_STRUCTURES[formData.max_players as keyof typeof DEFAULT_PAYOUT_STRUCTURES] || DEFAULT_PAYOUT_STRUCTURES[6]).map((payout) => (
                  <div key={payout.position} className="flex justify-between">
                    <span>{payout.position === 1 ? '1st' : payout.position === 2 ? '2nd' : `${payout.position}rd`} Place:</span>
                    <span>{payout.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Game
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
