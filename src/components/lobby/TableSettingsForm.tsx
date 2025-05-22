
import { useState, useEffect } from 'react';
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
import { TableType } from '@/types/lobby';

interface TableSettingsFormProps {
  name: string;
  setName: (name: string) => void;
  smallBlind: number;
  setSmallBlind: (value: number) => void;
  bigBlind: number;
  setBigBlind: (value: number) => void;
  minBuyIn: number;
  setMinBuyIn: (value: number) => void;
  maxBuyIn: number;
  setMaxBuyIn: (value: number) => void;
  maxPlayers: number;
  setMaxPlayers: (value: number) => void;
  tableType: TableType;
  setTableType: (value: TableType) => void;
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  password: string;
  setPassword: (value: string) => void;
}

export function TableSettingsForm({
  name,
  setName,
  smallBlind,
  setSmallBlind,
  bigBlind,
  setBigBlind,
  minBuyIn,
  setMinBuyIn,
  maxBuyIn,
  setMaxBuyIn,
  maxPlayers,
  setMaxPlayers,
  tableType,
  setTableType,
  isPrivate,
  setIsPrivate,
  password,
  setPassword
}: TableSettingsFormProps) {
  // Update min/max buy-in when big blind changes
  const handleBigBlindChange = (value: number) => {
    setBigBlind(value);
    setMinBuyIn(value * 20); // Minimum buy-in is 20x big blind
    setMaxBuyIn(value * 100); // Maximum buy-in is 100x big blind
  };

  return (
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
  );
}
