
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
  
  // Auto-update related values
  const updateRelatedValues = (field: 'smallBlind' | 'bigBlind', value: number) => {
    if (field === 'smallBlind') {
      setSmallBlind(value);
      // Big blind is typically 2x small blind
      setBigBlind(value * 2);
      // Min buy-in is typically at least 20x big blind
      setMinBuyIn(value * 2 * 20);
      // Max buy-in is typically at least 100x big blind
      setMaxBuyIn(value * 2 * 100);
    } else if (field === 'bigBlind') {
      setBigBlind(value);
      // Min buy-in is typically at least 20x big blind
      setMinBuyIn(value * 20);
      // Max buy-in is typically at least 100x big blind
      setMaxBuyIn(value * 100);
    }
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('tableName', 'Nombre de la mesa')}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('enterTableName', 'Ingresa un nombre para tu mesa')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="smallBlind">{t('smallBlind', 'Small Blind')}</Label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="smallBlind"
              type="number"
              className="pl-6"
              value={smallBlind}
              onChange={(e) => updateRelatedValues('smallBlind', Number(e.target.value))}
              min={1}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bigBlind">{t('bigBlind', 'Big Blind')}</Label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="bigBlind"
              type="number"
              className="pl-6"
              value={bigBlind}
              onChange={(e) => updateRelatedValues('bigBlind', Number(e.target.value))}
              min={smallBlind * 2}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minBuyIn">{t('minBuyIn', 'Buy-in mínimo')}</Label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="minBuyIn"
              type="number"
              className="pl-6"
              value={minBuyIn}
              onChange={(e) => setMinBuyIn(Number(e.target.value))}
              min={bigBlind * 20}
            />
          </div>
          <p className="text-xs text-gray-500">
            {t('suggestedMinBuyIn', 'Sugerido: 20x Big Blind ({value})', {
              value: bigBlind * 20
            })}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxBuyIn">{t('maxBuyIn', 'Buy-in máximo')}</Label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="maxBuyIn"
              type="number"
              className="pl-6"
              value={maxBuyIn}
              onChange={(e) => setMaxBuyIn(Number(e.target.value))}
              min={minBuyIn}
            />
          </div>
          <p className="text-xs text-gray-500">
            {t('suggestedMaxBuyIn', 'Sugerido: 100x Big Blind ({value})', {
              value: bigBlind * 100
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxPlayers">{t('maxPlayers', 'Jugadores máximos')}</Label>
          <Select
            value={String(maxPlayers)}
            onValueChange={(value) => setMaxPlayers(Number(value))}
          >
            <SelectTrigger id="maxPlayers">
              <SelectValue placeholder={t('selectMaxPlayers', 'Selecciona el máximo de jugadores')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="9">9</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tableType">{t('tableType', 'Tipo de mesa')}</Label>
          <Select
            value={tableType}
            onValueChange={(value) => setTableType(value as TableType)}
          >
            <SelectTrigger id="tableType">
              <SelectValue placeholder={t('selectTableType', 'Selecciona el tipo de mesa')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">{t('cashGame', 'Partida de Efectivo')}</SelectItem>
              <SelectItem value="TOURNAMENT">{t('tournament', 'Torneo')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>{t('privateTable', 'Mesa privada')}</Label>
          <p className="text-xs text-gray-500">{t('privateTableDescription', 'Requiere contraseña para unirse')}</p>
        </div>
        <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
      </div>

      {isPrivate && (
        <div className="space-y-2">
          <Label htmlFor="password">{t('tablePassword', 'Contraseña de la mesa')}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('enterTablePassword', 'Ingresa una contraseña')}
          />
        </div>
      )}
    </div>
  );
}
