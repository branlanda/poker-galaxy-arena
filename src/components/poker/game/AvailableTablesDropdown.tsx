
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Users, Trophy, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AvailableTable {
  id: string;
  name: string;
  type: 'CASH' | 'TOURNAMENT' | 'SIT_AND_GO';
  players: number;
  maxPlayers: number;
  stakes: string;
  status: 'WAITING' | 'ACTIVE' | 'STARTING';
}

interface AvailableTablesDropdownProps {
  currentTableId?: string;
  onTableSelect: (tableId: string) => void;
}

export const AvailableTablesDropdown: React.FC<AvailableTablesDropdownProps> = ({
  currentTableId,
  onTableSelect
}) => {
  // Mock data - en una implementación real vendría de un hook o API
  const availableTables: AvailableTable[] = [
    {
      id: '1',
      name: 'Mesa Principal',
      type: 'CASH',
      players: 6,
      maxPlayers: 9,
      stakes: '1/2',
      status: 'ACTIVE'
    },
    {
      id: '2',
      name: 'Torneo Nocturno',
      type: 'TOURNAMENT',
      players: 45,
      maxPlayers: 100,
      stakes: '50+5',
      status: 'STARTING'
    },
    {
      id: '3',
      name: 'Sit & Go Rápido',
      type: 'SIT_AND_GO',
      players: 4,
      maxPlayers: 6,
      stakes: '10+1',
      status: 'WAITING'
    }
  ];

  const getTableIcon = (type: string) => {
    switch (type) {
      case 'TOURNAMENT':
        return <Trophy className="w-4 h-4" />;
      case 'SIT_AND_GO':
        return <Clock className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      WAITING: { label: 'Esperando', variant: 'secondary' as const },
      ACTIVE: { label: 'Activa', variant: 'default' as const },
      STARTING: { label: 'Iniciando', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.WAITING;
    
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      CASH: 'Cash Game',
      TOURNAMENT: 'Torneo',
      SIT_AND_GO: 'Sit & Go'
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald/10"
        >
          <Users className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Otras Mesas</span>
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 bg-slate-800 border-slate-600 text-white"
        align="end"
      >
        <DropdownMenuLabel className="text-emerald-400">
          Mesas Disponibles
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-600" />
        
        {availableTables.map((table) => (
          <DropdownMenuItem
            key={table.id}
            className="p-3 hover:bg-slate-700 cursor-pointer"
            onClick={() => onTableSelect(table.id)}
            disabled={table.id === currentTableId}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {getTableIcon(table.type)}
                <div>
                  <div className="font-medium text-white">{table.name}</div>
                  <div className="text-xs text-gray-400">
                    {getTypeLabel(table.type)} • ${table.stakes}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-400">
                  {table.players}/{table.maxPlayers}
                </div>
                {getStatusBadge(table.status)}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-slate-600" />
        <DropdownMenuItem 
          className="p-3 hover:bg-slate-700 cursor-pointer text-emerald-400"
          onClick={() => {/* Navegar al lobby */}}
        >
          <Users className="w-4 h-4 mr-2" />
          Ver todas las mesas
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
