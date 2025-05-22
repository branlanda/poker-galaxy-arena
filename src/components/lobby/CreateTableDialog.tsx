
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTable } from '@/hooks/useCreateTable';
import { TableType } from '@/types/lobby';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export function CreateTableDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [smallBlind, setSmallBlind] = useState(1);
  const [bigBlind, setBigBlind] = useState(2);
  const [minBuyIn, setMinBuyIn] = useState(40); // 20x Big Blind
  const [maxBuyIn, setMaxBuyIn] = useState(200); // 100x Big Blind
  const [maxPlayers, setMaxPlayers] = useState(9);
  const [tableType, setTableType] = useState<TableType>('CASH');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  
  const { createTable, loading } = useCreateTable();
  const navigate = useNavigate();
  
  // Update min/max buy-in when big blind changes
  const handleBigBlindChange = (value: number) => {
    setBigBlind(value);
    setMinBuyIn(value * 20); // Minimum buy-in is 20x big blind
    setMaxBuyIn(value * 100); // Maximum buy-in is 100x big blind
  };
  
  const handleSubmit = async () => {
    const newTable = await createTable({
      name,
      smallBlind,
      bigBlind,
      minBuyIn,
      maxBuyIn,
      maxPlayers,
      tableType,
      isPrivate,
      password: isPrivate ? password : undefined,
    });
    
    if (newTable) {
      setOpen(false);
      // Navigate to the new table
      navigate(`/game/${newTable.id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Create Table
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Poker Table</DialogTitle>
          <DialogDescription>
            Configure your table settings below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Table Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your table"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="table-type">Table Type</Label>
              <Select 
                value={tableType} 
                onValueChange={(value) => setTableType(value as TableType)}
              >
                <SelectTrigger id="table-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash Game</SelectItem>
                  <SelectItem value="TOURNAMENT">Tournament</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-players">Max Players</Label>
              <Select 
                value={String(maxPlayers)} 
                onValueChange={(value) => setMaxPlayers(Number(value))}
              >
                <SelectTrigger id="max-players">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={String(num)}>{num} Players</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="small-blind">Small Blind</Label>
              <Input
                id="small-blind"
                type="number"
                value={smallBlind}
                onChange={(e) => setSmallBlind(Number(e.target.value))}
                min={1}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="big-blind">Big Blind</Label>
              <Input
                id="big-blind"
                type="number"
                value={bigBlind}
                onChange={(e) => handleBigBlindChange(Number(e.target.value))}
                min={2}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-buyin">Min Buy-in</Label>
              <Input
                id="min-buyin"
                type="number"
                value={minBuyIn}
                onChange={(e) => setMinBuyIn(Number(e.target.value))}
                min={bigBlind * 20}
              />
              <p className="text-xs text-gray-400">Min: {bigBlind * 20} (20x BB)</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-buyin">Max Buy-in</Label>
              <Input
                id="max-buyin"
                type="number"
                value={maxBuyIn}
                onChange={(e) => setMaxBuyIn(Number(e.target.value))}
                min={minBuyIn}
              />
              <p className="text-xs text-gray-400">Suggested: {bigBlind * 100} (100x BB)</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
            <Label htmlFor="private">Private Table</Label>
          </div>
          
          {isPrivate && (
            <div className="space-y-2">
              <Label htmlFor="password">Table Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password for your table"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !name}>
            {loading ? 'Creating...' : 'Create Table'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
