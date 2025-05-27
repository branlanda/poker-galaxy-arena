
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from '@/hooks/useTranslation';
import { TableType } from '@/types/lobby';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableSettingsFormProps {
  name: string;
  setName: (value: string) => void;
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
  const { t } = useTranslation();
  
  // Auto-update related values when blinds change
  const updateBlinds = (field: 'small' | 'big', value: number) => {
    if (field === 'small') {
      setSmallBlind(value);
      const newBigBlind = value * 2;
      setBigBlind(newBigBlind);
      setMinBuyIn(newBigBlind * 20);
      setMaxBuyIn(newBigBlind * 100);
    } else {
      setBigBlind(value);
      setMinBuyIn(value * 20);
      setMaxBuyIn(value * 100);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Table Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white font-medium">
          🎯 Table Name *
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter table name (e.g., High Stakes Fun)"
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald"
          maxLength={50}
        />
        <p className="text-xs text-gray-400">
          Choose a unique name for your table (3-50 characters)
        </p>
      </div>

      {/* Blinds Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="smallBlind" className="text-white font-medium">
            💰 Small Blind
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald font-bold">$</span>
            <Input
              id="smallBlind"
              type="number"
              className="pl-8 bg-gray-800 border-gray-600 text-white focus:border-emerald"
              value={smallBlind}
              onChange={(e) => updateBlinds('small', Number(e.target.value))}
              min={0.01}
              step={0.01}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bigBlind" className="text-white font-medium">
            💰 Big Blind
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald font-bold">$</span>
            <Input
              id="bigBlind"
              type="number"
              className="pl-8 bg-gray-800 border-gray-600 text-white focus:border-emerald"
              value={bigBlind}
              onChange={(e) => updateBlinds('big', Number(e.target.value))}
              min={smallBlind * 2}
              step={0.01}
            />
          </div>
        </div>
      </div>

      {/* Buy-in Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minBuyIn" className="text-white font-medium">
            💵 Minimum Buy-in
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald font-bold">$</span>
            <Input
              id="minBuyIn"
              type="number"
              className="pl-8 bg-gray-800 border-gray-600 text-white focus:border-emerald"
              value={minBuyIn}
              onChange={(e) => setMinBuyIn(Number(e.target.value))}
              min={bigBlind * 10}
              step={0.01}
            />
          </div>
          <p className="text-xs text-gray-400">
            Recommended: ${bigBlind * 20} (20x BB)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxBuyIn" className="text-white font-medium">
            💵 Maximum Buy-in
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald font-bold">$</span>
            <Input
              id="maxBuyIn"
              type="number"
              className="pl-8 bg-gray-800 border-gray-600 text-white focus:border-emerald"
              value={maxBuyIn}
              onChange={(e) => setMaxBuyIn(Number(e.target.value))}
              min={minBuyIn}
              step={0.01}
            />
          </div>
          <p className="text-xs text-gray-400">
            Recommended: ${bigBlind * 100} (100x BB)
          </p>
        </div>
      </div>

      {/* Game Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxPlayers" className="text-white font-medium">
            👥 Max Players
          </Label>
          <Select
            value={String(maxPlayers)}
            onValueChange={(value) => setMaxPlayers(Number(value))}
          >
            <SelectTrigger id="maxPlayers" className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Select max players" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="2">2 Players (Heads-up)</SelectItem>
              <SelectItem value="6">6 Players (Short-handed)</SelectItem>
              <SelectItem value="9">9 Players (Full ring)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tableType" className="text-white font-medium">
            🎮 Game Type
          </Label>
          <Select
            value={tableType}
            onValueChange={(value) => setTableType(value as TableType)}
          >
            <SelectTrigger id="tableType" className="bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Select game type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="CASH">💰 Cash Game</SelectItem>
              <SelectItem value="TOURNAMENT">🏆 Tournament</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-white font-medium">🔒 Private Table</Label>
            <p className="text-sm text-gray-400">
              Only players with the password can join
            </p>
          </div>
          <Switch 
            checked={isPrivate} 
            onCheckedChange={setIsPrivate}
            className="data-[state=checked]:bg-emerald"
          />
        </div>

        {isPrivate && (
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white font-medium">
              🔑 Table Password *
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a secure password"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald"
              minLength={3}
            />
            <p className="text-xs text-gray-400">
              Minimum 3 characters required
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
