
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TableFilters } from '@/types/lobby';
import { Search, Filter, X, Settings } from 'lucide-react';
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
    <Card className="bg-slate-800/70 border-emerald/20 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center text-white">
            <Filter className="h-5 w-5 mr-2 text-emerald" />
            {t('lobby.filters', 'Filters')}
          </CardTitle>
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-gray-400 hover:text-white hover:bg-slate-700/50"
            >
              <X className="h-3 w-3 mr-1" />
              {t('common.clear', 'Clear')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-gray-300">{t('lobby.search', 'Search')}</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              placeholder={t('lobby.searchPlaceholder', 'Search tables...')}
              value={filters.searchQuery || ''}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              className="pl-10 bg-slate-800/60 border-emerald/20 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <Separator className="bg-emerald/20" />

        {/* Game Type */}
        <div className="space-y-2">
          <Label className="text-gray-300">{t('lobby.gameType', 'Game Type')}</Label>
          <Select 
            value={filters.tableType || 'ALL'} 
            onValueChange={(value) => onFilterChange({ tableType: value as any })}
          >
            <SelectTrigger className="bg-slate-800/60 border-emerald/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-emerald/20">
              <SelectItem value="ALL" className="text-white hover:bg-slate-700">All Games</SelectItem>
              <SelectItem value="CASH" className="text-white hover:bg-slate-700">Cash Games</SelectItem>
              <SelectItem value="TOURNAMENT" className="text-white hover:bg-slate-700">Tournaments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Buy-in Range */}
        <div className="space-y-3">
          <Label className="text-gray-300">{t('lobby.buyInRange', 'Buy-in Range')}</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-400">{t('common.min', 'Min')}</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.buyInRange[0] || ''}
                onChange={(e) => onFilterChange({ 
                  buyInRange: [e.target.value ? parseFloat(e.target.value) : 0, filters.buyInRange[1]]
                })}
                className="bg-slate-800/60 border-emerald/20 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400">{t('common.max', 'Max')}</Label>
              <Input
                type="number"
                placeholder="∞"
                value={filters.buyInRange[1] || ''}
                onChange={(e) => onFilterChange({ 
                  buyInRange: [filters.buyInRange[0], e.target.value ? parseFloat(e.target.value) : 10000]
                })}
                className="bg-slate-800/60 border-emerald/20 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-emerald/20" />

        {/* Table Options */}
        <div className="space-y-3">
          <Label className="text-gray-300">{t('lobby.tableOptions', 'Table Options')}</Label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filters.showFull ? "default" : "outline"}
              className={`cursor-pointer ${
                filters.showFull 
                  ? 'bg-emerald text-white' 
                  : 'bg-slate-700/50 text-gray-300 border-emerald/20 hover:bg-slate-600/50'
              }`}
              onClick={() => onFilterChange({ showFull: !filters.showFull })}
            >
              {t('lobby.showFull', 'Show Full')}
            </Badge>
            <Badge
              variant={filters.showEmpty ? "default" : "outline"}
              className={`cursor-pointer ${
                filters.showEmpty 
                  ? 'bg-emerald text-white' 
                  : 'bg-slate-700/50 text-gray-300 border-emerald/20 hover:bg-slate-600/50'
              }`}
              onClick={() => onFilterChange({ showEmpty: !filters.showEmpty })}
            >
              {t('lobby.showEmpty', 'Show Empty')}
            </Badge>
            <Badge
              variant={filters.showActive ? "default" : "outline"}
              className={`cursor-pointer ${
                filters.showActive 
                  ? 'bg-emerald text-white' 
                  : 'bg-slate-700/50 text-gray-300 border-emerald/20 hover:bg-slate-600/50'
              }`}
              onClick={() => onFilterChange({ showActive: !filters.showActive })}
            >
              {t('lobby.activeOnly', 'Active Only')}
            </Badge>
            <Badge
              variant={filters.showPrivate ? "default" : "outline"}
              className={`cursor-pointer ${
                filters.showPrivate 
                  ? 'bg-emerald text-white' 
                  : 'bg-slate-700/50 text-gray-300 border-emerald/20 hover:bg-slate-600/50'
              }`}
              onClick={() => onFilterChange({ showPrivate: !filters.showPrivate })}
            >
              {t('lobby.showPrivate', 'Show Private')}
            </Badge>
          </div>
        </div>

        <Separator className="bg-emerald/20" />

        {/* Sort By */}
        <div className="space-y-2">
          <Label className="text-gray-300">{t('lobby.sortBy', 'Sort By')}</Label>
          <Select 
            value={filters.sortBy || 'activity'} 
            onValueChange={(value) => onFilterChange({ sortBy: value as any })}
          >
            <SelectTrigger className="bg-slate-800/60 border-emerald/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-emerald/20">
              <SelectItem value="activity" className="text-white hover:bg-slate-700">Recent Activity</SelectItem>
              <SelectItem value="players" className="text-white hover:bg-slate-700">Player Count</SelectItem>
              <SelectItem value="newest" className="text-white hover:bg-slate-700">Recently Created</SelectItem>
              <SelectItem value="blinds_asc" className="text-white hover:bg-slate-700">Stakes (Low to High)</SelectItem>
              <SelectItem value="blinds_desc" className="text-white hover:bg-slate-700">Stakes (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
