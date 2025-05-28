
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { TableFilters } from '@/types/lobby';
import { Search, Filter, X, Settings, DollarSign, Users, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface LobbyFiltersProps {
  filters: TableFilters;
  onFilterChange: (filters: Partial<TableFilters>) => void;
}

export function LobbyFilters({ filters, onFilterChange }: LobbyFiltersProps) {
  const { t } = useTranslation();

  const hasActiveFilters = () => {
    return filters.searchQuery ||
           filters.tableType !== 'ALL' ||
           filters.buyInRange[0] > 0 ||
           filters.buyInRange[1] < 10000 ||
           filters.showFull !== true ||
           filters.showEmpty !== true ||
           filters.sortBy !== 'activity';
  };

  const clearFilters = () => {
    onFilterChange({
      searchQuery: '',
      tableType: 'ALL',
      buyInRange: [0, 10000],
      blindsRange: [0, 1000],
      showFull: true,
      showEmpty: true,
      showActive: false,
      showPrivate: true,
      sortBy: 'activity'
    });
  };

  return (
    <Card className="bg-slate-900/90 border-emerald/30 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center text-white font-semibold">
            <Filter className="h-5 w-5 mr-2 text-emerald-400" />
            {t('lobby.filters', 'Filtros')}
          </CardTitle>
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald/10"
            >
              <X className="h-3 w-3 mr-1" />
              {t('common.clear', 'Limpiar')}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-gray-300 font-medium">
            {t('lobby.search', 'Buscar')}
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              placeholder={t('lobby.searchPlaceholder', 'Buscar mesas...')}
              value={filters.searchQuery || ''}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              className="pl-10 bg-slate-800/60 border-emerald/30 text-white placeholder-gray-400 focus:border-emerald/50"
            />
          </div>
        </div>

        <Separator className="bg-emerald/20" />

        {/* Game Type */}
        <div className="space-y-3">
          <Label className="text-gray-300 font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-emerald-400" />
            {t('lobby.gameType', 'Tipo de Juego')}
          </Label>
          <Select 
            value={filters.tableType || 'ALL'} 
            onValueChange={(value) => onFilterChange({ tableType: value as any })}
          >
            <SelectTrigger className="bg-slate-800/60 border-emerald/30 text-white hover:border-emerald/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-emerald/30">
              <SelectItem value="ALL" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                Todos los Juegos
              </SelectItem>
              <SelectItem value="CASH" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                Juegos de Dinero
              </SelectItem>
              <SelectItem value="TOURNAMENT" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                Torneos
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buy-in Range */}
        <div className="space-y-4">
          <Label className="text-gray-300 font-medium flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-emerald-400" />
            {t('lobby.buyInRange', 'Rango de Buy-in')}
          </Label>
          <div className="space-y-3">
            <Slider
              value={filters.buyInRange}
              onValueChange={(value) => onFilterChange({ buyInRange: value as [number, number] })}
              max={10000}
              min={0}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>${filters.buyInRange[0]}</span>
              <span>${filters.buyInRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-emerald/20" />

        {/* Table Options */}
        <div className="space-y-3">
          <Label className="text-gray-300 font-medium flex items-center">
            <Users className="h-4 w-4 mr-2 text-emerald-400" />
            {t('lobby.tableOptions', 'Opciones de Mesa')}
          </Label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filters.showFull ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                filters.showFull 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-slate-700/50 text-gray-300 border-emerald/30 hover:bg-emerald/10 hover:text-emerald-300'
              }`}
              onClick={() => onFilterChange({ showFull: !filters.showFull })}
            >
              {t('lobby.showFull', 'Mostrar Llenas')}
            </Badge>
            <Badge
              variant={filters.showEmpty ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                filters.showEmpty 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-slate-700/50 text-gray-300 border-emerald/30 hover:bg-emerald/10 hover:text-emerald-300'
              }`}
              onClick={() => onFilterChange({ showEmpty: !filters.showEmpty })}
            >
              {t('lobby.showEmpty', 'Mostrar Vacías')}
            </Badge>
            <Badge
              variant={filters.showActive ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                filters.showActive 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-slate-700/50 text-gray-300 border-emerald/30 hover:bg-emerald/10 hover:text-emerald-300'
              }`}
              onClick={() => onFilterChange({ showActive: !filters.showActive })}
            >
              {t('lobby.activeOnly', 'Solo Activas')}
            </Badge>
            <Badge
              variant={filters.showPrivate ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                filters.showPrivate 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-slate-700/50 text-gray-300 border-emerald/30 hover:bg-emerald/10 hover:text-emerald-300'
              }`}
              onClick={() => onFilterChange({ showPrivate: !filters.showPrivate })}
            >
              {t('lobby.showPrivate', 'Mostrar Privadas')}
            </Badge>
          </div>
        </div>

        <Separator className="bg-emerald/20" />

        {/* Sort By */}
        <div className="space-y-3">
          <Label className="text-gray-300 font-medium flex items-center">
            <Settings className="h-4 w-4 mr-2 text-emerald-400" />
            {t('lobby.sortBy', 'Ordenar Por')}
          </Label>
          <Select 
            value={filters.sortBy || 'activity'} 
            onValueChange={(value) => onFilterChange({ sortBy: value as any })}
          >
            <SelectTrigger className="bg-slate-800/60 border-emerald/30 text-white hover:border-emerald/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-emerald/30">
              <SelectItem value="activity" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                Actividad Reciente
              </SelectItem>
              <SelectItem value="players" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                Cantidad de Jugadores
              </SelectItem>
              <SelectItem value="newest" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                Recién Creadas
              </SelectItem>
              <SelectItem value="blinds_asc" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                Stakes (Menor a Mayor)
              </SelectItem>
              <SelectItem value="blinds_desc" className="text-white hover:bg-slate-700 focus:bg-slate-700">
                Stakes (Mayor a Menor)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
